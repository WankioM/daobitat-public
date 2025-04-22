// src/types/common.ts
export interface MongoDBId {
  $oid: string;
}

// ID can be string or MongoDB ObjectId format
export type ID = string | MongoDBId;

// Basic user interface
export interface User {
  _id: ID;
  name: string;
  email?: string;
  role: string;
  profileImage?: string;
  // Other user properties...
}

// Property interface 
export interface Property {
  _id: ID;
  propertyName: string;
  propertyType: string;
  specificType?: string;
  location?: string;
  streetAddress?: string;
  price: number;
  space: number;
  images: string[];
  owner: ID;
  action: 'rent' | 'sale';
  status: {
    sold: boolean;
    occupied: boolean;
    listingState: string;
  };
  // Other property fields...
}

/**
 * Helper function to convert any valid ID type to string
 * @param id Any ID type (string, MongoDBId, or object with _id)
 * @returns String representation of the ID
 */
export function idToString(id: ID | User | any): string {
  if (!id) return '';
  
  // Case 1: String ID
  if (typeof id === 'string') return id;
  
  // Case 2: MongoDB Extended JSON format { $oid: "..." }
  if (typeof id === 'object' && id.$oid) return id.$oid;
  
  // Case 3: Object with _id property
  if (typeof id === 'object' && id._id) {
    return idToString(id._id);
  }
  
  // Case 4: ObjectId with toString method
  if (typeof id === 'object' && typeof id.toString === 'function') {
    const idStr = id.toString();
    // Only return if it looks like a valid MongoDB ObjectId (24 hex chars)
    if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
      return idStr;
    }
  }
  
  // Last resort: stringify the object
  return String(id);
}

/**
 * Safely get ID from various types
 * @param input Input ID which could be string, MongoDBId, User or undefined
 * @returns Standardized ID or empty string if undefined
 */
export function safeGetId(input: ID | User | undefined): ID {
  // Handle undefined input
  if (input === undefined) return '';

  // If it's already a string, return it
  if (typeof input === 'string') return input;

  // If it's a MongoDBId object with $oid, return the $oid
  if (input && typeof input === 'object' && '$oid' in input) {
    return (input as MongoDBId).$oid;
  }

  // If it's a User or an object with _id, extract the _id
  if (input && typeof input === 'object' && '_id' in input) {
    const id = (input as any)._id;
    return safeGetId(id);
  }

  // Fallback to string conversion
  return String(input);
}