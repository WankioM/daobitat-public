import React, { useState } from 'react';
import './SearchBox.css';

const SearchBox: React.FC = () => {
  const [searchLocationTerm, setSearchLocationTerm] = useState<string>("");
  const [searchCategoryTerm, setSearchCategoryTerm] = useState<string>("");
  const [searchBudgetTerm, setSearchBudgetTerm] = useState<string>("");
  const [searchModeTerm, setSearchModeTerm] = useState<string>("");
  const [searchPropTypeTerm, setSearchPropTypeTerm] = useState<string>("");

  const handleSearch = () => {
    console.log(
      'Searching for:',
      searchLocationTerm,
      searchCategoryTerm,
      searchBudgetTerm,
      searchModeTerm,
      searchPropTypeTerm
    );
  };

  return (
    <div className="search-container">
      <h1 className="search-title">
        <span className="text-celadon">Find</span> Your Perfect Property
      </h1>

      <div className="search-grid">
        <input
          type="text"
          placeholder="Enter Location"
          value={searchLocationTerm}
          onChange={(e) => setSearchLocationTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={searchCategoryTerm}
          onChange={(e) => setSearchCategoryTerm(e.target.value)}
          className="search-input"
        >
          <option value="" disabled>Select Category</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
          <option value="Sold">Sold</option>
          <option value="Not Specified">Not Specified</option>
        </select>   

        <select
          value={searchBudgetTerm}
          onChange={(e) => setSearchBudgetTerm(e.target.value)}
          className="search-input"
        >
          <option value="" disabled>Estimated budget</option>
          <option value="0-$10k">0-$10k</option>
          <option value="$10K-$50K">$10K-$50K</option>
          <option value="Above 50k">Above 50K</option>
          <option value="Not Specified">Not Specified</option>
        </select>

        <select
          value={searchPropTypeTerm}
          onChange={(e) => setSearchPropTypeTerm(e.target.value)}
          className="search-input"
        >
          <option value="" disabled>Property type</option>
          <option value="Apartment">Apartment</option>
          <option value="Townhouses/Standalones">Townhouses/Standalones</option>
          <option value="Lots/Land">Lots/Land</option>
          <option value="Commercial property">Commercial property</option>
          <option value="Not Specified">Not Specified</option>
        </select>

        <select
          value={searchModeTerm}
          onChange={(e) => setSearchModeTerm(e.target.value)}
          className="search-input"
        >
          <option value="" disabled>Mode of Payment</option>
          <option value="Crypto">Crypto</option>
          <option value="Cash">Cash</option>
          <option value="Cash">Hybrid</option>
          <option value="Not Specified">Not Specified</option>
        </select>

        <button type="button" onClick={handleSearch} className="search-button">
          Search Properties
        </button>
      </div>
    </div>
  );
};

export default SearchBox;