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
        if (onClick) onClick();
        if (link) window.open(link, '_blank', 'noopener,noreferrer');
    };

    const IMAGE_API_URL = import.meta.env.VITE_API_URL_IMAGE;

    if (loading) {
        return (
            <div className={`bg-gray-200 rounded-2xl sm:rounded-3xl overflow-hidden h-44 sm:h-52 relative animate-pulse ${className}`}>
                <div className="absolute inset-0 flex items-center">
                    <div className="flex-1 p-4 sm:p-6 space-y-2">
                        <div className="bg-gray-300 h-5 sm:h-6 w-20 sm:w-24 rounded mb-2"></div>
                        <div className="bg-gray-300 h-4 sm:h-5 w-16 sm:w-20 rounded mb-1"></div>
                        <div className="bg-gray-300 h-6 sm:h-8 w-24 sm:w-32 rounded"></div>
                    </div>
                    <div className="flex-1 flex items-center justify-center p-4">
                        <div className="bg-gray-300 h-24 w-24 sm:h-28 sm:w-28 rounded-lg"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-gradient-to-r ${bgGradient} rounded-2xl sm:rounded-3xl overflow-hidden h-44 sm:h-52 relative cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 ${className}`}
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
                <div className="flex-1 p-4 sm:p-6 relative">
                    {badge && (
                        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-bold shadow-md">
                            {badge}
                        </div>
                    )}
                    <div className="mb-2 sm:mb-3 mt-6">
                        <span className="text-gray-600 text-xs sm:text-sm font-medium block">Price Just</span>
                        <div className="text-xl sm:text-2xl font-extrabold text-green-600 leading-tight">
                            {price}
                        </div>
                    </div>
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 leading-tight line-clamp-2 mb-1">
                        {title}
                    </h3>

                    {(onClick || link) && (
                        <span className="text-xs sm:text-sm text-gray-700 hover:text-gray-900 font-medium flex items-center mt-2 sm:mt-3 transition-transform group">
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
                    )}
                </div>

                <div className="flex-1 flex items-center justify-center p-4 sm:p-6 relative">
                    {image && (
                        <img
                            src={`${IMAGE_API_URL}${image}`}
                            alt={title}
                            className="h-24 sm:h-32 w-auto max-w-full object-contain rounded-xl shadow-lg transition-transform hover:scale-105"
                            loading="lazy"
                        />
                    )}
                </div>
            </div>
            <div className="absolute inset-0 bg-white bg-opacity-10 pointer-events-none rounded-2xl sm:rounded-3xl"></div>
        </div>
    );
};
