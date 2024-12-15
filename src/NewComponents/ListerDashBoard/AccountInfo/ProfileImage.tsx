import React, { useState } from 'react';
import { FaUser, FaCamera } from 'react-icons/fa';
import { uploadImageToGCS } from '../../../services/imageUpload';

interface ProfileImageSectionProps {
  currentImageUrl: string | null;
  onImageUpdate: (url: string) => Promise<void>;
}

const ProfileImageSection: React.FC<ProfileImageSectionProps> = ({
  currentImageUrl,
  onImageUpdate
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }

      setIsUploading(true);
      try {
        const imageUrl = await uploadImageToGCS(file);
        await onImageUpdate(imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="relative w-32 h-32 mx-auto mb-6">
      <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border-4 border-[#24191E]">
        {currentImageUrl ? (
          <img
            src={currentImageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <FaUser size={48} className="text-gray-400" />
          </div>
        )}
      </div>
      
      <label
        htmlFor="profile-upload"
        className={`absolute bottom-0 right-0 w-10 h-10 bg-[#24191E] rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors duration-200 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isUploading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <FaCamera className="text-white" size={20} />
        )}
        <input
          id="profile-upload"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default ProfileImageSection;
