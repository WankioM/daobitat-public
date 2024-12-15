declare module 'react-places-autocomplete' {
  import * as React from 'react';

  export interface Suggestion {
    id: string;
    description: string;
    matched_substrings: { length: number; offset: number }[];
    placeId: string;
    structured_formatting: {
      main_text: string;
      secondary_text: string;
    };
    terms: { offset: number; value: string }[];
    types: string[];
  }

  export interface Suggestions {
    loading: boolean;
    status: string;
    data: Suggestion[];
  }

  export interface GeocodeResult {
    address_components: { long_name: string; short_name: string; types: string[] }[];
    formatted_address: string;
    geometry: {
      location: { lat: number; lng: number };
      viewport: {
        northeast: { lat: number; lng: number };
        southwest: { lat: number; lng: number };
      };
    };
    place_id: string;
    types: string[];
  }

  export interface LatLng {
    lat: number;
    lng: number;
  }

  export interface Options {
    bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
    componentRestrictions?: google.maps.places.ComponentRestrictions;
    location?: google.maps.LatLng | google.maps.LatLngLiteral;
    offset?: number;
    radius?: number;
    types?: string[];
  }

  export interface PlacesAutocompleteProps {
    value: string;
    onChange: (value: string) => void;
    onSelect: (address: string, placeId: string) => void;
    searchOptions?: Options;
    debounce?: number;
    highlightFirstSuggestion?: boolean;
    children: (options: {
      getInputProps: (options?: any) => any;
      suggestions: Suggestion[];
      getSuggestionItemProps: (suggestion: Suggestion, options?: any) => any;
      loading: boolean;
    }) => React.ReactNode;
  }

  const PlacesAutocomplete: React.FC<PlacesAutocompleteProps>;

  export default PlacesAutocomplete;
}
