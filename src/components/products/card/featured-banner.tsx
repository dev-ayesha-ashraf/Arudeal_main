import React, { useState, useEffect, useCallback } from "react";
import { ArrowRight, Play, ChevronLeft, ChevronRight, Pause } from "lucide-react";

interface BaseBannerProps {
  id?: string;
  onClick?: (id?: string) => void;
  className?: string;
}

interface FeaturedBannerProps extends BaseBannerProps {
  title: string;
  subtitle?: string;
  description?: string;
  discount?: string;
  price?: string;
  originalPrice?: string;
  buttonText?: string;
  image?: string;
  imageAlt?: string;
  layout?: "default" | "compact" | "minimal";
  bgGradient?: string;
  textColor?: string;
  size?: "large" | "medium" | "small";
}

interface CompactBannerProps extends BaseBannerProps {
  title: string;
  price?: string;
  originalPrice?: string;
  image?: string;
  bgGradient?: string;
}

interface MinimalBannerProps extends BaseBannerProps {
  title: string;
  subtitle?: string;
  buttonText?: string;
  bgGradient?: string;
}

interface BannerGridProps {
  children: React.ReactNode;
  className?: string;
}

interface BannerSliderProps {
  children: React.ReactNode;
  className?: string;
  autoplay?: boolean;
  autoplayInterval?: number;
  showNavigation?: boolean;
  showPagination?: boolean;
  slidesToShow?: number;
  spaceBetween?: number;
}

const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  id,
  title,
  subtitle,
  description,
  discount,
  price,
  originalPrice,
  buttonText = "Shop Now",
  image,
  imageAlt,
  layout = "default",
  bgGradient = "from-slate-50 via-gray-100 to-slate-200",
  textColor = "text-gray-900",
  size = "large",
  onClick,
  className = "",
}) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  const handleClick = (): void => {
    onClick?.(id);
  };

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onClick?.(id);
  };

  return (
    <div
      className={`
        bg-gradient-to-r ${bgGradient} rounded-2xl p-6 lg:p-8 
        relative overflow-hidden cursor-pointer group
        transition-all duration-300 hover:shadow-lg
        ${size === "large"
          ? "min-h-[300px]"
          : size === "medium"
            ? "min-h-[250px]"
            : "min-h-[200px]"
        }
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Background Pattern/Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div
          className={`flex ${layout === "compact" ? "flex-col" : "flex-col lg:flex-row"
            } items-center justify-between w-full h-full`}
        >
          {/* Content Section */}
          <div
            className={`${layout === "compact"
              ? "w-full text-center mb-4"
              : "flex-1 mb-6 lg:mb-0 lg:pr-8"
              }`}
          >
            {/* Subtitle/Badge */}
            {subtitle && (
              <div className="mb-2">
                <span className="inline-block bg-black bg-opacity-20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                  {subtitle}
                </span>
              </div>
            )}

            {/* Title */}
            <h2
              className={`
              ${textColor} font-bold mb-3 leading-tight
              ${size === "large"
                  ? "text-2xl lg:text-4xl"
                  : size === "medium"
                    ? "text-xl lg:text-3xl"
                    : "text-lg lg:text-2xl"
                }
            `}
            >
              {title}
            </h2>

            {/* Description */}
            {description && (
              <p
                className={`${textColor} opacity-80 mb-4 text-sm lg:text-base`}
              >
                {description}
              </p>
            )}

            {/* Price Section */}
            {(price || discount) && (
              <div className="mb-6">
                {discount && (
                  <div className="mb-2">
                    <span className={`text-sm ${textColor} opacity-80`}>
                      Discount
                    </span>
                    <div className="text-3xl lg:text-5xl font-bold text-red-600 mt-1">
                      {discount}
                    </div>
                  </div>
                )}

                {price && (
                  <div className="mb-2">
                    <span className={`text-sm ${textColor} opacity-80`}>
                      Price Just
                    </span>
                    <div className="flex items-center space-x-3 mt-1">
                      <span className="text-2xl lg:text-3xl font-bold text-green-600">
                        {price}
                      </span>
                      {originalPrice && (
                        <span
                          className={`text-lg ${textColor} opacity-60 line-through`}
                        >
                          {originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleButtonClick}
              className="group/btn bg-yellow-500 hover:bg-yellow-600 text-black px-6 lg:px-8 py-3 rounded-lg font-bold text-sm lg:text-lg transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
            >
              <span>{buttonText}</span>
              <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 group-hover/btn:translate-x-1 transition-transform duration-200" />
            </button>
          </div>

          {/* Image Section */}
          {image && (
            <div
              className={`
              ${layout === "compact" ? "w-full" : "w-full lg:w-auto"}
              flex justify-center lg:justify-end
            `}
            >
              <div
                className={`
                relative
                ${size === "large"
                    ? "w-64 h-48 lg:w-80 lg:h-64"
                    : size === "medium"
                      ? "w-56 h-40 lg:w-64 lg:h-48"
                      : "w-48 h-32 lg:w-56 lg:h-40"
                  }
              `}
              >
                {!imageLoaded && (
                  <div className="w-full h-full bg-white bg-opacity-20 rounded-xl animate-pulse" />
                )}

                <img
                  src={image}
                  alt={imageAlt || title}
                  className={`
                    w-full h-full object-cover rounded-xl shadow-lg
                    group-hover:scale-105 transition-transform duration-300
                    ${imageLoaded ? "opacity-100" : "opacity-0"}
                  `}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />

                {/* Play Button Overlay (for video content) */}
                {subtitle === "LIMITED EDITION" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
                      <Play className="h-6 w-6 text-gray-800 ml-1" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Modern CSS-only Slider Component
const BannerSlider: React.FC<BannerSliderProps> = ({
  children,
  className = "",
  autoplay = true,
  autoplayInterval = 4000,
  showNavigation = true,
  showPagination = true,
  slidesToShow = 1,
  spaceBetween = 0,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [isPaused, setIsPaused] = useState(false);

  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (!isPlaying || isPaused) return;

    const interval = setInterval(nextSlide, autoplayInterval);
    return () => clearInterval(interval);
  }, [isPlaying, isPaused, nextSlide, autoplayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide]);

  const togglePlayPause = () => {
    setIsPaused(prev => !prev);
  };

  return (
    <div
      className={`relative group  ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slider Container */}
      <div style={{ overflow: "hidden" }} className="relative overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
            gap: spaceBetween > 0 ? `${spaceBetween}px` : undefined
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `${100 / slidesToShow}%` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showNavigation && totalSlides > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-6 w-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 opacity-0 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight className="h-6 w-6 text-gray-700" />
          </button>
        </>
      )}

      {/* Play/Pause Button */}
      {autoplay && (
        <button
          onClick={togglePlayPause}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? (
            <Play className="h-5 w-5 text-white ml-0.5" />
          ) : (
            <Pause className="h-5 w-5 text-white" />
          )}
        </button>
      )}

      {/* Pagination Dots */}
      {showPagination && totalSlides > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentSlide
                ? 'bg-yellow-500 w-6'
                : 'bg-white/60 hover:bg-white/80'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Slide Counter */}
      <div className="absolute bottom-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

// Multi-slide Slider for smaller items
const MultiSlider: React.FC<BannerSliderProps> = ({
  children,
  className = "",
  autoplay = false,
  autoplayInterval = 3000,
  showNavigation = true,
  showPagination = false,
  slidesToShow = 3,
  spaceBetween = 24,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);

  const slides = React.Children.toArray(children);
  const totalSlides = slides.length;
  const maxSlide = Math.max(0, totalSlides - slidesToShow);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, maxSlide));
  }, [maxSlide]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => {
        if (prev >= maxSlide) return 0;
        return prev + 1;
      });
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [isPlaying, maxSlide, autoplayInterval]);

  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < maxSlide;

  return (
    <div className={`relative group ${className}`}>
      {/* Slider Container */}
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{
            transform: `translateX(-${currentSlide * (100 / slidesToShow)}%)`,
            gap: `${spaceBetween}px`
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `calc(${100 / slidesToShow}% - ${spaceBetween * (slidesToShow - 1) / slidesToShow}px)` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showNavigation && totalSlides > slidesToShow && (
        <>
          <button
            onClick={prevSlide}
            disabled={!canGoPrev}
            className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${canGoPrev
              ? 'hover:scale-110 opacity-0 group-hover:opacity-100'
              : 'opacity-30 cursor-not-allowed'
              }`}
            aria-label="Previous slides"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            disabled={!canGoNext}
            className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center transition-all duration-200 ${canGoNext
              ? 'hover:scale-110 opacity-0 group-hover:opacity-100'
              : 'opacity-30 cursor-not-allowed'
              }`}
            aria-label="Next slides"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </>
      )}

      {/* Progress Bar */}
      {totalSlides > slidesToShow && (
        <div className="mt-4 w-full bg-gray-200 rounded-full h-1">
          <div
            className="bg-yellow-500 h-1 rounded-full transition-all duration-300"
            style={{ width: `${((currentSlide + slidesToShow) / totalSlides) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Compact Banner (for smaller promotional areas)
const CompactBanner: React.FC<CompactBannerProps> = ({
  title,
  price,
  originalPrice,
  image,
  bgGradient = "from-blue-50 via-indigo-50 to-blue-100",
  onClick,
  className = "",
}) => {
  return (
    <FeaturedBanner
      title={title}
      price={price}
      originalPrice={originalPrice}
      image={image}
      bgGradient={bgGradient}
      layout="compact"
      size="medium"
      onClick={onClick}
      className={className}
    />
  );
};

// Minimal Banner (for simple promotions)
const MinimalBanner: React.FC<MinimalBannerProps> = ({
  title,
  subtitle,
  buttonText = "Learn More",
  bgGradient = "from-gray-100 via-gray-50 to-slate-100",
  onClick,
  className = "",
}) => {
  const handleClick = (): void => {
    onClick?.();
  };

  return (
    <div
      className={`
        bg-gradient-to-r ${bgGradient} rounded-xl p-6 text-gray-800 border border-gray-200
        cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105
        ${className}
      `}
      onClick={handleClick}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {subtitle && <p className="text-sm opacity-70 mb-4">{subtitle}</p>}
      <button className="bg-gray-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200">
        {buttonText}
      </button>
    </div>
  );
};

// Banner Grid Container
const BannerGrid: React.FC<BannerGridProps> = ({ children, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${className}`}>
      {children}
    </div>
  );
};

// Main component with slider configurations
const FeaturedBanners: React.FC = () => {
  const handleBannerClick = (id?: string): void => {
    console.log("Banner clicked:", id);
  };

  // Sample banner data
  const heroSlides = [
    {
      id: "vr-headset",
      title: "Experience Virtual Reality Now! Version 2",
      subtitle: "LIMITED EDITION",
      discount: "40% OFF",
      description: "Immerse yourself in stunning virtual worlds with cutting-edge VR technology",
      buttonText: "Shop Now",
      image: "https://picsum.photos/600/400?random=1",
      imageAlt: "VR Headset",
      bgGradient: "from-amber-50 via-orange-50 to-yellow-100",
    },
    {
      id: "gaming-laptop",
      title: "Ultimate Gaming Performance",
      subtitle: "NEW ARRIVAL",
      discount: "25% OFF",
      description: "Powerful gaming laptops for the ultimate gaming experience",
      buttonText: "Shop Now",
      image: "https://picsum.photos/600/400?random=2",
      imageAlt: "Gaming Laptop",
      bgGradient: "from-blue-50 via-indigo-50 to-purple-100",
    },
    {
      id: "smartphone",
      title: "Latest Smartphone Technology",
      subtitle: "BEST SELLER",
      discount: "30% OFF",
      description: "Stay connected with the latest smartphone innovations",
      buttonText: "Shop Now",
      image: "https://picsum.photos/600/400?random=3",
      imageAlt: "Smartphone",
      bgGradient: "from-green-50 via-emerald-50 to-teal-100",
    },
  ];

  const mediumBanners = [
    {
      id: "speaker",
      title: "Fluence Minimal Speaker",
      price: "$159.99",
      originalPrice: "$199.99",
      image: "https://picsum.photos/400/300?random=4",
      imageAlt: "Minimal Speaker",
      bgGradient: "from-yellow-50 via-amber-50 to-orange-100",
    },
    {
      id: "headphones",
      title: "Premium Headphones",
      price: "$299.00",
      originalPrice: "$399.00",
      image: "https://picsum.photos/400/300?random=5",
      imageAlt: "Premium Headphones",
      bgGradient: "from-purple-50 via-pink-50 to-rose-100",
    },
    {
      id: "smartwatch",
      title: "Smart Fitness Watch",
      price: "$199.00",
      originalPrice: "$249.00",
      image: "https://picsum.photos/400/300?random=6",
      imageAlt: "Smartwatch",
      bgGradient: "from-blue-50 via-cyan-50 to-teal-100",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Banner Slider */}
      <BannerSlider
        autoplay={true}
        autoplayInterval={5000}
        showNavigation={true}
        showPagination={true}
        className="mb-8"
      >
        {heroSlides.map((banner) => (
          <FeaturedBanner
            key={banner.id}
            {...banner}
            size="large"
            onClick={handleBannerClick}
            className="min-h-[400px]"
          />
        ))}
      </BannerSlider>

      {/* Medium Banners Multi-Slider */}
      <MultiSlider
        slidesToShow={2}
        spaceBetween={24}
        autoplay={true}
        autoplayInterval={4000}
        showNavigation={true}
        showPagination={false}
        className="mb-8"
      >
        {mediumBanners.map((banner) => (
          <FeaturedBanner
            key={banner.id}
            {...banner}
            size="medium"
            onClick={handleBannerClick}
          />
        ))}
      </MultiSlider>

      {/* Minimal Banners Multi-Slider */}
      <MultiSlider
        slidesToShow={3}
        spaceBetween={20}
        autoplay={false}
        showNavigation={true}
        showPagination={false}
      >
        <MinimalBanner
          title="Summer Sale"
          subtitle="Up to 70% off on selected items"
          buttonText="Shop Now"
          bgGradient="from-purple-50 via-pink-50 to-rose-100"
          onClick={() => handleBannerClick("summer-sale")}
        />
        <MinimalBanner
          title="New Arrivals"
          subtitle="Check out our latest products"
          buttonText="Explore"
          bgGradient="from-blue-50 via-indigo-50 to-slate-100"
          onClick={() => handleBannerClick("new-arrivals")}
        />
        <MinimalBanner
          title="Free Shipping"
          subtitle="On orders over $50"
          buttonText="Learn More"
          bgGradient="from-green-50 via-emerald-50 to-teal-100"
          onClick={() => handleBannerClick("free-shipping")}
        />
        <MinimalBanner
          title="24/7 Support"
          subtitle="We're here to help you"
          buttonText="Contact Us"
          bgGradient="from-orange-50 via-yellow-50 to-amber-100"
          onClick={() => handleBannerClick("support")}
        />
        <MinimalBanner
          title="Exclusive Deals"
          subtitle="Member-only special discounts"
          buttonText="Join Now"
          bgGradient="from-indigo-50 via-purple-50 to-pink-100"
          onClick={() => handleBannerClick("exclusive")}
        />
      </MultiSlider>
    </div>
  );
};

export default FeaturedBanner;
export {
  FeaturedBanner,
  CompactBanner,
  MinimalBanner,
  BannerGrid,
  BannerSlider,
  MultiSlider,
  FeaturedBanners,
};
export type {
  FeaturedBannerProps,
  CompactBannerProps,
  MinimalBannerProps,
  BannerGridProps,
  BannerSliderProps,
};