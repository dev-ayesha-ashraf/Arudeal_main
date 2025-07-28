import React from "react";

export interface FilterState {
  category: string;
  brand: string;
  yearMin: number;
  yearMax: number;
  color: string;
  area: string;
  priceMin: number;
  priceMax: number;
  listingType: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

const categories = [
  { label: "All Categories", value: "" },
  { label: "Standard", value: "standard" },
  { label: "Cruiser", value: "cruiser" },
  { label: "Sportbike", value: "sportbike" },
  { label: "Touring", value: "touring" },
  { label: "Adventure", value: "adventure" },
  { label: "Scooter", value: "scooter" },
];

const brands = ["All", "Yamaha", "Honda", "KTM", "Suzuki", "BMW", "Royal Enfield"];
const colors = ["All", "Black", "White", "Red", "Blue", "Green", "Orange"];
const areas = ["All", "Oranjestad", "San Nicolas", "Paradera", "Santa Cruz",];


const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, setFilters }) => {
  const inputStyle =
    "w-full border border-yellow-400 bg-white text-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400";

  return (
    <div className="w-full md:w-64 bg-white text-gray-900 p-5 rounded-2xl max-h-[85vh] overflow-y-auto space-y-6">
      <h3 className="text-xl font-bold border-b border-yellow-400 pb-3 text-yellow-400">
        Bike Filters
      </h3>

      {/* Category */}
      <div>
        <label className="block text-sm font-semibold mb-1">Category</label>
        <select
          className={inputStyle}
          value={filters.category}
          onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
        >
          {categories.map((cat) => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Brand */}
      <div>
        <label className="block text-sm font-semibold mb-1">Brand</label>
        <select
          className={inputStyle}
          value={filters.brand}
          onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
        >
          {brands.map((brand) => (
            <option key={brand} value={brand === "All" ? "" : brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Year Range */}
      <div>
        <label className="block text-sm font-semibold mb-1">Year Range</label>
        <div className="flex gap-2">
          <input
            type="number"
            className={inputStyle}
            placeholder="Min"
            value={filters.yearMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, yearMin: +e.target.value }))}
          />
          <input
            type="number"
            className={inputStyle}
            placeholder="Max"
            value={filters.yearMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, yearMax: +e.target.value }))}
          />
        </div>
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-semibold mb-1">Color</label>
        <select
          className={inputStyle}
          value={filters.color}
          onChange={(e) => setFilters((prev) => ({ ...prev, color: e.target.value }))}
        >
          {colors.map((color) => (
            <option key={color} value={color === "All" ? "" : color}>{color}</option>
          ))}
        </select>
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-semibold mb-1">Area</label>
        <select
          className={inputStyle}
          value={filters.area}
          onChange={(e) => setFilters((prev) => ({ ...prev, area: e.target.value }))}
        >
          {areas.map((area) => (
            <option key={area} value={area === "All" ? "" : area}>{area}</option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-sm font-semibold mb-1">Price Range (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            className={inputStyle}
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMin: +e.target.value }))}
          />
          <input
            type="number"
            className={inputStyle}
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) => setFilters((prev) => ({ ...prev, priceMax: +e.target.value }))}
          />
        </div>
      </div>

      {/* Listing Type */}
      <div>
        <label className="block text-sm font-semibold mb-1">Listing Type</label>
        <select
          className={inputStyle}
          value={filters.listingType}
          onChange={(e) => setFilters((prev) => ({ ...prev, listingType: e.target.value }))}
        >
          <option value="">All</option>
          <option value="sale">Sale</option>
          <option value="auction">Auction</option>
        </select>
      </div>
    </div>
  );
};

export default FilterSidebar;
