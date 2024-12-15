// src/components/AccountInfo/AccountInfo.tsx
import React, { useEffect, useState } from 'react';
import { FaPen, FaCheck, FaTrash } from 'react-icons/fa';
import { useUser } from '../../../NewContexts/UserContext';
import { userService } from '../../../services/userService';
import ProfileImageSection from './ProfileImage';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';

interface UserData {
  name: string;
  profileImage: string | null;
  role: string;
  verified?: {
    email: boolean;
    phone: boolean;
    wallet: boolean;
  };
  properties?: any[];
}

const AccountInfo: React.FC = () => {
  const { user, signOutUser } = useUser();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user?._id) return;
      
      try {
        const response = await userService.getUserProfile(user._id);
        setUserData(response.data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [user?._id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!userData) return;
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user?._id || !userData) return;

    try {
      const response = await userService.updateUserProfile(user._id, userData);
      setUserData(response.data.user);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      console.error('Error updating user data:', error);
      setError('Failed to update profile');
    }
  };

  const handleImageUpdate = async (imageUrl: string) => {
    if (!user?._id) return;

    try {
      const response = await userService.updateUserProfile(user._id, {
        profileImage: imageUrl
      });
      setUserData(response.data.user);
      setError(null);
    } catch (error) {
      console.error('Error updating profile image:', error);
      setError('Failed to update profile image');
      throw error; // Re-throw to be handled by the ProfileImageSection
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (!user?._id) return;

    setIsDeleting(true);
    try {
      await userService.deleteAccount(user._id);
      signOutUser();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setError('Failed to delete account');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#24191E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-helvetica-medium text-[#24191E] mb-6 text-center">
          Account Information
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <ProfileImageSection
          currentImageUrl={userData?.profileImage || null}
          onImageUpdate={handleImageUpdate}
        />

        <div className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-helvetica-medium text-gray-600 mb-2">
              Name
            </label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={userData?.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#24191E] focus:border-transparent font-helvetica-light"
              />
            ) : (
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg">
                <span className="font-helvetica-light">
                  {userData?.name || 'Not set'}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-500 hover:text-[#24191E]"
                >
                  <FaPen size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-helvetica-medium text-gray-600 mb-2">
              Role
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg">
              <span className="font-helvetica-light capitalize">
                {userData?.role || 'Not set'}
              </span>
            </div>
          </div>

          <div className="relative">
            <label className="block text-sm font-helvetica-medium text-gray-600 mb-2">
              Properties
            </label>
            <div className="px-4 py-2 bg-gray-50 rounded-lg">
              <span className="font-helvetica-light">
                {userData?.properties?.length || 0} properties
              </span>
            </div>
          </div>

          <div className="flex space-x-4 pt-6">
            {isEditing && (
              <button
                onClick={handleSave}
                className="flex-1 bg-[#24191E] text-white px-6 py-2 rounded-lg font-helvetica-medium hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FaCheck size={16} />
                <span>Save Changes</span>
              </button>
            )}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="flex-1 bg-red-500 text-white px-6 py-2 rounded-lg font-helvetica-medium hover:bg-opacity-90 transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <FaTrash size={16} />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccountConfirm}
        isLoading={isDeleting}
      />
    </>
  );
};

export default AccountInfo;