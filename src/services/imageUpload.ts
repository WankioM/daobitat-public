import api from './api';

const BUCKET_NAME = 'web-vids';
const FOLDER_NAME = 'profileimages';

export const uploadImageToGCS = async (file: File): Promise<string> => {
  try {
    // Get signed URL
    const { data: { data: { signedUrl, fileUrl, fileName } } } = await api.post('/api/upload-url', {
      fileName: `${FOLDER_NAME}/${Date.now()}-${file.name}`,
      fileType: file.type
    });

    // Upload to GCS using signed URL
    await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type
      }
    });

    // Make file public
    await api.post('/api/make-public', { fileName });

    return fileUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};