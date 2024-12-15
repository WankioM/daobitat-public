// src/components/AddProperty/PropertyForm3.tsx
import React, { useState } from 'react';
import './PropertyForm3.css';
import { firestore, storage } from '../../../firebaseConfig';
import { collection, doc, addDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useUser } from '../../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';


interface PropertyForm3Props {
  prevStep: () => void;
  propertyType: string; 
  propertyAction: string; 
  documentId: string | null; 
  handleCloseForm: () => void;
  handleListOnChain: () => void;
  handleSubmitForm3: () => void;
}

const PropertyForm3: React.FC<PropertyForm3Props> = ({ 
            prevStep,
            propertyType,
            propertyAction,
            documentId,
            handleCloseForm,
            handleListOnChain,
            handleSubmitForm3 }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [specificType, setSpecificType] = useState('');
  const [action, setAction] = useState(propertyAction);
  const [showImagePopup, setShowImagePopup] = useState(false); 
  const [images, setImages] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    specificType: '',
    action: propertyAction,
    price: '',
    space: '',
    bedrooms: '',
    bathrooms: '',
    features: '',
    security: '',
    furnished: false,
    pool: false,
    gym : false,
    garden: false,
    parking: false ,
    additionalComments: '',
    rooms: '',
    cryptoaccepted: false ,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Type guard to handle checkbox
    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
      setFormData({
        ...formData,
        [name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const uploadImagesToFirebase = async (): Promise<string[]> => {
    const uploadPromises = images.map(async (image, index) => {
      const imageRef = ref(storage, `properties/${user.uid}/${Date.now()}_${index}_${image.name}`);
      await uploadBytes(imageRef, image);
      return await getDownloadURL(imageRef);
    });
    return await Promise.all(uploadPromises);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages((prevImages) => {
        // Check if adding these images exceeds the maximum limit of 10
        if (prevImages.length + fileArray.length <= 10) {
          return [...prevImages, ...fileArray];
        } else {
          // If it exceeds, only add the number that keeps the total at 10
          const remainingSlots = 10 - prevImages.length;
          return [...prevImages, ...fileArray.slice(0, remainingSlots)];
        }
      });
    }
  };
  


  const handleSpecificTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSpecificType(e.target.value);
  };

  const handlePropertyActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value); // Update state with selected action
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload images and get their URLs
      const imageUrls = await uploadImagesToFirebase();
      const finalPropertyData = { ...formData, images: imageUrls };
      console.log(`finalPropertyData ${finalPropertyData}`)

      // Add image URLs to property data
      if (documentId) {
        const userDocRef = doc(firestore, 'users', user.uid);
        console.log(`userdoc ${userDocRef}`)
        const propertyDocRef = doc(userDocRef, 'properties', documentId); // Using documentId here
        console.log(`propertydoc ${propertyDocRef}`)
        await setDoc(propertyDocRef, finalPropertyData, { merge: true });
        await setDoc(propertyDocRef, finalPropertyData, { merge: true });
      } else {
        console.error("Document ID is null, cannot proceed.");
      }
      

      
      console.log('Property part 3 added successfully!');
      handleCloseForm();
      setShowImagePopup(false); // This is an example of closing the image popup
    } catch (error) {
      console.error('Error adding property:', error);
      alert('Failed to add property');
    }
  };

  return (
    <div className="property-form3">
      <h2>Almost Done...</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="specificType">Specify the type:</label>
          <select
            id="specificType"
            name="specificType"
            value={specificType}
            onChange={handleSpecificTypeChange}
            required
          >
            {/* Render options based on propertyType */}
            {propertyType === 'Residential' && (
              <>
                <option value="" disabled>Select specific type</option>
                <option value="Single-family home">Single-family home</option>
                <option value="Multi-family home">Multi-family home</option>
                <option value="Condominium">Condominium</option>
                <option value="Townhouse">Townhouse</option>
                <option value="Apartment">Apartment</option>
                <option value="Mobile home">Mobile home</option>
                <option value="Duplex/Triplex">Duplex/Triplex</option>
                <option value="Co-op">Co-op</option>
              </>
            )}
            {propertyType === 'Commercial' && (
              <>
                <option value="" disabled>Select specific type</option>
                <option value="Office space">Office space</option>
                <option value="Retail space">Retail space</option>
                <option value="Industrial property">Industrial property</option>
                <option value="Warehouse">Warehouse</option>
                <option value="Mixed-use property">Mixed-use property</option>
                <option value="Shopping center">Shopping center</option>
                <option value="Hotel/Motel">Hotel/Motel</option>
              </>
            )}
            {propertyType === 'Land' && (
              <>
                <option value="" disabled>Select specific type</option>
                <option value="Residential land">Residential land</option>
                <option value="Commercial land">Commercial land</option>
                <option value="Agricultural land">Agricultural land</option>
                <option value="Industrial land">Industrial land</option>
                <option value="Undeveloped/Vacant land">Undeveloped/Vacant land</option>
              </>
            )}
            {propertyType === 'Special-purpose' && (
              <>
                <option value="" disabled>Select specific type</option>
                <option value="Recreational property">Recreational property</option>
                <option value="Institutional property">Institutional property</option>
                <option value="Government buildings">Government buildings</option>
                <option value="Marinas">Marinas</option>
                <option value="Self-storage facilities">Self-storage facilities</option>
              </>
            )}
            {propertyType === 'Vacation/Short-term rentals' && (
              <>
                <option value="" disabled>Select specific type</option>
                <option value="Vacation home">Vacation home</option>
                <option value="Bed and breakfast">Bed and breakfast</option>
                <option value="Resort property">Resort property</option>
              </>
            )}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="propertyAction">Choose how you'd like to list your property:</label>
          <select
            id="propertyAction"
            name="propertyAction"
            value={action}
            onChange={handlePropertyActionChange}
            required
          >
            <option value="" disabled>Choose how you'd like to list your property</option>
            <option value="Rent">Rent</option>
            <option value="Sell">Sell</option>
            <option value="Lease">Lease</option>
            <option value="Rent to Own">Rent to Own</option>
            <option value="Vacation Rental">Vacation Rental</option>
            <option value="Sublease">Sublease</option>
            <option value="Develop or Renovate">Develop or Renovate</option>
            <option value="Auction">Auction</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="price">Price (in KES):</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Enter the price"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="space">Space (in square feet):</label>
          <input
            type="number"
            id="space"
            name="space"
            value={formData.space}
            onChange={handleChange}
            placeholder="Enter the space"
            required
          />
        </div>

        {propertyType === 'Residential' && (
          

        <div className="form-group">
          <label htmlFor="bedrooms">Number of Bedrooms:</label>
          <input
            type="number"
            id="bedrooms"
            name="bedrooms"
            value={formData.bedrooms}
            onChange={handleChange}
            placeholder="Enter the number of bedrooms"
            
          />
        </div>
        )}



        {propertyType === 'Residential' && (
        <div className="form-group">
          <label htmlFor="bathrooms">Number of Bathrooms:</label>
          <input
            type="number"
            id="bathrooms"
            name="bathrooms"
            value={formData.bathrooms}
            onChange={handleChange}
            placeholder="Enter the number of bathrooms"
            
          />
        </div>
        )}

        {propertyType === 'Commercial' && (
          <div className="form-group">
            <label htmlFor="rooms">Number of Rooms:</label>
            <input
              type="number"
              id="rooms"
              name="rooms"
              value={formData.bathrooms}
              onChange={handleChange}
              placeholder="Enter the number of rooms"
              
            />
          </div>
        )}

       

        <div className="form-group">
          <label htmlFor="security">Security:</label>
          <input
            type="text"
            id="security"
            name="security"
            value={formData.security}
            onChange={handleChange}
            placeholder="Enter security features"
          />
        </div>

        <h3>Features</h3>
        <p> Check the box if it is available</p>

        {(propertyType === 'Residential' || propertyType === 'Commercial')  && (
        <div className="form-group2">
          <label htmlFor="furnished">Furnished?</label>
          <input
            type="checkbox"
            id="furnished"
            name="furnished"
            checked={formData.furnished}
            onChange={handleChange}
          />
        </div>
        )}

        <div className="form-group2">
          <label htmlFor="pool">Pool</label>
          <input
            type="checkbox"
            id="pool"
            name="pool"
            checked={formData.pool}
            onChange={handleChange}
          />
        </div>

        <div className="form-group2">
          <label htmlFor="gym">Gym</label>
          <input
            type="checkbox"
            id="gym"
            name="gym"
            checked={formData.gym}
            onChange={handleChange}
          />
        </div>

        <div className="form-group2">
          <label htmlFor="parking">Parking</label>
          <input
            type="checkbox"
            id="parking"
            name="parking"
            checked={formData.parking}
            onChange={handleChange}
          />
        </div>

        <div className="form-group2">
          <label htmlFor="garden">Garden</label>
          <input
            type="checkbox"
            id="garden"
            name="garden"
            checked={formData.garden}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="cryptoaccepted">
            <p>Do you also accept payment in crypto?</p>
            <p>Note: You need to check this box if you may want to project to be listed as a DAO?</p>
            </label>
          <input
            type="checkbox"
            id="cryptoaccepted"
            name="cryptoaccepted"
            checked={formData.cryptoaccepted}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
            <label htmlFor="additionalComments">Additional Comments:</label>
            <textarea
              id="additionalComments"
              name="additionalComments"
              value={formData.additionalComments}
              onChange={handleChange}
              placeholder="Anything you want to add?"
              rows={4} // Adjust the number of rows to control the height of the textarea
              className="form-control" // You can add any additional classes for styling
            />
          </div>


          <div className="form-group">
            <button
              type="button"
              onClick={() => setShowImagePopup(true)}
            >
              Upload Images
            </button>
        </div>

        {showImagePopup && (
    <div className="image-popup">
        <div className="image-popup-content">
            <h3>Upload Images (at least 2, max 10)</h3>
            <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                required
            />
            
            {/* Image Preview */}
            {images.length > 0 && (
                <div className="image-preview">
                    <img 
                        src={URL.createObjectURL(images[0])} 
                        alt="First uploaded preview" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }} 
                    />
                    <p>{images.length}/10 images uploaded</p>
                </div>
            )}
            
            <button type="button" onClick={() => setShowImagePopup(false)}>
                Done
            </button>
        </div>
    </div>
)}




        

        <button type="button" onClick={prevStep}>Back</button>
        <button type="submit" >Submit</button>
        <button type="button" onClick={handleListOnChain}>List on Chain</button>
      </form>
    </div>
  );
};

export default PropertyForm3;
