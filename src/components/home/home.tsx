import React, { useState, useEffect, useRef } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen';
import ProductCard from '@/components/products/card/card';
import { HeroSlider } from '@/components/HeroSlider';
import { PromoCard } from '@/components/PromoCard';
import { useListingSections } from '@/hooks/useListingSection';
import { useProducts } from '@/hooks/useProducts';
import { BannerService } from '@/services/banner.service';
import { ListingSectionCard } from '../listingsCard/ListingSectionCard';
import { CategoryCards } from '../CategoryCardsr';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const MainContent: React.FC = () => {
  const swiperRef = useRef<any>(null);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Banner state
  const [heroSlides, setHeroSlides] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [promoSlides, setPromoSlides] = useState<any[]>([]);
  const [bannersLoading, setBannersLoading] = useState<boolean>(true);
  const [bannersError, setBannersError] = useState<string | null>(null);

  const { featuredProducts, loading: productsLoading, refreshProducts, isRefreshing } = useProducts(6);
  const { listingSections } = useListingSections();

  const getDefaultGradient = (bannerType: string): string => {
    switch (bannerType) {
      case 'hero':
        return 'from-blue-100 via-indigo-100 to-purple-200';
      case 'promotional':
        return 'from-green-100 via-emerald-100 to-teal-200';
      default:
        return 'from-gray-100 via-gray-100 to-gray-200';
    }
  };

  const loadBannersAndCategories = async (forceRefresh: boolean = false): Promise<void> => {
    setBannersLoading(true);
    setBannersError(null);
    try {
      const [slidesData, categoriesData]: [any[], any[]] = await Promise.all([
        BannerService.getHeroSlides({
          forceRefresh,
          includeInactive: false,
          filters: { isActive: true },
        }),
        BannerService.getCategories({
          forceRefresh,
          includeProductCount: true,
          sortBy: 'popularity',
        }),
      ]);

      const processedSlides: any[] = slidesData.map((slide: any) => ({
        ...slide,
        bgGradient: slide.bgGradient || getDefaultGradient(slide.bannerType || 'hero'),
      }));

      setHeroSlides(processedSlides.filter((s) => s.bannerType === 'hero'));
      setPromoSlides(processedSlides.filter((s) => s.bannerType === 'promotional'));
      setCategories(categoriesData);
    } catch (error: any) {
      console.error('Failed to load banners and categories:', error);
      setBannersError(error instanceof Error ? error.message : 'Failed to load content');
    } finally {
      setBannersLoading(false);
    }
  };

  // Initial data loading
  useEffect(() => {
    const loadInitialData = async (): Promise<void> => {
      await loadBannersAndCategories();
      setTimeout(() => setInitialLoading(false), 1000);
    };
    loadInitialData();
  }, []);

  // Hero auto slide
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const refreshBanners = async (): Promise<void> => {
    await loadBannersAndCategories(true);
  };

  const handleProductClick = (productId: string, linkUrl?: string): void => {
    if (linkUrl) window.open(linkUrl, '_blank', 'noopener,noreferrer');
    else console.log('Navigate to single listing page:', productId);
  };

  const handleBuyNow = (productId: string, linkUrl?: string): void => {
    if (linkUrl) window.open(linkUrl, '_blank', 'noopener,noreferrer');
    else console.log('No purchase link available for product:', productId);
  };

  // Responsive
  const [isMobile, setIsMobile] = useState<boolean>(typeof window !== 'undefined' ? window.innerWidth <= 1000 : false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1000);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const allListings = listingSections.flatMap((section) => section.listings);
  const isLoading: boolean = initialLoading || (productsLoading && bannersLoading);

  const promoData: any | null =
    promoSlides.length > 0
      ? {
          id: promoSlides[0].id,
          title: promoSlides[0].title,
          price: promoSlides[0].discount || 'Special Price',
          badge: promoSlides[0].subtitle || 'Special Offer',
          image: promoSlides[0].image,
          bgGradient: promoSlides[0].bgGradient,
          link: promoSlides[0].link,
        }
      : null;

  if (isLoading) return <LoadingScreen />;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <CategoryCards loading={bannersLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-6">
          <div className="lg:col-span-2 space-y-4">
            {heroSlides.length > 0 ? (
              <HeroSlider
                slides={heroSlides}
                currentSlide={currentSlide}
                onSlideChange={(i) => setCurrentSlide(i)}
                onNext={() => setCurrentSlide((p) => (p + 1) % heroSlides.length)}
                onPrevious={() => setCurrentSlide((p) => (p - 1 + heroSlides.length) % heroSlides.length)}
                onSlideClick={() => {}}
                loading={bannersLoading}
              />
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-sm text-center">No Hero Banners</div>
            )}

            {promoData && (
              <PromoCard
                title={promoData.title}
                price={promoData.price}
                badge={promoData.badge}
                image={promoData.image}
                bgGradient={promoData.bgGradient}
                link={promoData.link}
                loading={bannersLoading && promoSlides.length === 0}
                onClick={() => {}}
              />
            )}
          </div>

          {/* Right Column - Featured Products */}
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Featured Products</h3>
              <button
                onClick={refreshProducts}
                disabled={isRefreshing}
                className="text-sm text-yellow-600 hover:text-yellow-700 disabled:text-yellow-400"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...featuredProducts.slice(0, 4), ...Array(4 - featuredProducts.length).fill(null)].map(
                (product, idx) =>
                  product ? (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      discount={product.discount}
                      image={product.image_url}
                      rating={product.rating || 0}
                      reviews={product.reviews || 0}
                      badge={product.badge}
                      onClick={() => handleProductClick(product._id, product.link_url)}
                      onBuyNow={() => handleBuyNow(product._id, product.link_url)}
                    />
                  ) : (
                    <div
                      key={`placeholder-${idx}`}
                      className="bg-white rounded-3xl p-4 shadow-sm flex items-center justify-center text-gray-400"
                    >
                      Placeholder
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        {/* Listings Section - all together */}
        {allListings.length > 0 && (
          <div className="w-full max-w-[1200px] mx-auto px-4 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Listings</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allListings.map((listing) => (
                <ListingSectionCard
                  key={listing._id}
                  id={listing._id}
                  title={listing.title}
                  description={listing.description}
                  price={listing.price}
                  image={listing.image}
                  onClick={handleProductClick}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainContent;

