import { useEffect, useState } from 'react';
import axios from 'axios';

interface Listing {
    _id: string;
    title: string;
    description: string;
    price: number;
    image: string;
}

interface Section {
    _id: string;
    title: string;
    category: string;
    cardLimit: number;
}

interface ListingWithSection {
    section: Section;
    listings: Listing[];
}

export const useListingSections = () => {
    const [listingSections, setListingSections] = useState<ListingWithSection[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSectionsAndListings = async () => {
        try {
            setLoading(true);
            setError(null);

            const sectionRes = await axios.get<Section[]>(
                `${import.meta.env.VITE_LISTING_API_URL}/api/listing-sections`
            );
            const sections = sectionRes.data || [];

            const sectionListings: ListingWithSection[] = [];

            for (const section of sections) {
                const listingRes = await axios.get<any[]>(
                    `${import.meta.env.VITE_LISTING_API_URL}/api/listings?categorySlug=${section.category}`
                );

                const slicedListings = listingRes.data.slice(0, section.cardLimit);

                const BASE_IMAGE_URL = "https://realestate.arudeal.com";

                const mappedListings: Listing[] = slicedListings.map((listing) => ({
                    _id: listing._id,
                    title: listing.title,
                    description: listing.description,
                    price: listing.price,
                    image: `${BASE_IMAGE_URL}/uploads${listing.images?.[0] || ''}`,
                }));


                sectionListings.push({
                    section,
                    listings: mappedListings,
                });
            }

            setListingSections(sectionListings);
        } catch (err: any) {
            console.error("Failed to load listings:", err);
            setError(err?.message || "Unknown error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSectionsAndListings();
    }, []);

    return {
        listingSections,
        loading,
        error,
        refresh: fetchSectionsAndListings,
    };
};
