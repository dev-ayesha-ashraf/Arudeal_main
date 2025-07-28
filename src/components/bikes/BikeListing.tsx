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
    <div className="p-6 flex flex-col md:flex-row gap-6">
      <FilterSidebar filters={filters} setFilters={setFilters} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
        {filteredBikes.length > 0 ? (
          filteredBikes.map((bike) => (
            <BikeCard
              key={bike._id}
              title={bike.title}
              price={bike.price}
              description={bike.description}
              image={bike.images[0]}
            />
          ))
        ) : (
          <div className="text-center col-span-full">No bikes match the filters.</div>
        )}
      </div>
    </div>
  );
};

export default BikeListing;
