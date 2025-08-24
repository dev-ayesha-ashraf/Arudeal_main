// CategoryListing.tsx
import React, { useEffect, useState } from "react";
import FilterSidebar, { FilterState } from "./FilterSidebar";
import ListCard from "./ListCard";

interface Category {
  slug: string;
}
interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  categoryId: Category;
  listingType: string;
}

interface CategoryListingProps {
  categorySlug: string;      
  subdomainLink?: string;     
}

const CategoryListing: React.FC<CategoryListingProps> = ({
  categorySlug,
  subdomainLink,
}) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    brand: "",
    yearMin: 1990,
    yearMax: new Date().getFullYear(),
    color: "",
    area: "",
    priceMin: 0,
    priceMax: 9999999,
    listingType: "",
  });

  const API_BASE_URL = import.meta.env.VITE_LISTING_API_URL;

  const fetchListings = async () => {
    try {
      if (subdomainLink) {
        window.location.href = subdomainLink;
        return;
      }

      const res = await fetch(`${API_BASE_URL}/api/listings`);
      const data = await res.json();

      const filtered = data.filter(
        (item: Listing) =>
          item.categoryId?.slug?.toLowerCase() === categorySlug.toLowerCase()
      );

      setListings(filtered);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [categorySlug, subdomainLink]);

  const filteredListings = listings.filter((item) => {
    return (
      item.price >= filters.priceMin &&
      item.price <= filters.priceMax &&
      (filters.listingType === "" || item.listingType === filters.listingType)
    );
  });

  if (loading)
    return <div className="text-center p-4">Loading...</div>;
  if (error)
    return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      <div className="md:hidden flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-yellow-500">
          {categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)} for Sale
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-4 py-2 bg-yellow-400 text-white rounded-md font-medium shadow hover:bg-yellow-500 transition"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="flex gap-6 flex-col md:flex-row">
        <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4`}>
          <FilterSidebar filters={filters} setFilters={setFilters} />
        </div>
        <div className="flex-1">
          {filteredListings.length === 0 ? (
            <div className="text-center text-gray-500 py-10">
              <p>No {categorySlug} found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((item) => (
                <ListCard
                  key={item._id}
                  id={item._id} 
                  title={item.title}
                  price={item.price}
                  description={item.description}
                  image={`${API_BASE_URL}/uploads/${item.images[0]}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryListing;
