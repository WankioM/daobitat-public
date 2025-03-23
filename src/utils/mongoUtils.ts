export const getMongoId = (id: any): string | undefined => {
  if (!id) return undefined;
  
  // Case 1: String ID
  if (typeof id === 'string') return id;
  
  // Case 2: MongoDB Extended JSON format { $oid: "..." }
  if (typeof id === 'object' && id.$oid) return id.$oid;
  
  // Case 3: ObjectId with toString method
  if (typeof id === 'object' && typeof id.toString === 'function') {
    const idStr = id.toString();
    // Only return if it looks like a valid MongoDB ObjectId (24 hex chars)
    if (/^[0-9a-fA-F]{24}$/.test(idStr)) {
      return idStr;
    }
  }
  
  // Case 4: Handle the _id property if present
  if (typeof id === 'object' && id._id) {
    return getMongoId(id._id); // Recursive call to handle nested _id
  }
  
  console.error('Unable to extract MongoDB ID from:', id);
  return undefined;
};