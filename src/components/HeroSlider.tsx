// components/HeroSlider.tsx
import React from 'react';

interface HeroSliderProps {
    slides: any[];
    currentSlide: number;
    onSlideChange: (index: number) => void;
    onNext: () => void;
    onPrevious: () => void;
    onSlideClick?: (slideId: string) => void;
    loading?: boolean;
}

export const HeroSlider: React.FC<HeroSliderProps> = ({
    slides,
    currentSlide,
    onSlideChange,
    onNext,
    onPrevious,
    onSlideClick,
    loading = false,
}) => {
    const handleSlideClick = () => {
        const currentSlideData = slides[currentSlide];

        if (!currentSlideData) return;

        if (onSlideClick) {
            onSlideClick(currentSlideData.id);
        }

        if (currentSlideData.link && currentSlideData.link.trim() !== '') {
            window.open(currentSlideData.link, '_blank', 'noopener,noreferrer');
        }
    };
    const IMAGE_API_URL = import.meta.env.VITE_API2_URL_IMAGE

    const handleButtonClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        handleSlideClick();
    };

    const showNavigation = slides.length > 1;

    if (loading || slides.length === 0) {
        return (
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden w-full h-48 sm:h-64 md:h-72 lg:h-80 bg-gray-200 animate-pulse">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-gray-400 text-sm sm:text-base">Loading slides...</div>
                </div>
            </div>
        );
    }

    console.log(slides);

    return (
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden w-full h-48 sm:h-64 md:h-72 lg:h-80">
            <div className="relative w-full h-full">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                            }`}
                    >
                        <div
                            className={`bg-gradient-to-r ${slide.bgGradient} h-full relative ${slide.link ? 'cursor-pointer' : 'cursor-default'
                                }`}
                            onClick={slide.link ? handleSlideClick : undefined}
                        >
                            <div className="absolute inset-0 flex flex-col sm:flex-row">
                                <div className="flex-1 p-3 sm:p-4 md:p-6 flex flex-col justify-center order-2 sm:order-1">
                                    {slide.subtitle && (
                                        <span className="text-xs font-medium text-gray-600 mb-1">
                                            {slide.subtitle}
                                        </span>
                                    )}
                                    {slide.title && (
                                        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-black mb-2 sm:mb-3 leading-tight">
                                            {slide.title}
                                        </h2>
                                    )}
                                    {slide.discount && (
                                        <div className="mb-3 sm:mb-4">
                                            <span className="text-xs text-gray-600">Discount</span>
                                            <div className="text-lg sm:text-xl md:text-2xl font-bold text-orange-500">
                                                {slide.discount}
                                            </div>
                                        </div>
                                    )}
                                    {(slide.buttonText || slide.link) && (
                                        <button
                                            onClick={handleButtonClick}
                                            className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-colors w-fit text-xs sm:text-sm"
                                        >
                                            {slide.buttonText || 'Shop Now'}
                                        </button>
                                    )}
                                </div>
                                {slide.image && (
                                    <div className="flex-1 relative order-1 sm:order-2 min-h-[120px] sm:min-h-0">
                                        <img
                                            src={`${IMAGE_API_URL}${slide.image}`}
                                            alt={slide.title || 'Slide image'}
                                            className="absolute rounded-lg right-2 sm:right-0 top-1/2 transform -translate-y-1/2 h-24 sm:h-32 md:h-40 lg:h-52 w-auto object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {showNavigation && (
                <>
                    <button
                        onClick={onPrevious}
                        className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 sm:p-2 transition-all duration-200 shadow-md z-10"
                        aria-label="Previous slide"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={onNext}
                        className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-1.5 sm:p-2 transition-all duration-200 shadow-md z-10"
                        aria-label="Next slide"
                    >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2 z-10">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => onSlideChange(index)}
                                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-200 ${index === currentSlide
                                    ? 'bg-yellow-400 scale-110'
                                    : 'bg-white bg-opacity-60 hover:bg-opacity-80'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};