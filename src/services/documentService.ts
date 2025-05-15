import api from './api';
import { DocumentType } from '../types/propertyDocuments';
import { PropertyDocument, DocumentUploadResponse } from '../types/property';

/**
 * Service for handling property document operations
 */
export const documentService = {
  /**
   * Get all documents for a property
   * @param propertyId - The ID of the property
   */
  async getPropertyDocuments(propertyId: string): Promise<PropertyDocument[]> {
    try {
      const response = await api.get(`/api/properties/${propertyId}/documents`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching property documents:', error);
      throw error;
    }
  },

  /**
   * Get documents by type for a property
   * @param propertyId - The ID of the property
   * @param documentType - The type of document to filter by
   */
  async getDocumentsByType(propertyId: string, documentType: DocumentType): Promise<PropertyDocument[]> {
    try {
      const response = await api.get(`/api/properties/${propertyId}/documents/type`, {
        params: { type: documentType }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching documents by type:', error);
      throw error;
    }
  },

  /**
   * Add a document to a property
   * @param propertyId - The ID of the property
   * @param documentData - The document data to add
   */
  async addPropertyDocument(
    propertyId: string,
    documentData: {
      documentType: DocumentType;
      documentName: string;
      documentUrl: string;
      fileType: string;
      expiryDate?: Date;
      metadata?: any;
    }
  ): Promise<PropertyDocument> {
    try {
      const response = await api.post(`/api/properties/${propertyId}/documents`, documentData);
      return response.data.data;
    } catch (error) {
      console.error('Error adding property document:', error);
      throw error;
    }
  },

  /**
   * Update a property document
   * @param propertyId - The ID of the property
   * @param documentId - The ID of the document to update
   * @param updateData - The document data to update
   */
  async updatePropertyDocument(
    propertyId: string,
    documentId: string,
    updateData: Partial<{
      documentName: string;
      documentUrl: string;
      fileType: string;
      expiryDate?: Date;
      metadata?: any;
    }>
  ): Promise<PropertyDocument> {
    try {
      const response = await api.put(
        `/api/properties/${propertyId}/documents/${documentId}`,
        updateData
      );
      return response.data.data;
    } catch (error) {
      console.error('Error updating property document:', error);
      throw error;
    }
  },

  /**
   * Delete a property document
   * @param propertyId - The ID of the property
   * @param documentId - The ID of the document to delete
   */
  async deletePropertyDocument(propertyId: string, documentId: string): Promise<void> {
    try {
      await api.delete(`/api/properties/${propertyId}/documents/${documentId}`);
    } catch (error) {
      console.error('Error deleting property document:', error);
      throw error;
    }
  },

  /**
   * Upload a document file and then add it to a property
   * This is a two-step process: first upload the file, then add the document reference
   * @param propertyId - The ID of the property
   * @param file - The file to upload
   * @param documentInfo - Additional document information
   */
  // Update in documentService.ts - uploadAndAddDocument method

async uploadAndAddDocument(
    propertyId: string,
    file: File,
    documentInfo: {
      documentType: DocumentType;
      documentName: string;
      expiryDate?: Date;
      metadata?: any;
    }
  ): Promise<PropertyDocument> {
    try {
      // Make sure to use web-vids bucket with propertydocs folder
      const fileName = `propertydocs/${propertyId}/${documentInfo.documentType}_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      
      // Step 1: Get a signed URL for upload
      const signedUrlResponse = await api.post(`/api/properties/images/signed-url`, {
        fileName,
        fileType: file.type
      });
  
      const { signedUrl, fileUrl } = signedUrlResponse.data.data;
  
      // Step 2: Upload the file directly to storage
      await fetch(signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type
        },
        body: file
      });
  
      // Step 3: Make the file public
      await api.post(`/api/properties/images/public`, {
        fileName: signedUrlResponse.data.data.fileName
      });
  
      // Step 4: Add the document to the property
      return await documentService.addPropertyDocument(propertyId, {
        documentType: documentInfo.documentType,
        documentName: documentInfo.documentName,
        documentUrl: fileUrl,
        fileType: file.type,
        expiryDate: documentInfo.expiryDate,
        metadata: {
          ...documentInfo.metadata,
          bucket: 'web-vids',
          folder: 'propertydocs'
        }
      });
    } catch (error) {
      console.error('Error uploading and adding document:', error);
      throw error;
    }
  },

 /**
 * Get count of documents by type
 * @param propertyId - The ID of the property
 */
async getDocumentCounts(propertyId: string): Promise<Record<DocumentType, number>> {
    try {
      const response = await api.get(`/api/properties/${propertyId}/documents/counts`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting document counts:', error);
      throw error;
    }
  },



  // Update in documentService.ts - uploadAndAddDocument method

 }




export default documentService;