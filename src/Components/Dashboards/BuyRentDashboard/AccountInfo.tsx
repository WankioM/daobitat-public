import React, { useEffect, useState } from 'react';
import { useUser } from '../../../contexts/UserContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaPen, FaSave, FaTrash, FaUserCircle } from 'react-icons/fa';
import './AccountInfo.css';

const UserAccount: React.FC = () => {
  const { user } = useUser();
  console.log(user);
  const [editing, setEditing] = useState<boolean>(false);
  const [updatedUser, setUpdatedUser] = useState<any>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [profilePicUrl, setProfilePicUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUpdatedUser(userData);

          // Check if the profile picture exists in Firebase Storage
          const profilePicRef = ref(storage, `profilePics/${user.uid}`);
          try {
            const url = await getDownloadURL(profilePicRef);
            setProfilePicUrl(url); // Set the profile picture URL
          } catch (error) {
            console.log('No profile picture found, using default.');
          }

          // Enter editing mode if any required field is missing
          if (!userData.firstName || !userData.lastName || !userData.designation) {
            setEditing(true);
          }
        } else {
          setUpdatedUser({});
          setEditing(true); // No document found, enter editing mode
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, [user.uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        const selectedFile = e.target.files[0];
        console.log('Selected file:', selectedFile);

        try {
            // Upload the file to Firebase Storage
            const storageRef = ref(storage, `profilePics/${user.uid}`);
            await uploadBytes(storageRef, selectedFile);
            
            // Get the download URL of the uploaded file
            const downloadURL = await getDownloadURL(storageRef);
            console.log('Download URL:', downloadURL);

            // Update the user's profile picture URL in Firestore
            const userDoc = doc(firestore, 'users', user.uid);
            await updateDoc(userDoc, { profilePic: downloadURL });

            // Update the profile picture URL in the component state
            setProfilePicUrl(downloadURL);
            setUpdatedUser((prevState: any) => ({ ...prevState, profilePic: downloadURL }));

            alert('Profile picture updated successfully');
        } catch (error) {
            console.error('Error uploading profile picture:', error);
        }
    }
};


  const handleSave = async () => {
    try {
        

        const userDoc = doc(firestore, 'users', user.uid);
        await updateDoc(userDoc, updatedUser);
        alert('User information updated successfully');
        setEditing(false);
    } catch (error) {
        console.error('Error updating user information:', error);
    }
};


  const handleDeleteAccount = () => {
    // Logic to delete account (to be implemented)
  };

  if (initialLoading) {
    return <div>Loading...</div>; // or some kind of loading spinner
  }

  return (
    <div>
      <h2>Account Information</h2>
      <div className="account-info">

      <div className="info-item">
          <strong>Photo</strong>
          {profilePicUrl ? (
            <img src={profilePicUrl} alt="Profile" className="profile-pic" />
          ) : (
            <FaUserCircle size={50} />
          )}
          <div className="upload-section">
            <label htmlFor="profile-pic-upload" className="upload-button">
              <FaPen />
              Personalize your profile pic with a custom photo.
            </label>
            <input
              id="profile-pic-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
          </div>
        </div>

        <div className="info-item">
          <strong>First Name:</strong> 
          {editing || !updatedUser?.firstName ? (
            <input
              type="text"
              name="firstName"
              value={updatedUser?.firstName || ''}
              onChange={handleChange}
              placeholder="Enter first name"
            />
          ) : (
            <span>{updatedUser?.firstName}</span>
          )}
          {updatedUser?.firstName && !editing && <FaPen onClick={() => setEditing(true)} />}
        </div>
        <div className="info-item">
          <strong>Last Name:</strong> 
          {editing || !updatedUser?.lastName ? (
            <input
              type="text"
              name="lastName"
              value={updatedUser?.lastName || ''}
              onChange={handleChange}
              placeholder="Enter last name"
            />
          ) : (
            <span>{updatedUser?.lastName}</span>
          )}
          {updatedUser?.lastName && !editing && <FaPen onClick={() => setEditing(true)} />}
        </div>

        <div className="info-item">
          <strong>Is it a Landlord or Property Manager:</strong> 
          {editing || !updatedUser?.designation ? (
            <select
              name="designation"
              value={updatedUser?.designation || ''}
              onChange={handleChange}
            >
              <option value="" disabled>Select designation</option>
              <option value="Landlord">Landlord</option>
              <option value="Property Manager">Property Manager</option>
            </select>
          ) : (
            <span>{updatedUser?.designation}</span>
          )}
          {updatedUser?.designation && !editing && <FaPen onClick={() => setEditing(true)} />}
        </div>

        
        {editing && (
          <button onClick={handleSave} className="save-button">
            <FaSave /> Save
          </button>
        )}
        <button onClick={handleDeleteAccount} className="delete-button">
          <FaTrash /> Delete Account
        </button>
      </div>
    </div>
  );
};

export default UserAccount;
