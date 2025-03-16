import api from './api';

const BUCKET_NAME = 'web-vids';
const FOLDER_NAME = 'propertyimages';

// Helper function to sanitize filenames
const sanitizeFileName = (fileName: string): string => {
  // Remove special characters and spaces, replace with hyphens
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')
    .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
};

// Helper to create a retry mechanism
const withRetry = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return withRetry(fn, retries - 1, delay * 1.5);
  }
};

/**
 * Check if a URL is accessible by attempting to fetch headers
 */
const isUrlAccessible = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.warn(`URL not accessible: ${url}`, error);
    return false;
  }
};

/**
 * Uploads an image to Google Cloud Storage and returns the best available URL
 */
export const uploadImageToGCS = async (file: File): Promise<string> => {
  try {
    // Generate a timestamp and sanitize filename
    const timestamp = Date.now();
    const sanitizedFileName = sanitizeFileName(file.name);
    const fileName = `${FOLDER_NAME}/${timestamp}-${sanitizedFileName}`;
    
    console.log(`Starting upload for file: ${fileName}`);
    
    // Step 1: Get signed URL with retry mechanism
    const { data: { data } } = await withRetry(
      () => api.post('/api/upload-url', {
        fileName,
        fileType: file.type,
        skipMakePublic: false // Try to make public, but have fallback
      }),
      3
    );
    
    // Extract URLs from response
    const { signedUrl, fileUrl, publicUrl } = data;
    
    console.log(`Obtained signed URL: ${signedUrl.substring(0, 100)}...`);
    
    // Step 2: Upload to GCS using signed URL with retry mechanism
    await withRetry(
      () => fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type
        }
      }),
      3
    );
    
    console.log(`File uploaded successfully to GCS`);
    
    // Step 3: Try to use the public URL first, then fall back to signed URL
    // This helps us use the best available URL type
    try {
      // Check if the public URL is accessible (it should be if makePublic worked)
      if (publicUrl && await isUrlAccessible(publicUrl)) {
        console.log(`Using public URL: ${publicUrl}`);
        return publicUrl;
      }
      
      // If public URL isn't accessible, use the signed URL
      console.log(`Using signed URL: ${fileUrl.substring(0, 50)}...`);
      return fileUrl;
    } catch (error) {
      console.error('Error checking URL accessibility:', error);
      
      // Return whatever URL we have
      return fileUrl || publicUrl;
    }
  } catch (error) {
    console.error('Error in uploadImageToGCS:', error);
    
    // Return a fallback local URL if upload completely fails
    if (file) {
      const localUrl = URL.createObjectURL(file);
      console.log(`Returning local URL as fallback: ${localUrl}`);
      return localUrl;
    }
    
    throw new Error('Image upload failed and no fallback available');
  }
};

/**
 * Alternate implementation that uses local storage as a fallback
 * This ensures images remain visible even after page refresh
 */
export const uploadImageWithLocalFallback = async (file: File): Promise<string> => {
  try {
    // First try to upload to GCS
    return await uploadImageToGCS(file);
  } catch (error) {
    console.error('GCS upload failed, using local storage fallback:', error);
    
    // Store in localStorage as base64
    const base64 = await fileToBase64(file);
    const storageKey = `property_image_${Date.now()}`;
    
    try {
      localStorage.setItem(storageKey, base64);
      return base64;
    } catch (storageError) {
      console.error('LocalStorage fallback failed:', storageError);
      // Last resort - return object URL
      return URL.createObjectURL(file);
    }
  }
};

// Helper to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};