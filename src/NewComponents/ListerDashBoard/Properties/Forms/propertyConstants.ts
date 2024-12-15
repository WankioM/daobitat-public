export const PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Land',
  'Special-purpose',
  'Vacation/Short-term rentals'
] as const;

export const SPECIFIC_TYPES: Record<string, string[]> = {
  'Residential': [
    'House', 
    'Apartment', 
    'Condo', 
    'Townhouse', 
    'Villa', 
    'Studio', 
    'Mansion', 
    'Bungalow'
  ],
  'Commercial': [
    'Office', 
    'Retail', 
    'Industrial', 
    'Warehouse', 
    'Restaurant', 
    'Shopping Mall', 
    'Co-working Space'
  ],
  'Land': [
    'Residential Plot', 
    'Commercial Plot', 
    'Agricultural Land', 
    'Industrial Plot', 
    'Desert Land', 
    'Forest Land', 
    'Mountain Plot'
  ],
  'Special-purpose': [
    'Hotel', 
    'Hospital', 
    'School', 
    'Sports Facility', 
    'Religious Building', 
    'Event Hall', 
    
  ],
  'Vacation/Short-term rentals': [
    'Beach House', 
    'Mountain Cabin', 
    'Lake House', 
    'City Apartment', 
    'Desert Retreat', 
    'Safari Lodge', 
    'Treehouse',
    'Eco lodge'
  ],
 
};
