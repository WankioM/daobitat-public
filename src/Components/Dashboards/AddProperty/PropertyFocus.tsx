import React, { useState, useRef } from 'react';
import { FaTimes, FaPencilAlt, FaEye, FaTrash, FaPlus } from 'react-icons/fa';
import './PropertyFocus.css';
import ImageCarousel from './ImageCarousel';
import { doc, updateDoc, setDoc } from "firebase/firestore"; 
import { firestore, storage } from '../../../firebaseConfig';
import { useUser } from '../../../contexts/UserContext';
import TermsPopup from './DaoTerms/DaoTerms';
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";


const PropertyFocus: React.FC<{ property: any; onClose: () => void }> = ({ property, onClose }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editableProperty, setEditableProperty] = useState(() => ({
    ...property,
    images: Array.isArray(property.images) ? property.images : []
  }));
  const { user } = useUser();
  const [isTermsPopupVisible, setIsTermsPopupVisible] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
  
    setEditableProperty((prev:any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    const storageRef = ref(storage, `properties/${property.id}/${file.name}`);
    
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      setEditableProperty((prev: any) => {
        const currentImages = Array.isArray(prev.images) ? prev.images : [];
        return {
          ...prev,
          images: [...currentImages, downloadURL],
        };
      });
    } catch (error) {
      console.error("Error uploading image: ", error);
    }
  };

  const handleImageDelete = async (imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    
    try {
      await deleteObject(imageRef);
      
      setEditableProperty((prev: any) => {
        const currentImages = Array.isArray(prev.images) ? prev.images : [];
        return {
          ...prev,
          images: currentImages.filter((img: string) => img !== imageUrl),
        };
      });
    } catch (error) {
      console.error("Error deleting image: ", error);
    }
  };

  const handleDaoButtonClick = () => {
    setIsTermsPopupVisible(true);
  };

  const handleCloseDaoPopup = () => {
    setIsTermsPopupVisible(false);
  };
  

  const saveEdits = async () => {
    if (!user || !user.uid) {
      console.error("User is not authenticated.");
      return;
    }
  
    const propertyRef = doc(firestore, "users", user.uid, "properties", property.id);
    console.log (`Property ID....  : ${property.id}`)

    try {
      await updateDoc(propertyRef, {
        action:editableProperty.action || "",
        specificType: editableProperty.specificType || "",
        price: editableProperty.price || 0,
        space: editableProperty.space || "",
        bedrooms: editableProperty.bedrooms || "",
        bathrooms: editableProperty.bathrooms || "",
        features: editableProperty.features || "",
        security: editableProperty.security || "",
        furnished: editableProperty.furnished || false,
        pool: editableProperty.pool || false,
        gym: editableProperty.gym || false,
        garden: editableProperty.garden || false,
        parking: editableProperty.parking || false,
        propertyName: editableProperty.propertyName || "",
        propertyType: editableProperty.propertyType || "",
        unitNo: editableProperty.unitNo || "",
        location: editableProperty.location || "",
        additionalComments: editableProperty.additionalComments || "",
        images: editableProperty.images || [], 
        
      });
  
      console.log("Property updated successfully.");
      setIsEditMode(false);
    } catch (error) {
      console.error("Error updating property: ", error);
    }
  };
  const {
    images = [],
    specificType,
    action,
    price,
    space,
    bedrooms,
    bathrooms,
    features,
    security,
    furnished,
    pool,
    gym,
    garden,
    parking,
    propertyName,
    propertyType,
    unitNo,
    location,
    additionalComments,
  } = editableProperty;

  console.log (`Property ID....  : ${property.id}`)

  return (
    <div className="property-focus-container">
      <div className="property-focus-content">
        <button onClick={onClose} className="close-button">
          <FaTimes size={30} />
        </button>

        <div className="property-focus-images">
        <ImageCarousel
    images={editableProperty.images || []}
    altText={(editableProperty.images || []).map((_: any, index: number) => `${editableProperty.propertyName || 'Property'} image ${index + 1}`)}
  />
  {isEditMode && (
    <div className="image-edit-controls">
      <button onClick={() => fileInputRef.current?.click()}>
        <FaPlus /> Add Image
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleImageUpload}
        accept="image/*"
      />
      {(editableProperty.images || []).map((imageUrl: string, index: number) => (
        <div key={index} className="image-item">
          <img src={imageUrl} alt={`Property ${index + 1}`} style={{ width: '50px', height: '50px' }} />
          <button onClick={() => handleImageDelete(imageUrl)}>
            <FaTrash />
          </button>
        </div>
      ))}
    </div>
  )}
        </div>

        <div className="property-focus-header">
          <h2>{propertyName}</h2>
          <button onClick={toggleMode} className="toggle-mode-button">
            {isEditMode ? <FaEye size={20} /> : <FaPencilAlt size={20} />}
          </button>
        </div>

        <div className="property-focus-details">
          {isEditMode ? (
            <>

              <div className="property-item">
                <label>Property Type:</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={propertyType || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select property type</option>
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Land">Land</option>
                  <option value="Special-purpose">Special-purpose</option>
                  <option value="Vacation/Short-term rentals">Vacation/Short-term rentals</option>
                </select>
                
              </div>
              <div className="property-item">
                <label>Specific Type:</label>
                <select
                    id="specificType"
                    name="specificType"
                    value={specificType || ''}
                    onChange={handleInputChange}
                    required
                  >

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
              <div className="property-item">
                <label>Price:</label>
                <input
                  type="number"
                  name="price"
                  value={price || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="property-item">
                <label>Space in squared metres:</label>
                <input
                  type="number"
                  name="space"
                  value={space || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              {propertyType  === "Residential" && (
              <div className="property-item">
                <label>Bedrooms:</label>
                <input
                  type="text"
                  name="bedrooms"
                  value={bedrooms || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              )}
              {propertyType  === "Residential" && (
              <div className="property-item">
                <label>Bathrooms:</label>
                <input
                  type="text"
                  name="bathrooms"
                  value={bathrooms || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              )}
              <div className="property-item">
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={location || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <div className="property-item">
                <label>Unit No:</label>
                <input
                  type="text"
                  name="unitNo"
                  value={unitNo || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="property-item">
                <label>Features:</label>
                <input
                  type="text"
                  name="features"
                  value={features || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="property-item">
                <label>Security:</label>
                <input
                  type="text"
                  name="security"
                  value={security || ''}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              
              <p>Features</p>
              {(propertyType  === "Residential" || propertyType  === "Commercial") && (
              <div className="form-group2">
                <label>Furnished:</label>
                <input
                  type="checkbox"
                  name="furnished"
                  id="furnished"
                  checked={furnished}
                  onChange={handleInputChange}
                  
                />
              </div>
              )}
              <div className="form-group2">
                <label>Pool:</label>
                <input
                  type="checkbox"
                  name="pool"
                  checked={pool}
                  onChange={handleInputChange}
                  
                />
              </div>
              <div className="form-group2">
                <label>Gym:</label>
                <input
                  type="checkbox"
                  name="gym"
                  checked={gym}
                  onChange={handleInputChange}
                  
                />
              </div>
              <div className="form-group2">
                <label>Garden:</label>
                <input
                  type="checkbox"
                  name="garden"
                  checked={garden}
                  onChange={handleInputChange}
                  
                />
              </div>
              <div className="form-group2">
                <label>Parking:</label>
                <input
                  type="checkbox"
                  name="parking"
                  checked={parking}
                  onChange={handleInputChange}
                  className="input-field"
                />
              </div>
              <div className="property-item">
                <label>Additional Comments:</label>
                <textarea
                  name="additionalComments"
                  value={additionalComments || ''}
                  onChange={handleInputChange}
                  className="textarea-field"
                />
              </div>
              <button onClick={saveEdits}> Save </button>
            </>
          ) : (
            <>
              <p>{specificType}</p>
              <p>Price: {price}</p>
              <p>Space: {space} sqft</p>
              {propertyType  === "Residential" && (
              <p>{bedrooms} bds | {bathrooms} ba</p>
              )}
              <p>Location: {location}</p>
              <p>Property Type: {propertyType}</p>
              {(unitNo || propertyType  === "Residential" || propertyType  === "Commercial") && (
              <p>Unit No: {unitNo}</p>
              )}
              
              {security && (
              <p>Security: {security}</p>
              )}

              {(propertyType  === "Residential" || propertyType  === "Commercial") && (
              <p>Furnished: {furnished ? 'Yes' : 'No'}</p>
              )}

              <p>Pool: {pool ? 'Yes' : 'No'}</p>
              <p>Gym: {gym ? 'Yes' : 'No'}</p>
              <p>Garden: {garden ? 'Yes' : 'No'}</p>
              <p>Parking: {parking? 'Yes' : 'No'}</p>
              {additionalComments && (
              <p>Additional Comments: {additionalComments}</p>
              )}
            </>
          )}
           <div>
            {action === "Sell" && (
              <button className="shared-purchasing-button" onClick={handleDaoButtonClick}>
                Enable Shared Purchasing?
              </button>
            )}

            {isTermsPopupVisible && 
            <TermsPopup propertyId={property.id} onClose={handleCloseDaoPopup} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyFocus;
