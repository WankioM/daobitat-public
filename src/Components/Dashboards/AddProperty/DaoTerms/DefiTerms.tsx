import React from 'react';
import './DefiTerms.css';
import { useUser } from '../../../../contexts/UserContext';
import { firestore } from '../../../../firebaseConfig';
import { doc, updateDoc, setDoc } from 'firebase/firestore';

interface DefiTermsProps {
  propertyId: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DefiTerms: React.FC<DefiTermsProps> = ({ propertyId, onClose, onConfirm }) => {
    const { user } = useUser();
    
    const handleConfirm = async () => {
        try {
            if (!user || !user.uid) {
                console.error("User is not authenticated");
                return;
            }
    
            const propertyRef = doc(firestore, `users/${user.uid}/properties/${propertyId}`);
    
            await updateDoc(propertyRef, {
                daoenabled: true
            });
    
            const daoHoldersRef = doc(firestore, `users/${user.uid}/properties/${propertyId}/daoholders/defaultHolder`);
    
            await setDoc(daoHoldersRef, {
                holderName: "Initial Holder",
                createdAt: new Date(),
            });
    
            console.log("Property successfully updated with DAO enabled and 'daoholders' collection initialized.");
            onConfirm(); // Call the onConfirm function passed from PropertyForm4
        } catch (error) {
            console.error("Error updating property or initializing 'daoholders' collection:", error);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
            <h2>DAO-Bitat Property Listing Terms and Conditions</h2>
                <p>Welcome to DAO-Bitat! Before you list your property on our platform, please review the following terms and conditions. By proceeding with the listing, you agree to the following:</p>
                
                <h3>1. Irreversible Action</h3>
                <p><strong>Once you confirm the listing of your property on DAO-Bitat, this action cannot be undone.</strong> Your property can only be removed from the platform by DAO-Bitat if it fails to meet our terms and conditions or listing standards.</p>
                
                <h3>2. Escrow Funds</h3>
                <p><strong>All funds received from buyers will be held in escrow until the entire share of the property is purchased.</strong> This ensures that transactions are secure and that all parties are protected until the property ownership is fully transferred.</p>
                
                <h3>3. Governance Rights</h3>
                <p><strong>Once a property is purchased, the buyers gain the right to participate in decision-making regarding the property.</strong> This means they can vote on any governance issues related to the property.</p>
                
                <h3>4. Share Purchase Limitation</h3>
                <p><strong>As the property lister, you have the option to purchase a share of your own property through DAO-Bitat.</strong> However, this share must not exceed 30% of the total ownership to ensure fair and balanced governance.</p>
                
                <h3>5. Property Visits</h3>
                <p>You are required to be available for three property visits:</p>
                <ul>
                    <li>One visit by DAO-Bitat for verification purposes.</li>
                    <li>One visit for potential buyers to view the property.</li>
                    <li>A third visit for buyers who have already purchased a share. If you cannot attend these visits, you may appoint a property agent to represent you. Please note that there are costs associated with these visits, as they are facilitated by DAO-Bitat.</li>
                </ul>
                
                <h3>6. Cryptocurrency Payment</h3>
                <p><strong>You must be prepared to accept payments in cryptocurrency for the sale of your property.</strong> DAO-Bitat facilitates transactions in various cryptocurrencies, and you should ensure you are able to handle these payments.</p>
                
                <h3>7. Accurate Information</h3>
                <p><strong>Ensure that all information provided about the property is accurate and up-to-date.</strong> Misrepresentation or inaccuracies may lead to the removal of the listing or other consequences.</p>
                
                <h3>8. Compliance with Regulations</h3>
                <p><strong>You agree to comply with all applicable local and national regulations regarding property sales and blockchain transactions.</strong></p>
                
                <h3>9. Dispute Resolution</h3>
                <p>Any disputes arising from the sale of the property through DAO-Bitat will be handled according to DAO-Bitat’s dispute resolution procedures. This may include mediation or arbitration as outlined in our policies.</p>
                
                <h3>10. Privacy and Data Security</h3>
                <p><strong>Your personal information and property details will be handled in accordance with DAO-Bitat’s privacy policy.</strong> We are committed to protecting your data and ensuring it is used only for the purposes of facilitating the property sale.</p>
                
                <p>By listing your property on DAO-Bitat, you acknowledge that you have read, understood, and agreed to these terms and conditions. If you have any questions or need further clarification, please contact our support team before proceeding.</p>
            
                
                <div className="popup-buttons">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={handleConfirm}>Confirm</button>
                </div>
            </div>
        </div>
    );
};

export default DefiTerms;