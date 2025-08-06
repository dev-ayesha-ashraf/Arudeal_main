import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Car, Home, Waves, Scissors, Bike } from 'lucide-react';
import { useCars } from '@/hooks/useCarsList';

interface Subcategory {
    id: string;
    name: string;
    count?: number;
    link?: string;
}

interface Category {
    id: number;
    name: string;
    icon: React.ReactNode;
    isPopular?: boolean;
    hasSubmenu?: boolean;
    subcategories?: Subcategory[];
    count?: number;
    link: string;
}

interface CategorySidebarProps {
    loading?: boolean;
    selectedCategoryId?: number;
    selectedSubcategoryId?: string;
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
    loading = false,
    selectedCategoryId,
    selectedSubcategoryId,
}) => {
    const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
    const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);

    const { data: carsData, isLoading: carsLoading } = useCars();

    console.log('Cars Data:', carsData);

    const staticCategories: Category[] = [
        {
            id: 2,
            name: 'Real Estate',
            icon: <Home className="h-5 w-5" />,
            link: "https://realestate.arudeal.com/",
            isPopular: true,
            count: 850,
            hasSubmenu: true,
            subcategories: [
                { id: '21', name: 'Houses for Sale', count: 320 },
                { id: '22', name: 'Apartments', count: 280 },
                { id: '23', name: 'Commercial', count: 95 },
                { id: '24', name: 'Land & Plots', count: 155 }
            ]
        },
        {
            id: 3,
            name: 'Stays',
            icon: <Home className="h-5 w-5" />,
            link: "https://stays.arudeal.com",
            count: 420,
            hasSubmenu: true,
            subcategories: [
                { id: '31', name: 'Hotels', count: 180 },
                { id: '32', name: 'Guest Houses', count: 120 },
                { id: '33', name: 'Vacation Rentals', count: 85 },
                { id: '34', name: 'Hostels', count: 35 }
            ]
        },
        {
            id: 4,
            name: 'Water Sports',
            icon: <Waves className="h-5 w-5" />,
            link: "https://watersport.arudeal.com",
            count: 180,
            hasSubmenu: true,
            subcategories: [
                { id: '41', name: 'Surfing', count: 45 },
                { id: '42', name: 'Jet Skiing', count: 35 },
                { id: '43', name: 'Boat Rentals', count: 55 },
                { id: '44', name: 'Swimming Lessons', count: 25 },
                { id: '45', name: 'Diving', count: 20 }
            ]
        },
        {
            id: 5,
            name: 'Nail Services',
            icon: <Scissors className="h-5 w-5" />,
            link: "https://nails.arudeal.com",
            isPopular: true,
            count: 95,
            hasSubmenu: true,
            subcategories: [
                { id: '51', name: 'Manicure', count: 40 },
                { id: '52', name: 'Pedicure', count: 35 },
                { id: '53', name: 'Nail Art', count: 15 },
                { id: '54', name: 'Gel Nails', count: 5 }
            ]
        },
        {
            id: 6,
            name: 'Bikes',
            icon: <Bike className="h-5 w-5 rotate-90" />,
            link: "/bikes/listings",
            count: 320,
            hasSubmenu: true,
            subcategories: [
                { id: '61', name: 'Sports Bikes', count: 100, link: "/bikes/listings?sports=true" },
                { id: '62', name: 'Scooters', count: 85, link: "/bikes/listings?scooters=true" },
                { id: '63', name: 'Cruisers', count: 70, link: "/bikes/listings?cruisers=true" },
                { id: '64', name: 'Electric Bikes', count: 65, link: "/bikes/listings?electric=true" }
            ]
        }
    ];

    useEffect(() => {
        let categoriesToShow = [...staticCategories];

        // Check if carsData has the expected structure
        if (carsData?.data && Array.isArray(carsData.data)) {
            // Calculate total cars count
            const totalCarsCount = carsData.data.reduce((total: number, type: any) => {
                return total + (type.totalCars || 0);
            }, 0);

            if (totalCarsCount > 0) {
                // Create subcategories from car types
                const carSubcategories: Subcategory[] = carsData.data
                    .filter((type: any) => (type.totalCars || 0) > 0) // Only include types with cars
                    .map((type: any) => ({
                        id: type._id,
                        name: type.name,
                        count: type.totalCars || 0,
                        link: `https://cars.arudeal.com/listings?type=${type.slug}&sort=date-desc`
                    }));

                if (carSubcategories.length > 0) {
                    const carsCategory: Category = {
                        id: 1,
                        name: 'Cars',
                        icon: <Car className="h-5 w-5" />,
                        link: "https://cars.arudeal.com/listings?sort=date-desc",
                        isPopular: true,
                        count: totalCarsCount,
                        hasSubmenu: true,
                        subcategories: carSubcategories
                    };

                    // Add cars category at the beginning
                    categoriesToShow = [carsCategory, ...staticCategories];
                }
            }
        }

        // Filter out categories with 0 count (if needed)
        const filteredCategories = categoriesToShow.filter(category => {
            if (category.count === undefined) return true;
            return category.count > 0;
        });

        setDynamicCategories(filteredCategories);
    }, [carsData]); // Only depend on carsData

    const toggleCategory = (categoryId: number) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleCategoryClick = (category: Category) => {
        if (category.hasSubmenu && category.subcategories?.length) {
            toggleCategory(category.id);
        } else {
            window.open(category.link, '_blank');
        }
    };

    const handleSubcategoryClick = (categoryId: number, subcategoryId: string) => {
        const category = dynamicCategories.find(cat => cat.id === categoryId);
        const subcategory = category?.subcategories?.find(sub => sub.id === subcategoryId);

        if (category && subcategory) {
            if (categoryId === 1 && subcategory.link) {
                // For cars, use the subcategory's specific link
                window.open(subcategory.link, '_blank');
            } else {
                // For other categories, use the main category link
                window.open(category.link, '_blank');
            }
        }
    };

    const handleViewAllClick = (category: Category) => {
        window.open(category.link, '_blank');
    };

    const isDataLoading = loading || carsLoading; // Removed typesLoading

    if (isDataLoading) {
        return (
            <div className="hidden lg:block w-64 flex-shrink-0">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
                    <div className="bg-gray-200 px-4 py-3 h-12"></div>
                    <div className="py-2">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="w-6 h-6 bg-gray-200 rounded mr-3"></div>
                                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                                    <div className="w-8 h-4 bg-gray-200 rounded ml-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (dynamicCategories.length === 0) {
        return null;
    }

    return (
        <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="bg-yellow-400 px-4 py-3">
                    <h3 className="font-semibold text-black flex items-center">
                        <span className="mr-2">☰</span>
                        Shop By Category
                    </h3>
                </div>
                <div className="py-2 max-h-96 overflow-y-auto">
                    {dynamicCategories.map((category) => (
                        <div key={category.id} className="border-b border-gray-100 last:border-b-0">
                            <div
                                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${selectedCategoryId === category.id ? 'bg-yellow-50 border-r-2 border-yellow-400' : ''
                                    }`}
                                onClick={() => handleCategoryClick(category)}
                            >
                                <div className="flex items-center flex-1">
                                    <span className="mr-3 text-gray-600" role="img" aria-label={category.name}>
                                        {category.icon}
                                    </span>
                                    <div className="flex-1">
                                        <span className="text-gray-700 text-sm block font-medium">
                                            {category.name}
                                        </span>
                                        {category.count !== undefined && (
                                            <span className="text-gray-400 text-xs">
                                                ({category.count} items)
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center">
                                        {category.isPopular && (
                                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full mr-2">
                                                Hot
                                            </span>
                                        )}
                                        {category.hasSubmenu && category.subcategories?.length && (
                                            <span className="text-gray-400">
                                                {expandedCategories.has(category.id) ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {category.hasSubmenu &&
                                category.subcategories?.length &&
                                expandedCategories.has(category.id) && (
                                    <div className="bg-gray-50">
                                        {category.subcategories.map((subcategory) => (
                                            <div
                                                key={subcategory.id}
                                                className={`flex items-center justify-between px-8 py-2 hover:bg-gray-100 cursor-pointer transition-colors border-b border-gray-200 last:border-b-0 ${selectedSubcategoryId === subcategory.id ? 'bg-yellow-50 border-r-2 border-yellow-400' : ''
                                                    }`}
                                                onClick={() => handleSubcategoryClick(category.id, subcategory.id)}
                                            >
                                                <span className="text-gray-600 text-sm">
                                                    {subcategory.name}
                                                </span>
                                                {subcategory.count !== undefined && (
                                                    <span className="text-gray-400 text-xs">
                                                        ({subcategory.count})
                                                    </span>
                                                )}
                                            </div>
                                        ))}

                                        <div
                                            className="px-8 py-2 hover:bg-gray-100 cursor-pointer transition-colors border-t border-gray-300"
                                            onClick={() => handleViewAllClick(category)}
                                        >
                                            <span className="text-yellow-600 text-sm font-medium">
                                                View All {category.name} →
                                            </span>
                                        </div>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};