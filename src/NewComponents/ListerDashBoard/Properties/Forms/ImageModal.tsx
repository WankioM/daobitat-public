import React, { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUpload, FaTimes, FaExclamationTriangle } from 'react-icons/fa';
import { uploadImageToGCS } from '../../../../services/imageUpload';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (images: string[]) => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [uploadErrors, setUploadErrors] = useState<{[key: string]: string}>({});

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    // Validate file sizes and types
    const validFiles: File[] = [];
    const newPreviews: string[] = [];
    const errors: {[key: string]: string} = {};
    
    Array.from(e.target.files).forEach(file => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errors[file.name] = `File too large (max 5MB)`;
        return;
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        errors[file.name] = `Not an image file`;
        return;
      }
      
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });
    
    if (Object.keys(errors).length > 0) {
      setUploadErrors(prev => ({...prev, ...errors}));
    }
    
    setSelectedFiles(prev => [...prev, ...validFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  }, []);

  const handleRemoveFile = (index: number) => {
    URL.revokeObjectURL(previews[index]);
    
    // Clear any errors for this file
    const fileName = selectedFiles[index].name;
    setUploadErrors(prev => {
      const newErrors = {...prev};
      delete newErrors[fileName];
      return newErrors;
    });
    
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  // In handleUpload function in ImageModal.tsx
// Update handleUpload in ImageModal.tsx
const handleUpload = async () => {
  if (selectedFiles.length === 0) return;
  
  setUploading(true);
  setUploadErrors({});
  
  try {
    // Keep track of successful uploads and failures
    const uploadedUrls: string[] = [];
    const failedFiles: string[] = [];
    
    // Process files sequentially to avoid overwhelming the server
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      try {
        // Update progress to show we're starting
        setUploadProgress(prev => ({...prev, [file.name]: 10}));
        
        // First attempt: Create a blob URL (this is a guaranteed local fallback)
        const localUrl = URL.createObjectURL(file);
        
        // Set intermediate progress
        setUploadProgress(prev => ({...prev, [file.name]: 50}));
        
        // Attempt to upload to server with uploadImageToGCS
        try {
          const fileUrl = await uploadImageToGCS(file);
          
          // Add the remote URL to our successful uploads
          if (fileUrl && !fileUrl.startsWith('blob:')) {
            uploadedUrls.push(fileUrl);
            setUploadProgress(prev => ({...prev, [file.name]: 100}));
          } else {
            // If we got back a blob URL, use our own local one
            uploadedUrls.push(localUrl);
            // Add to failed list for reporting
            failedFiles.push(file.name);
            setUploadProgress(prev => ({...prev, [file.name]: 100}));
          }
        } catch (uploadError) {
          console.error(`Upload error for ${file.name}:`, uploadError);
          
          // Use the local URL as fallback
          uploadedUrls.push(localUrl);
          failedFiles.push(file.name);
          
          // Set error but don't interrupt the process
          setUploadErrors(prev => ({
            ...prev,
            [file.name]: uploadError instanceof Error ? uploadError.message : 'Upload failed'
          }));
          
          setUploadProgress(prev => ({...prev, [file.name]: 100}));
        }
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError);
        failedFiles.push(file.name);
        setUploadErrors(prev => ({
          ...prev,
          [file.name]: fileError instanceof Error ? fileError.message : 'Processing failed'
        }));
      }
    }
    
    // If we have any successful uploads, return them
    if (uploadedUrls.length > 0) {
      // If some failed but others succeeded, show a warning
      if (failedFiles.length > 0) {
        setUploadErrors(prev => ({
          ...prev,
          general: `${failedFiles.length} file(s) couldn't be uploaded to the server but will be shown locally. The property will still be created.`
        }));
        
        // Wait a moment to show the message
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      onUpload(uploadedUrls);
      onClose();
    } else {
      throw new Error('All uploads failed');
    }
  } catch (error) {
    console.error('Upload process failed:', error);
    setUploadErrors(prev => ({
      ...prev,
      general: 'Upload process failed. Please try again or contact support if the problem persists.'
    }));
  } finally {
    setUploading(false);
  }
};

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload Images</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes />
              </button>
            </div>

            <div className="space-y-4">
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files) {
                    handleFileSelect({
                      target: { files: e.dataTransfer.files }
                    } as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <FaUpload className="text-3xl text-gray-400" />
                  <span className="text-gray-500">
                    Drag and drop images or click to upload
                  </span>
                  <span className="text-xs text-gray-400">
                    Maximum 5MB per image • JPG, PNG, GIF supported
                  </span>
                </label>
              </div>

              {uploadErrors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg flex items-start">
                  <FaExclamationTriangle className="text-red-500 mt-1 mr-2 flex-shrink-0" />
                  <span>{uploadErrors.general}</span>
                </div>
              )}

              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      {uploadErrors[selectedFiles[index]?.name] && (
                        <div className="absolute inset-0 bg-red-100 bg-opacity-40 flex items-center justify-center">
                          <span className="text-xs text-red-700 bg-white p-1 rounded">
                            {uploadErrors[selectedFiles[index].name]}
                          </span>
                        </div>
                      )}
                      {uploadProgress[selectedFiles[index]?.name] > 0 && 
                       uploadProgress[selectedFiles[index]?.name] < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                          <div 
                            className="h-full bg-celadon" 
                            style={{width: `${uploadProgress[selectedFiles[index].name]}%`}}
                          />
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        disabled={uploading}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={uploading || previews.length === 0}
                  className={`px-4 py-2 bg-celadon text-white rounded-lg flex items-center ${
                    uploading || previews.length === 0
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-celadon/90'
                  }`}
                >
                  {uploading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {uploading ? 'Uploading...' : 'Upload'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ImageUploadModal;