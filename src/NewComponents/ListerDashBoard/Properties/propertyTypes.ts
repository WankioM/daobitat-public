import { PROPERTY_TYPES, SPECIFIC_TYPES } from './Forms/propertyConstants';

export type PropertyType = typeof PROPERTY_TYPES[number];
export type SpecificType = string;

export interface Property {
  _id: string;
  propertyName: string;
  propertyType: PropertyType;
  specificType: SpecificType;
  action: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  streetAddress: string;
  googleMapsURL: string;
  unitNo: string;
  price: number;
  space: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  security: string;
  amenities: {
    furnished: boolean;
    pool: boolean;
    gym: boolean;
    garden: boolean;
    parking: boolean;
    [key: string]: boolean;
  };
  images: string[];
  additionalComments: string;
  cryptoAccepted: boolean;
  termsAccepted: boolean;
  status: {
    sold: boolean;
    occupied: boolean;
    listingState: 'simply listed' | 'requested financing' | 'in marketplace waiting for financing' | 'accepted for collateral';
  };
  currency?: string;
  owner: {
    _id: string;
    name: string;
    profileImage?: string;
    role?: string;
  };
  popularityScore: number;
  clicks: number;
  wishlistCount: number;
  clickHistory: Array<{ timestamp: Date }>;
  wishlistHistory: Array<{ timestamp: Date }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewPropertyFormData {
  propertyName: string;
  propertyType: PropertyType;
  specificType: SpecificType;
  action: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  streetAddress: string;
  googleMapsURL: string;
  unitNo: string;
  price: number;
  space: number;
  bedrooms: number;
  bathrooms: number;
  features: string[];
  security: string;
  amenities: {
    furnished: boolean;
    pool: boolean;
    gym: boolean;
    garden: boolean;
    parking: boolean;
  };
  images: string[];
  additionalComments: string;
  cryptoAccepted: boolean;
  termsAccepted: boolean;
  currency?: string;
}

export interface AddPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPropertyAdded: () => void;
}

export interface StepProps {
  formData: NewPropertyFormData;
  setFormData: React.Dispatch<React.SetStateAction<NewPropertyFormData>>;
}