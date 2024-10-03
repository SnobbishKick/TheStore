import React from 'react';
import "./SortPanel.css";

const SortPanel = ({ onSortChange, onFilterChange }) => {
    const handleSortChange = (e) => {
        onSortChange(e.target.value);
    };

    const handleFilterChange = (e) => {
        onFilterChange(e.target.name, e.target.value);
    };

    return (
        <div className="sort-panel">
            <select onChange={handleSortChange}>
                <option value="">Sort by</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
            </select>
            <select name="priceFilter" onChange={handleFilterChange}>
                <option value="">Select Price Slab</option>
                <option value="under500">Under ₹500</option>
                <option value="500to1000">₹500 to ₹1000</option>
                <option value="above1000">Above ₹1000</option>
            </select>
            <select name="brandFilter" onChange={handleFilterChange}>
                <option value="">Select Brand</option>
                <option value="Billabong">Billabong</option>
                <option value="BrandB">Brand B</option>
                {/* Add more brands as needed */}
            </select>
        </div>
    );
};

export default SortPanel;
