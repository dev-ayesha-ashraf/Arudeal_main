import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Seller {
    _id: string;
    name: string;
    email?: string;
    phone?: string;
}

interface Category {
    _id: string;
    name: string;
    slug: string;
    description: string;
}

interface Listing {
    _id: string;
    listingId: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    categoryId: Category;
    listingType: string;
    sellerId: string;
    createdAt: string;
}

const ListingDetail: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    const [listing, setListing] = useState<Listing | null>(null);
    const [seller, setSeller] = useState<Seller | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mainImageIndex, setMainImageIndex] = useState(0);

    const API_BASE_URL = import.meta.env.VITE_LISTING_API_URL;

    useEffect(() => {
        const fetchListingAndSeller = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/listings/${categoryId}`);
                if (!res.ok) throw new Error("Listing not found");
                const data: Listing = await res.json();
                setListing(data);

                const sellerRes = await fetch(`${API_BASE_URL}/api/sellers`);
                if (sellerRes.ok) {
                    const allSellers: Seller[] = await sellerRes.json();
                    const sellerData = allSellers.find((s) => s._id === data.sellerId);
                    setSeller(sellerData || null);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to load listing or seller.");
            } finally {
                setLoading(false);
            }
        };

        fetchListingAndSeller();
    }, [categoryId]);

    const changeMainImage = (direction: "prev" | "next") => {
        if (!listing) return;
        setMainImageIndex((prev) => {
            if (direction === "prev") {
                return prev === 0 ? listing.images.length - 1 : prev - 1;
            } else {
                return prev === listing.images.length - 1 ? 0 : prev + 1;
            }
        });
    };

    if (loading)
        return <div className="text-center p-12 text-yellow-500 text-xl font-semibold animate-pulse">Loading...</div>;
    if (error)
        return (
            <div className="text-center p-12 text-red-600 font-bold text-lg">{error}</div>
        );
    if (!listing)
        return <div className="text-center p-12 text-gray-900 text-lg font-semibold">Listing not found</div>;

    return (
        <div className="max-w-7xl mx-auto p-6 lg:p-12 flex flex-col lg:flex-row gap-12 bg-white">
            <div className="lg:w-2/3 max-w-[600px] flex flex-col gap-6 mx-auto">
                <div className="relative rounded-2xl shadow-2xl overflow-hidden bg-gray-50 border border-yellow-200">
                    <img
                        src={`${API_BASE_URL}/uploads/${listing.images[mainImageIndex]}`}
                        alt={listing.title}
                        className="w-full h-[55vh] object-contain transition-transform duration-500 hover:scale-105"
                    />
                    <button
                        onClick={() => changeMainImage("prev")}
                        className="absolute top-1/2 -translate-y-1/2 left-6 z-30 bg-yellow-400/90 p-4 rounded-full hover:bg-yellow-500 transition shadow-lg"
                    >
                        <ChevronLeft className="text-white w-7 h-7" />
                    </button>
                    <button
                        onClick={() => changeMainImage("next")}
                        className="absolute top-1/2 -translate-y-1/2 right-6 z-30 bg-yellow-400/90 p-4 rounded-full hover:bg-yellow-500 transition shadow-lg"
                    >
                        <ChevronRight className="text-white w-7 h-7" />
                    </button>

                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-lg font-bold uppercase shadow-lg text-sm tracking-wide">
                        Featured
                    </div>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-hide mt-4 px-2">
                    {listing.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={`${API_BASE_URL}/uploads/${img}`}
                            alt={`Thumbnail ${idx}`}
                            className={`h-24 w-24 object-cover rounded-lg cursor-pointer border-4 transition-transform ${idx === mainImageIndex
                                ? "border-yellow-400 scale-110 shadow-lg"
                                : "border-gray-300 hover:scale-105 hover:border-yellow-300"
                                }`}
                            onClick={() => setMainImageIndex(idx)}
                        />
                    ))}
                </div>
            </div>
            <div className="lg:w-1/3 flex flex-col gap-8">
                <div className="bg-yellow-50 text-gray-900 p-6 rounded-2xl shadow-xl border-l-4 border-yellow-400 hover:scale-105 transition-transform duration-300">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-600 tracking-wide">
                        Dealer Information
                    </h2>
                    <p className="mb-2">
                        <span className="font-semibold">Name:</span> {seller?.name || "System Admin"}
                    </p>
                    {seller?.email && (
                        <p className="mb-2">
                            <span className="font-semibold">Email:</span> {seller.email}
                        </p>
                    )}
                    {seller?.phone && (
                        <p className="mb-2">
                            <span className="font-semibold">Phone:</span> {seller.phone}
                        </p>
                    )}
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-2xl border-l-4 border-yellow-400 hover:scale-105 transition-transform duration-300">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                        {listing.title}
                    </h1>
                    <p className="text-gray-700 mb-6 leading-relaxed">{listing.description}</p>
                    <p className="text-yellow-600 text-2xl font-bold">
                        Price: AWG {listing.price.toLocaleString()}
                    </p>
                    <p className="mt-2 text-gray-500 text-sm">
                        Listed on: {new Date(listing.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ListingDetail;
