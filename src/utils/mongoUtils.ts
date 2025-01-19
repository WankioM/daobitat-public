import { MongoDBId } from '../types/messages';

export const getMongoId = (id: string | MongoDBId | undefined): string | undefined => {
  if (!id) return undefined;
  if (typeof id === 'string') return id;
  if (typeof id === 'object' && id.$oid) return id.$oid;
  return undefined;
};

// Type guard to check if an ID is in MongoDB format
export const isMongoDBId = (id: any): id is MongoDBId => {
  return typeof id === 'object' && id !== null && '$oid' in id;
};

// Helper to convert string ID to MongoDB format
export const toMongoId = (id: string): MongoDBId => {
  return { $oid: id };
};

// Helper to ensure consistent ID format
export const normalizeMongoId = (id: string | MongoDBId | undefined): MongoDBId | undefined => {
  const stringId = getMongoId(id);
  return stringId ? toMongoId(stringId) : undefined;
};