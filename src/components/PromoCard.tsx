import React from 'react';

interface PromoCardProps {
    title: string;
    price: string;
    badge?: string;
    image: string;
    bgGradient: string;
    link?: string;
    onClick?: () => void;
    loading?: boolean;
    className?: string;
}

export const PromoCard: React.FC<PromoCardProps> = ({
    title,
    price,
    badge,
    image,
    bgGradient,
    link,
    onClick,
    loading = false,
    className = '',
}) => {
    const handleClick = () => {
        // First execute the onClick callback (for tracking)
        if (onClick) {
            onClick();
        }

        // Then navigate to the link regardless of onClick
        if (link) {
            window.open(link, '_blank', 'noopener,noreferrer');
        }
    }

    const IMAGE_API_URL = import.meta.env.VITE_API2_URL_IMAGE

    console.log(link, 'link');

    if (loading) {
        return (
            <div className={`bg-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden h-40 sm:h-48 relative animate-pulse ${className}`}>
                <div className="absolute inset-0 flex items-center">
                    <div className="flex-1 p-4 sm:p-6">
                        <div className="bg-gray-300 h-4 sm:h-6 w-16 sm:w-20 rounded mb-2"></div>
                        <div className="mb-3">
                            <div className="bg-gray-300 h-3 sm:h-4 w-12 sm:w-16 rounded mb-1"></div>
                            <div className="bg-gray-300 h-6 sm:h-8 w-20 sm:w-24 rounded"></div>
                        </div>
                        <div className="bg-gray-300 h-4 sm:h-6 w-24 sm:w-32 rounded"></div>
                    </div>
                    <div className="flex-1 relative h-full flex items-center justify-center p-4">
                        <div className="bg-gray-300 h-20 w-20 sm:h-24 sm:w-24 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-gradient-to-r ${bgGradient} rounded-2xl sm:rounded-3xl overflow-hidden h-40 sm:h-48 relative cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200 ${className}`}
            onClick={handleClick}
            role={onClick || link ? "button" : undefined}
            tabIndex={onClick || link ? 0 : undefined}
            onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && (onClick || link)) {
                    e.preventDefault();
                    handleClick();
                }
            }}
        >
            <div className="absolute inset-0 flex items-center">
                <div className="flex-1 p-4 sm:p-6">
                    {badge && (
                        <div className="bg-blue-600 text-white px-2 py-1 sm:px-3 rounded-full text-xs font-bold mb-2 sm:mb-3 w-fit shadow-sm">
                            {badge}
                        </div>
                    )}
                    <div className="mb-2 sm:mb-3">
                        <span className="text-gray-600 text-xs sm:text-sm font-medium block">Price Just</span>
                        <div className="text-xl sm:text-2xl font-bold text-green-600 leading-tight">
                            {price}
                        </div>
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-800 leading-tight line-clamp-2 mb-2 sm:mb-0">
                        {title}
                    </h3>

                    {(onClick || link) && (
                        <div className="mt-2 sm:mt-3">
                            <span className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-medium flex items-center">
                                Shop Now
                                <svg
                                    className="w-3 h-3 sm:w-4 sm:h-4 ml-1 transition-transform group-hover:translate-x-1"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 relative h-full flex items-center justify-center p-3 sm:p-4">
                    {image && (
                        <img
                            src={`${IMAGE_API_URL}${image}`}
                            alt={title}
                            className="h-20 sm:h-28 w-auto max-w-full object-contain rounded-lg shadow-sm"
                            loading="lazy"
                            onError={(e) => {
                                e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNGM0Y0RjYiLz48L3N2Zz4=';
                            }}
                        />
                    )}
                </div>
            </div>

            <div className="absolute inset-0 bg-white bg-opacity-10 pointer-events-none"></div>
        </div>
    );
};