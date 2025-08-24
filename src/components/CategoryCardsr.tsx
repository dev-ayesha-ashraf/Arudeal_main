import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
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

interface CategoryCardsProps {
  loading?: boolean;
  selectedCategoryId?: number;
  selectedSubcategoryId?: string;
}

export const CategoryCards: React.FC<CategoryCardsProps> = ({
  loading = false,
}) => {
  const [dynamicCategories, setDynamicCategories] = useState<Category[]>([]);
  const [expandedMap, setExpandedMap] = useState<Record<number, boolean>>({});
  const cardRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const { data: carsData, isLoading: carsLoading } = useCars();

  useEffect(() => {
    let categoriesToShow: Category[] = [
      {
        id: 2,
        name: 'Real Estate',
        icon: <Home className="h-6 w-6 text-indigo-600" />,
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
        icon: <Home className="h-6 w-6 text-purple-500" />,
        link: "/stays/listings",
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
        icon: <Waves className="h-6 w-6 text-cyan-500" />,
        link: "/watersports/listings",
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
        icon: <Scissors className="h-6 w-6 text-pink-500" />,
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
        icon: <Bike className="h-6 w-6 rotate-90 text-orange-500" />,
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

    if (carsData?.data && Array.isArray(carsData.data)) {
      const totalCarsCount = carsData.data.reduce(
        (total: number, type: any) => total + (type.totalCars || 0),
        0
      );

      if (totalCarsCount > 0) {
        const carSubcategories: Subcategory[] = carsData.data
          .filter((type: any) => (type.totalCars || 0) > 0)
          .map((type: any) => ({
            id: type._id,
            name: type.name,
            count: type.totalCars || 0,
            link: `https://cars.arudeal.com/listings?type=${type.slug}&sort=date-desc`
          }));

        categoriesToShow.unshift({
          id: 1,
          name: 'Cars',
          icon: <Car className="h-6 w-6 text-red-500" />,
          link: "https://cars.arudeal.com/listings?sort=date-desc",
          isPopular: true,
          count: totalCarsCount,
          hasSubmenu: true,
          subcategories: carSubcategories
        });
      }
    }

    setDynamicCategories(categoriesToShow.filter(c => c.count === undefined || c.count > 0));
  }, [carsData]);

  const toggleCategory = (categoryId: number) => {
    setExpandedMap(prev => {
      const isCurrentlyExpanded = !!prev[categoryId];
      return dynamicCategories.reduce((acc, cat) => {
        acc[cat.id] = cat.id === categoryId ? !isCurrentlyExpanded : false;
        return acc;
      }, {} as Record<number, boolean>);
    });
  };

  const handleSubcategoryClick = (link?: string, fallback?: string) => {
    if (link) window.open(link, "_blank");
    else if (fallback) window.open(fallback, "_blank");
  };

  const isDataLoading = loading || carsLoading;

  if (isDataLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-40 bg-gray-200 rounded-xl shadow-md"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-6 relative">
      {dynamicCategories.map(category => {
        const cardRef = (el: HTMLDivElement) => {
          cardRefs.current[category.id] = el;
        };

        return (
          <div
            key={category.id}
            ref={cardRef}
            className="flex-shrink-0 w-full sm:w-[48%] md:w-[31%] lg:w-[23%] relative bg-white bg-opacity-80 backdrop-blur-md shadow-lg rounded-2xl p-5 flex flex-col transition-transform hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-tr hover:from-indigo-50 hover:to-pink-50 cursor-pointer"
          >
            <div
              className="flex items-center justify-between"
              onClick={() =>
                category.hasSubmenu
                  ? toggleCategory(category.id)
                  : window.open(category.link, "_blank")
              }
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-tr from-indigo-100 to-pink-100 rounded-xl shadow-inner">
                  {category.icon}
                </div>
                <div>
                  <h4 className="text-gray-900 font-semibold text-lg">{category.name}</h4>
                  {category.count !== undefined && (
                    <p className="text-xs text-gray-500 mt-1">{category.count} items</p>
                  )}
                </div>
              </div>
              {category.hasSubmenu &&
                (expandedMap[category.id] ? (
                  <ChevronDown className="w-5 h-5 text-gray-500" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-gray-500" />
                ))}
            </div>

            {category.isPopular && (
              <span className="absolute top-3 right-3 inline-block bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm animate-pulse">
                Hot
              </span>
            )}

            {/* Portal dropdown */}
            {category.hasSubmenu &&
              expandedMap[category.id] &&
              cardRefs.current[category.id] &&
              createPortal(
                <div
                  style={{
                    position: 'absolute',
                    top:
                      cardRefs.current[category.id]!.getBoundingClientRect().bottom +
                      window.scrollY,
                    left:
                      cardRefs.current[category.id]!.getBoundingClientRect().left +
                      window.scrollX,
                    width: cardRefs.current[category.id]!.offsetWidth,
                    zIndex: 1000,
                  }}
                  className="border border-gray-200 rounded-xl bg-white shadow-lg p-2 max-h-60 overflow-y-auto"
                >
                  {category.subcategories?.map(sub => (
                    <div
                      key={sub.id}
                      onClick={() => handleSubcategoryClick(sub.link, category.link)}
                      className="flex justify-between items-center text-sm text-gray-700 hover:text-yellow-600 transition-colors px-2 py-1 rounded-md hover:bg-yellow-50 cursor-pointer"
                    >
                      <span className="font-medium">{sub.name}</span>
                      {sub.count !== undefined && (
                        <span className="text-xs text-gray-400">{sub.count}</span>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => window.open(category.link, "_blank")}
                    className="mt-2 text-sm font-medium text-yellow-600 hover:underline"
                  >
                    View all →
                  </button>
                </div>,
                document.body
              )}
          </div>
        );
      })}
    </div>
  );
};
