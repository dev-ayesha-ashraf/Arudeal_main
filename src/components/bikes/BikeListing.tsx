import React, { useEffect, useState } from "react";
import BikeCard from "./Bikecard";
import FilterSidebar from "./FilterSidebar";
import { FilterState } from "./FilterSidebar";

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

const BikeListing: React.FC = () => {
  const [bikes, setBikes] = useState<Listing[]>([]);
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

  const fetchBikes = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/listings`);
      const data = await res.json();
      const bikeListings = data.filter(
        (item: Listing) => item.categoryId?.slug?.toLowerCase() === "bike"
      );
      setBikes(bikeListings);
    } catch (err) {
      console.error("Error fetching listings:", err);
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBikes();
  }, []);

  const filteredBikes = bikes.filter((bike) => {
    return (
      bike.price >= filters.priceMin &&
      bike.price <= filters.priceMax &&
      (filters.listingType === "" || bike.listingType === filters.listingType)
    );
  });

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

return (
  <div className="p-4 md:p-6 max-w-7xl mx-auto">
    {/* Mobile filter toggle */}
    <div className="md:hidden flex justify-between items-center mb-4">
      <h1 className="text-2xl font-bold text-yellow-500">Bikes for Sale</h1>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="px-4 py-2 bg-yellow-400 text-white rounded-md font-medium shadow hover:bg-yellow-500 transition"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>
    </div>

    <div className="flex gap-6 flex-col md:flex-row">
      {/* Sidebar */}
      <div className={`${showFilters ? "block" : "hidden"} md:block md:w-1/4`}>
        <FilterSidebar filters={filters} setFilters={setFilters} />
      </div>

      {/* Listings */}
      <div className="flex-1">
        {filteredBikes.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>No bikes found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredBikes.map((bike) => (
              <BikeCard
                key={bike._id}
                title={bike.title}
                price={bike.price}
                description={bike.description}
                image={`${API_BASE_URL}/uploads/${bike.images[0]}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
);

};

export default BikeListing;
