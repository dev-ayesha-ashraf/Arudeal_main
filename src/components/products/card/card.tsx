import { useState } from "react";
import { Heart, Star, ShoppingCart, Eye, Share2 } from "lucide-react";

interface ProductCardProps {
  id: string;
  name?: string;
  price?: string | number;
  originalPrice?: string | number;
  discount?: string;
  image?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  onClick?: (id: string) => void;
  onBuyNow?: (id: string) => void;
  className?: string;
}

const LargeProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  originalPrice,
  discount,
  image,
  rating = 0,
  reviews = 0,
  badge,
  onClick,
  onBuyNow,
  className = "",
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Quick view product:", id);
  };

  const handleBuyNowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBuyNow?.(id);
  };

  // Helper function to check if price is valid (not zero, null, undefined, or empty)
  const isValidPrice = (priceValue?: string | number): boolean => {
    if (!priceValue) return false;
    if (typeof priceValue === 'number') return priceValue > 0;
    if (typeof priceValue === 'string') {
      const numericValue = parseFloat(priceValue.replace(/[^0-9.-]+/g, ''));
      return !isNaN(numericValue) && numericValue > 0;
    }
    return false;
  };

  const hasValidPrice = isValidPrice(price);
  const hasValidOriginalPrice = isValidPrice(originalPrice);

  const renderStars = () => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`h-3 w-3 sm:h-4 sm:w-4 ${index < Math.floor(rating)
          ? "text-yellow-400 fill-current"
          : "text-gray-300"
          }`}
      />
    ));
  };

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm hover:shadow-lg 
        transition-all duration-300 cursor-pointer group overflow-hidden
        border border-gray-100
        w-full max-w-sm mx-auto sm:max-w-none
        ${className}
      `}
      onClick={() => onClick?.(id)}
    >
      <div className="relative overflow-hidden">
        <div className="w-full h-40 sm:h-32 md:h-36 lg:h-32 bg-gray-100">
          {!imageLoaded && (
            <div className="w-full h-full bg-gray-200 animate-pulse" />
          )}
          {image && (
            <img
              src={image}
              alt={name || 'Product image'}
              className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageLoaded(true)}
            />
          )}
        </div>

        {(discount || badge) && (
          <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 flex flex-col space-y-1">
            {discount && (
              <span className="bg-red-500 text-white px-1 py-0.5 sm:px-1.5 rounded text-xs font-bold">
                {discount} OFF
              </span>
            )}
            {badge && (
              <span className="bg-green-500 text-white px-1 py-0.5 sm:px-1.5 rounded text-xs font-bold">
                {badge}
              </span>
            )}
          </div>
        )}

        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex">
          <button
            onClick={handleWishlistClick}
            className="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-3 w-3 transition-colors duration-200 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                }`}
            />
          </button>

          <button
            onClick={handleQuickView}
            className="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Quick view"
          >
            <Eye className="h-3 w-3 text-gray-600" />
          </button>

          <button
            onClick={handleQuickView}
            className="p-1.5 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Share"
          >
            <Share2 className="h-3 w-3 text-gray-600" />
          </button>
        </div>

        <div className="absolute top-1.5 right-1.5 flex space-x-1 sm:hidden">
          <button
            onClick={handleWishlistClick}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-3 w-3 transition-colors duration-200 ${isWishlisted ? "text-red-500 fill-current" : "text-gray-600"
                }`}
            />
          </button>
        </div>

        {onBuyNow && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-2 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 hidden sm:block">
            <button
              onClick={handleBuyNowClick}
              className="w-full flex items-center justify-center space-x-2 bg-yellow-400 hover:bg-yellow-500 text-black py-1.5 rounded-lg font-medium text-sm transition-colors duration-200"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Buy Now</span>
            </button>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-3">
        {name && (
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 sm:line-clamp-1 text-sm sm:text-base group-hover:text-gray-700 transition-colors duration-200">
            {name}
          </h3>
        )}

        {rating > 0 && (
          <div className="flex items-center mb-2 sm:mb-1">
            <div className="flex items-center">{renderStars()}</div>
            <span className="text-xs sm:text-xs text-gray-500 ml-1">
              ({rating}){reviews > 0 && ` • ${reviews}`}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between">
          {(hasValidPrice || hasValidOriginalPrice) && (
            <div className="flex items-center space-x-1 sm:space-x-2">
              {hasValidPrice && (
                <span className="text-base sm:text-sm font-bold text-gray-900">
                  {price}
                </span>
              )}
              {hasValidOriginalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          )}

          <div className="flex space-x-1 sm:hidden">
            <button
              onClick={handleQuickView}
              className="p-1.5 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              aria-label="Quick view"
            >
              <Eye className="h-4 w-4" />
            </button>
            {onBuyNow && (
              <button
                onClick={handleBuyNowClick}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 flex items-center space-x-1"
              >
                <ShoppingCart className="h-3 w-3" />
                <span>Buy</span>
              </button>
            )}
          </div>

          {onBuyNow && (
            <button
              onClick={handleBuyNowClick}
              className="hidden sm:block lg:hidden bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs font-medium transition-colors duration-200"
            >
              Buy
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface ProductCardVariantProps extends ProductCardProps {
  variant?: "large";
}

const ProductCard: React.FC<ProductCardVariantProps> = ({
  variant = "large",
  ...props
}) => {
  return <LargeProductCard {...props} />;
};

export default ProductCard;
export { LargeProductCard };