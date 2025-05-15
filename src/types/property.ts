
import { DocumentType } from './propertyDocuments';

// Property Document interface
export interface PropertyDocument {
  documentId: string;
  documentType: DocumentType;
  documentName: string;
  documentUrl: string;
  fileType: string;
  uploadDate: Date;
  expiryDate?: Date;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  verificationNotes?: string;
  documentHash?: string;
  metadata?: any;
}

// Property interface for frontend usage
export interface Property {
  _id: string;
  owner: string;
  propertyName: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  streetAddress: string;
  googleMapsURL?: string;
  propertyType: 'Residential' | 'Commercial' | 'Land' | 'Special-purpose' | 'Vacation/Short-term rentals';
  specificType: string;
  unitNo?: string;
  status: {
    sold: boolean;
    occupied: boolean;
    listingState: 'simply listed' | 'requested financing' | 'in marketplace waiting for financing' | 'accepted for collateral';
  };
  action: string;
  price: number;
  space: number;
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  security?: string;
  amenities: {
    furnished: boolean;
    pool: boolean;
    gym: boolean;
    garden: boolean;
    parking: boolean;
  };
  additionalComments?: string;
  rooms?: number;
  cryptoAccepted: boolean;
  images: string[];
  onchainId?: string;
  coOwned: boolean;
  availableShares: number;
  documents?: PropertyDocument[];
  blockchain?: {
    registered: boolean;
    registeredAt?: Date;
    verified: boolean;
    verifiedAt?: Date;
    transactionHash?: string;
  };
  isVerified: boolean;
  popularityScore: number;
  createdAt: Date;
  updatedAt: Date;
}

// Type for document upload response
export interface DocumentUploadResponse {
  uploadInfo: {
    fileName: string;
    fileType: string;
    timestamp: number;
  };
  documentInfo: {
    documentId: string;
    documentType: DocumentType;
    documentName: string;
    fileType: string;
    expiryDate?: Date;
    metadata?: any;
  };
}

// Document form input type
export interface DocumentFormInput {
  documentType: DocumentType;
  documentName: string;
  file: File;
  expiryDate?: Date;
  metadata?: Record<string, any>;
}