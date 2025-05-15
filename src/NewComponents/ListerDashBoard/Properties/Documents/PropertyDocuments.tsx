// src/components/DocumentManager/PropertyDocuments.tsx

import React, { useState, useEffect } from 'react';
import documentService from '../../../../services/documentService';
import { DocumentType, DocumentTypeLabels, DocumentTypeDescriptions } from '../../../../types/propertyDocuments';
import { PropertyDocument } from '../../../../types/property';
import Loading from '../../../Errors/Loading';
import { FaPlus, FaTrash, FaEye, FaCheck, FaHourglass, FaWallet } from 'react-icons/fa';
import useWallet from '../../../../hooks/useWallet';
import WalletSelector from '../../../Wallet/WalletSelector';
import { useUser } from '../../../../NewContexts/UserContext';

interface PropertyDocumentsProps {
  propertyId: string;
}

const PropertyDocuments: React.FC<PropertyDocumentsProps> = ({ propertyId }) => {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | DocumentType>('all');
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  // Get user ID from auth context
  const { user } = useUser();
const userId = user?._id;

  // Use wallet hook
  const { 
    address, 
    isConnected, 
    isVerified, 
    connect, 
    verifyWallet 
  } = useWallet(userId);

  // Form state
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>(DocumentType.TITLE_DEED);
  const [documentName, setDocumentName] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');

  // Document counts by type
  const [documentCounts, setDocumentCounts] = useState<Record<DocumentType, number>>({} as Record<DocumentType, number>);

  useEffect(() => {
    // Add custom CSS for animated underline
    const style = document.createElement('style');
    style.textContent = `
      .nav-tab-hover {
        position: relative;
      }
      
      .nav-tab-hover::after {
        content: '';
        position: absolute;
        width: 0;
        height: 2px;
        bottom: 0;
        left: 50%;
        background-color: #B17457;
        transition: width 0.3s ease, left 0.3s ease;
      }
      
      .nav-tab-hover:hover::after {
        width: 100%;
        left: 0;
      }
      
      .nav-tab-active::after {
        width: 100%;
        left: 0;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    fetchDocuments();
    fetchDocumentCounts();
  }, [propertyId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      let docs: PropertyDocument[];
      
      if (activeTab === 'all') {
        docs = await documentService.getPropertyDocuments(propertyId);
      } else {
        docs = await documentService.getDocumentsByType(propertyId, activeTab);
      }
      
      setDocuments(docs);
      setError(null);
    } catch (err) {
      console.error('Error loading documents:', err);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocumentCounts = async () => {
    try {
      const counts = await documentService.getDocumentCounts(propertyId);
      setDocumentCounts(counts);
    } catch (err) {
      console.error('Error fetching document counts:', err);
    }
  };

  const handleTabChange = (tab: 'all' | DocumentType) => {
    setActiveTab(tab);
    // Reload documents with the new filter
    if (tab === 'all') {
      documentService.getPropertyDocuments(propertyId)
        .then(docs => setDocuments(docs))
        .catch(err => {
          console.error('Error fetching documents:', err);
          setError('Failed to load documents');
        });
    } else {
      documentService.getDocumentsByType(propertyId, tab)
        .then(docs => setDocuments(docs))
        .catch(err => {
          console.error('Error fetching documents by type:', err);
          setError('Failed to load documents');
        });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
      
      // Auto-fill document name based on file name
      if (!documentName) {
        let baseName = e.target.files[0].name.split('.')[0];
        // Clean up the name - remove underscores, hyphens and capitalize
        baseName = baseName
          .replace(/[_-]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
          
        setDocumentName(baseName);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }
    
    if (!documentName.trim()) {
      setError('Please enter a document name');
      return;
    }

    // Check if wallet is connected and verified before submitting
    if (!isConnected) {
      setError('Please connect your wallet to upload documents');
      setIsWalletModalOpen(true);
      return;
    }

    if (!isVerified && userId) {
      try {
        await verifyWallet(userId);
      } catch (err) {
        console.error('Error verifying wallet:', err);
        setError('Failed to verify wallet. Please try again.');
        return;
      }
    }

    // Update the file path to use propertydocs folder
    const modifiedFileName = `propertydocs/${propertyId}/${documentType}_${Date.now()}_${selectedFile.name}`;
    
    try {
      setActionLoading(true);
      setError(null);
      
      // Modify the uploadAndAddDocument to use the web-vids bucket and propertydocs folder
      await documentService.uploadAndAddDocument(
        propertyId,
        selectedFile,
        {
          documentType,
          documentName: documentName.trim(),
          expiryDate: expiryDate ? new Date(expiryDate) : undefined,
          metadata: {
            originalFileName: selectedFile.name,
            uploadedFrom: 'property-documents-component',
            walletAddress: address || undefined, // Add wallet address to metadata
            walletVerified: isVerified
          }
        }
      );
      
      // Reset form
      setSelectedFile(null);
      setDocumentName('');
      setExpiryDate('');
      setDocumentType(DocumentType.TITLE_DEED);
      setIsModalOpen(false);
      
      // Reload documents
      await fetchDocuments();
      await fetchDocumentCounts();
    } catch (err) {
      console.error('Error uploading document:', err);
      setError('Failed to upload document. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    // Check if wallet is connected and verified before deleting
    if (!isConnected) {
      setError('Please connect your wallet to delete documents');
      setIsWalletModalOpen(true);
      return;
    }

    if (!isVerified && userId) {
      try {
        await verifyWallet(userId);
      } catch (err) {
        console.error('Error verifying wallet:', err);
        setError('Failed to verify wallet. Please try again.');
        return;
      }
    }
    
    try {
      setActionLoading(true);
      await documentService.deletePropertyDocument(propertyId, documentId);
      setDocuments(documents.filter(doc => doc.documentId !== documentId));
      await fetchDocumentCounts();
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    } finally {
      setActionLoading(false);
    }
  };

  // Determine if a tab should show a notification dot based on document count
  const shouldShowNotification = (type: DocumentType): boolean => {
    const count = documentCounts[type] || 0;
    return count > 0 && type !== activeTab;
  };

  // Handle wallet selection
  const handleWalletSelect = async (walletId: string) => {
    try {
      setActionLoading(true);
      await connect();
      setIsWalletModalOpen(false);
      
      // If we have a userId, verify the wallet
      if (userId && !isVerified) {
        try {
          await verifyWallet(userId);
        } catch (verifyErr) {
          console.warn('Wallet verification can be completed later');
          // Don't block the flow if verification fails
        }
      }
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  // Open the modal
  const handleOpenUploadModal = () => {
    // If wallet not connected, open wallet modal first
    if (!isConnected) {
      setIsWalletModalOpen(true);
      return;
    }

    // If wallet connected but not verified and we have a userId, verify it
    if (!isVerified && userId) {
      verifyWallet(userId)
        .then(() => {
          setIsModalOpen(true);
          if (activeTab !== 'all') {
            setDocumentType(activeTab);
          }
        })
        .catch(err => {
          console.error('Error verifying wallet:', err);
          setError('Failed to verify wallet. Please try again.');
        });
    } else {
      // If wallet connected and verified (or no userId), open the upload modal directly
      setIsModalOpen(true);
      if (activeTab !== 'all') {
        setDocumentType(activeTab);
      }
    }
  };

  return (
    <div className="property-documents bg-milk shadow-md rounded-lg p-6">
      <Loading isOpen={loading && documents.length === 0} message="Loading documents..." />
      <Loading isOpen={actionLoading} message="Processing..." />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-helvetica-bold text-graphite mb-2">Property Documents</h2>
          <p className="text-gray-600 font-helvetica-light">
            {activeTab === 'all' 
              ? "If you own it, prove it. If you list it, verify it."
              : DocumentTypeDescriptions[activeTab]
            }
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          {isConnected ? (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-md flex items-center text-sm">
              <FaWallet className="mr-2" /> Wallet Connected
            </div>
          ) : (
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md flex items-center text-sm hover:bg-amber-200 transition-all"
            >
              <FaWallet className="mr-2" /> Connect Wallet
            </button>
          )}
          <button 
            onClick={handleOpenUploadModal}
            className="bg-rustyred text-milk px-4 py-2 rounded-md flex items-center font-helvetica-regular transition-all hover:bg-opacity-90"
          >
            <FaPlus className="mr-2" /> Add Document
          </button>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      {/* Document Type Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => handleTabChange('all')}
          className={`px-4 py-2 rounded-t-lg transition-all nav-tab-hover ${
            activeTab === 'all' 
              ? 'border-b-2 border-desertclay text-desertclay font-helvetica-bold nav-tab-active' 
              : 'text-gray-600 hover:text-desertclay font-helvetica-regular'
          }`}
        >
          All Documents
        </button>
        
        {Object.values(DocumentType).map(type => (
          <button
            key={type}
            onClick={() => handleTabChange(type)}
            className={`px-4 py-2 rounded-t-lg transition-all relative nav-tab-hover ${
              activeTab === type 
                ? 'border-b-2 border-desertclay text-desertclay font-helvetica-bold nav-tab-active' 
                : 'text-gray-600 hover:text-desertclay font-helvetica-regular'
            }`}
          >
            {DocumentTypeLabels[type]}
            {shouldShowNotification(type) && (
              <span className="absolute -top-1 -right-1 bg-desertclay text-milk text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {documentCounts[type] || 0}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Upload Document Button - Always visible */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleOpenUploadModal}
          className="px-4 py-2 bg-desertclay text-milk rounded-md flex items-center font-helvetica-regular text-sm hover:bg-opacity-90 transition-all"
        >
          <FaPlus className="mr-2" /> 
          {activeTab === 'all' ? "Upload Document" : `Upload ${DocumentTypeLabels[activeTab]}`}
        </button>
      </div>
     
      {/* Document Grid */}
      {!loading && documents.length === 0 ? (
        <div className="text-center py-10 bg-milk/80 rounded-lg border border-dashed border-gray-300">
          <p className="text-graphite font-helvetica-light mb-4">
            {activeTab === 'all' 
              ? "No documents have been uploaded yet."
              : `No ${DocumentTypeLabels[activeTab].toLowerCase()} documents found.`
            }
          </p>
          <button
            onClick={handleOpenUploadModal}
            className="bg-desertclay text-milk px-4 py-2 rounded-md font-helvetica-regular transition-all hover:bg-opacity-90"
          >
            {activeTab === 'all' 
              ? "Upload your first document"
              : `Upload ${DocumentTypeLabels[activeTab]}`
            }
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map(doc => (
            <div key={doc.documentId} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:border-desertclay transition-all">
              <div className="bg-gray-100 px-4 py-3 flex justify-between items-center">
                <div className="flex items-center">
                  {/* Icon based on file type */}
                  <div className="w-10 h-10 flex items-center justify-center bg-desertclay/10 rounded-md text-desertclay">
                    {doc.fileType.includes('pdf') ? (
                      <span className="text-xl">📄</span>
                    ) : doc.fileType.includes('image') ? (
                      <span className="text-xl">🖼️</span>
                    ) : doc.fileType.includes('word') ? (
                      <span className="text-xl">📝</span>
                    ) : (
                      <span className="text-xl">📎</span>
                    )}
                  </div>
                  <span className="ml-2 font-helvetica-regular text-sm px-2 py-1 bg-gray-200 rounded-md">
                    {DocumentTypeLabels[doc.documentType]}
                  </span>
                </div>
                {doc.isVerified ? (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-md flex items-center text-xs font-helvetica-regular">
                    <FaCheck className="mr-1" /> Verified
                  </div>
                ) : (
                  <div className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md flex items-center text-xs font-helvetica-regular">
                    <FaHourglass className="mr-1" /> Pending
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="font-helvetica-bold text-graphite mb-2 truncate">{doc.documentName}</h3>
                <p className="text-gray-500 text-sm mb-2">
                  Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
                {doc.expiryDate && (
                  <p className={`text-sm ${
                    new Date(doc.expiryDate) < new Date() 
                      ? 'text-red-600' 
                      : 'text-amber-600'
                  }`}>
                    Expires: {new Date(doc.expiryDate).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 px-4 py-3 flex justify-between border-t border-gray-200">
                <a 
                  href={doc.documentUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-desertclay hover:text-desertclay/80 flex items-center transition-all font-helvetica-regular text-sm"
                >
                  <FaEye className="mr-1" /> View
                </a>
                <button
                  onClick={() => handleDelete(doc.documentId)}
                  className="text-gray-500 hover:text-red-600 flex items-center transition-all font-helvetica-regular text-sm"
                >
                  <FaTrash className="mr-1" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Document Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-milk rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-helvetica-bold text-graphite">Upload Document</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-graphite mb-2 font-helvetica-regular">Document Type</label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brick"
                >
                  {Object.values(DocumentType).map(type => (
                    <option key={type} value={type}>
                      {DocumentTypeLabels[type]}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm mt-1">{DocumentTypeDescriptions[documentType]}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-graphite mb-2 font-helvetica-regular">Document Name</label>
                <input
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brick"
                  placeholder="Enter document name"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-graphite mb-2 font-helvetica-regular">Document File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center hover:border-brick transition-all">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="document-file"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    required
                  />
                  <label htmlFor="document-file" className="cursor-pointer block">
                    {selectedFile ? (
                      <div className="text-graphite">
                        <p className="font-helvetica-bold">{selectedFile.name}</p>
                        <p className="text-sm">{Math.round(selectedFile.size / 1024)} KB</p>
                      </div>
                    ) : (
                      <div className="text-gray-500">
                        <p>Click to select a file or drag and drop</p>
                        <p className="text-sm">Supported formats: PDF, DOC, JPG, PNG</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-graphite mb-2 font-helvetica-regular">Expiry Date (optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brick"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-graphite rounded-md hover:bg-gray-400 transition-all font-helvetica-regular"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading || !selectedFile}
                 className="px-4 py-2 bg-rustyred text-milk rounded-md hover:bg-opacity-90 transition-all font-helvetica-regular disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading ? (
                    <>
                      <FaHourglass className="inline mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Document'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Wallet Selector Modal */}
      <WalletSelector
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onSelectWallet={handleWalletSelect}
      />
    </div>
  );
};

export default PropertyDocuments;