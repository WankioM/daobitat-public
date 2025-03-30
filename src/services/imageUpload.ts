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
 * Uploads an image directly to the server instead of using signed URLs
 * This avoids CORS issues with direct GCS uploads
 * @param file Either a File object or a Blob
 */
export const uploadImageToGCS = async (file: File | Blob): Promise<string> => {
  try {
    // Generate a filename
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 10000);
    const extension = file.type.split('/')[1] || 'jpg';
    const fileName = `${FOLDER_NAME}/${timestamp}-${randomSuffix}.${extension}`;
    
    console.log(`Starting upload for file: ${fileName}`);
    
    // Step 1: Create a FormData object to send the file directly to our backend
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', fileName);
    formData.append('fileType', file.type);
    
    // Step 2: Use our backend as a proxy to upload to GCS
    // Create a new endpoint in your Express backend for this
    const uploadResponse = await withRetry(
      () => api.post('/api/direct-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
      3
    );
    
    if (!uploadResponse?.data?.data?.publicUrl) {
      throw new Error('Failed to get valid upload response');
    }
    
    const { publicUrl } = uploadResponse.data.data;
    
    console.log(`File uploaded successfully to GCS: ${publicUrl}`);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadImageToGCS:', error);
    throw error; // Let the caller handle this
  }
};

// FALLBACK METHOD: If we can't implement a direct upload endpoint
export const uploadImageFallback = async (file: File | Blob): Promise<string> => {
  try {
    // Convert the file to base64
    const base64Data = await fileToBase64(file);
    
    // Send the base64 data to the backend
    const uploadResponse = await api.post('/api/base64-upload', {
      fileName: `${FOLDER_NAME}/${Date.now()}-${Math.floor(Math.random() * 10000)}.${file.type.split('/')[1] || 'jpg'}`,
      fileType: file.type,
      base64Data: base64Data
    });
    
    if (!uploadResponse?.data?.data?.publicUrl) {
      throw new Error('Failed to get valid upload response');
    }
    
    return uploadResponse.data.data.publicUrl;
  } catch (error) {
    console.error('Error in uploadImageFallback:', error);
    throw error;
  }
};

// Helper to convert File to base64
const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64.substring(base64.indexOf(',') + 1);
      resolve(base64Data);
    };
    reader.onerror = error => reject(error);
  });
};