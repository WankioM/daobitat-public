import React, { useState, useRef, useEffect } from 'react';

interface PriceRange {
  label: string;
  min: number;
  max: number | null;
}

const priceRanges: PriceRange[] = [
  { label: '0-1 ETH', min: 0, max: 1 },
  { label: '1-5 ETH', min: 1, max: 5 },
  { label: '5-15 ETH', min: 5, max: 15 },
  { label: '15-40 ETH', min: 15, max: 40 },
  { label: '40 ETH and above', min: 40, max: null },
];

interface PriceRangeDropdownProps {
  onChange: (selectedRanges: PriceRange[]) => void;
}

const PriceRangeCheckboxes: React.FC<PriceRangeDropdownProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRanges, setSelectedRanges] = useState<PriceRange[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (range: PriceRange) => {
    const updatedRanges = selectedRanges.includes(range)
      ? selectedRanges.filter(r => r !== range)
      : [...selectedRanges, range];
    
    setSelectedRanges(updatedRanges);
    onChange(updatedRanges);
  };

  const toggleDropdown = () => setIsOpen(!isOpen);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#533c47]"
      >
        Price Range {selectedRanges.length > 0 && `(${selectedRanges.length})`}
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-56 bg-white shadow-lg max-h-56 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {priceRanges.map((range) => (
            <label key={range.label} className="flex items-center px-4 py-2 hover:bg-gray-100">
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-[#533c47]"
                checked={selectedRanges.includes(range)}
                onChange={() => handleCheckboxChange(range)}
              />
              <span className="ml-2 text-sm text-gray-700">{range.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default PriceRangeCheckboxes;