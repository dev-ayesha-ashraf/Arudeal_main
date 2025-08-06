import React, { useState, useEffect, useRef } from 'react';
import { LoadingScreen } from '@/components/LoadingScreen'
import ProductCard from '@/components/products/card/card';
import { HeroSlider } from '@/components/HeroSlider';
import { CategorySidebar } from '@/components/CategorySidebar';
import { PromoCard } from '@/components/PromoCard';
import { useListingSections } from '@/hooks/useListingSection';
import { useProducts } from '@/hooks/useProducts';
import { BannerService } from '@/services/banner.service';
import { ListingSectionCard } from '../listingsCard/ListingSectionCard';
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

    const {
        featuredProducts,
        loading: productsLoading,
        error: productsError,
        refreshProducts,
        addToFavorites,
        isRefreshing
    } = useProducts(6);

    console.log("these are featured products")
    console.log(featuredProducts)

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
                    filters: { isActive: true }
                }),
                BannerService.getCategories({
                    forceRefresh,
                    includeProductCount: true,
                    sortBy: "popularity"
                })
            ]);

            console.log(slidesData)
            const processedSlides: any[] = slidesData.map((slide: any) => ({
                ...slide,
                bgGradient: slide.bgGradient || getDefaultGradient(slide.bannerType || 'hero')
            }));

            const heroSlides: any[] = processedSlides.filter((slide: any) =>
                slide.bannerType === 'hero'
            );

            const promoSlides: any[] = processedSlides.filter((slide: any) =>
                slide.bannerType === 'promotional'
            );

            setHeroSlides(heroSlides);
            setPromoSlides(promoSlides);
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

            // Simulate initial loading screen
            setTimeout(() => {
                setInitialLoading(false);
            }, 1000);
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (heroSlides.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [heroSlides.length]);

    // Banner navigation functions
    const goToSlide = (index: number): void => {
        setCurrentSlide(index);
    };

    const nextSlide = (): void => {
        setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    };

    const prevSlide = (): void => {
        setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length);
    };

    // Refresh banners
    const refreshBanners = async (): Promise<void> => {
        await loadBannersAndCategories(true);
    };
    const isLoading: boolean = initialLoading || (productsLoading && bannersLoading);
    const hasError: boolean = !!(productsError || bannersError);
    const hasData: boolean = heroSlides.length > 0 || categories.length > 0;

    // Handle adding products to favorites
    const handleAddToFavorites = async (productId: number): Promise<void> => {
        try {
            await addToFavorites(productId);
            console.log('Added to favorites successfully!');
        } catch (error: any) {
            console.error('Failed to add to favorites:', error);
        }
    };

    // Handle product card click - opens link in new tab
    const handleProductClick = (productId: string, linkUrl?: string): void => {
        if (linkUrl) {
            window.open(linkUrl, '_blank', 'noopener,noreferrer');
        } else {
            console.log('No link available for product:', productId);
        }
    };

    // Handle buy now - opens link in new tab
    const handleBuyNow = (productId: string, linkUrl?: string): void => {
        if (linkUrl) {
            window.open(linkUrl, '_blank', 'noopener,noreferrer');
        } else {
            console.log('No purchase link available for product:', productId);
        }
    };

    // Handle banner click tracking
    const handleBannerClick = async (bannerId: string): Promise<void> => {
        try {
            await BannerService.trackBannerClick(bannerId, {
                source: 'hero-slider',
                timestamp: Date.now(),
            });
        } catch (error: any) {
            console.error('Failed to track banner click:', error);
        }
    };

    // Handle promo card click tracking
    const handlePromoClick = async (bannerId: string): Promise<void> => {
        try {
            await BannerService.trackBannerClick(bannerId, {
                source: 'promo-card',
                timestamp: Date.now(),
            });
        } catch (error: any) {
            console.error('Failed to track promo click:', error);
        }
    };

    // Handle banner impression tracking
    useEffect(() => {
        if (heroSlides.length > 0 && currentSlide < heroSlides.length) {
            const currentBanner: any = heroSlides[currentSlide];
            BannerService.trackBannerImpression(currentBanner.id, {
                source: 'hero-slider',
                position: currentSlide,
                timestamp: Date.now(),
            }).catch((error: any) => {
                console.error('Failed to track banner impression:', error);
            });
        }
    }, [currentSlide, heroSlides]);

    // Handle refresh all data
    const handleRefreshAll = async (): Promise<void> => {
        try {
            await Promise.all([
                refreshProducts(),
                refreshBanners(),
            ]);
        } catch (error: any) {
            console.error('Failed to refresh data:', error);
        }
    };

    // Get promo card data - no fallback, only show if promotional banners exist
    const getPromoCardData = (): any | null => {
        if (promoSlides.length > 0) {
            const promoSlide: any = promoSlides[0];
            return {
                id: promoSlide.id,
                title: promoSlide.title,
                price: promoSlide.discount || "Special Price",
                badge: promoSlide.subtitle || "Special Offer",
                image: promoSlide.image,
                bgGradient: promoSlide.bgGradient,
                link: promoSlide.link
            };
        }
        return null;
    };
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= 1000);
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1000);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const {
        listingSections,
        loading: listingsLoading,
        error: listingsError,
    } = useListingSections();

    // Flatten all listings
    const allListings = listingSections.flatMap(section => section.listings);

    // Separate layout for large screens
    const sidebarListing = !isMobile ? allListings[0] : null;
    const fpListing = !isMobile ? allListings[1] : null;
    const swiperListings = !isMobile ? allListings.slice(2) : allListings;

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (hasError && !hasData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="mb-4">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Unable to Load Content
                    </h2>
                    <p className="text-gray-600 mb-6">
                        {productsError || bannersError || 'Something went wrong while loading the page.'}
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleRefreshAll}
                            disabled={isRefreshing}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-yellow-300 text-black px-6 py-3 rounded-lg font-medium transition-colors duration-200 disabled:cursor-not-allowed"
                        >
                            {isRefreshing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Retrying...
                                </span>
                            ) : (
                                'Try Again'
                            )}
                        </button>
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const promoData: any | null = getPromoCardData();
    console.log(promoData, 'promoData');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Error Banner (if partial data loaded) */}
            {hasError && hasData && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <div className="flex items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    Some content couldn't be loaded. {productsError || bannersError}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleRefreshAll}
                            className="text-yellow-700 hover:text-yellow-800 text-sm font-medium"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex gap-6">
                    <div>
                        {/* Sidebar */}
                        <CategorySidebar
                            loading={bannersLoading}
                        />
                        {sidebarListing && (
                            <div className="mt-4">
                                <ListingSectionCard
                                    id={sidebarListing._id}
                                    title={sidebarListing.title}
                                    description={sidebarListing.description}
                                    price={sidebarListing.price}
                                    image={sidebarListing.image}
                                    onClick={handleProductClick}
                                />
                            </div>
                        )}


                    </div>
                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
                            {/* Left Column - Banners */}
                            <div className="lg:col-span-3 space-y-4">
                                {/* Hero Banner Slider - Only shows HERO type banners */}
                                {heroSlides.length > 0 ? (
                                    <HeroSlider
                                        slides={heroSlides}
                                        currentSlide={currentSlide}
                                        onSlideChange={goToSlide}
                                        onNext={nextSlide}
                                        onPrevious={prevSlide}
                                        onSlideClick={handleBannerClick}
                                        loading={bannersLoading}
                                    />
                                ) : (
                                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Hero Banners Available</h3>
                                            <p className="text-gray-500 text-sm">Check back later for featured content</p>
                                        </div>
                                    </div>
                                )}

                                {/* Promotional Card - Only shows if promotional banners exist */}
                                {promoData && (
                                    <PromoCard
                                        title={promoData.title}
                                        price={promoData.price}
                                        badge={promoData.badge}
                                        image={promoData.image}
                                        bgGradient={promoData.bgGradient}
                                        link={promoData.link}
                                        loading={bannersLoading && promoSlides.length === 0}
                                        onClick={() => handlePromoClick(promoData.id)}
                                    />
                                )}
                            </div>

                            {/* Right Column - Product Cards 2x3 Grid */}
                            <div className="lg:col-span-2">
                                <div className="mb-4 flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-gray-900">Featured Products</h3>
                                    <button
                                        onClick={refreshProducts}
                                        disabled={isRefreshing}
                                        className="text-sm text-yellow-600 hover:text-yellow-700 disabled:text-yellow-400 transition-colors"
                                    >
                                        {isRefreshing ? 'Refreshing...' : 'Refresh'}
                                    </button>
                                </div>
                                {productsLoading && featuredProducts.length === 0 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        {Array.from({ length: 6 }).map((_, index) => (
                                            <div key={index} className="bg-white rounded-3xl p-4 shadow-sm animate-pulse">
                                                <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
                                                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : featuredProducts.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-4 h-fit">
                                        {featuredProducts.map((product: any) => (
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
                                        ))}
                                        {fpListing && (
                                            <div className="mt-6">
                                                <ListingSectionCard
                                                    id={fpListing._id}
                                                    title={fpListing.title}
                                                    description={fpListing.description}
                                                    price={fpListing.price}
                                                    image={fpListing.image}
                                                    onClick={handleProductClick}

                                                />
                                            </div>
                                        )}

                                    </div>
                                ) : (
                                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                                        <div className="text-center">
                                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Featured Products Available</h3>
                                            <p className="text-gray-500 text-sm">Check back later for featured products</p>
                                        </div>
                                    </div>
                                )}

                                {productsError && featuredProducts.length === 0 && (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 mb-4">Failed to load featured products</p>
                                        <button
                                            onClick={refreshProducts}
                                            className="text-yellow-600 hover:text-yellow-700 text-sm font-medium"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                )}
                            </div>
                            {swiperListings.length > 0 && (
                                <div className="lg:w-[70vw] w-auto">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">More Listings</h3>

                                    <div className="relative">
                                        <button
                                            onClick={() => swiperRef.current?.slidePrev()}
                                            className="absolute ml-[-5%] top-1/2 z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <Swiper
                                            modules={[Navigation, Autoplay]}
                                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                                            spaceBetween={20}
                                            breakpoints={{
                                                0: {
                                                    slidesPerView: 1,
                                                },
                                                400: {
                                                    slidesPerView: 1.5,
                                                },
                                                640: {
                                                    slidesPerView: 2,
                                                },
                                                768: {
                                                    slidesPerView: 2.5,
                                                },
                                                1024: {
                                                    slidesPerView: 3,
                                                },
                                                1280: {
                                                    slidesPerView: 3.5,
                                                },
                                            }}

                                            autoplay={{ delay: 3000, disableOnInteraction: false }}
                                            loop={true}
                                            className="h-[400px] custom-swiper"
                                        >
                                            {swiperListings.map((listing) => (
                                                <SwiperSlide key={listing._id}>
                                                    <div className="h-full">
                                                        <ListingSectionCard
                                                            id={listing._id}
                                                            title={listing.title}
                                                            description={listing.description}
                                                            price={listing.price}
                                                            image={listing.image}
                                                            onClick={handleProductClick}
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <button
                                            onClick={() => swiperRef.current?.slideNext()}
                                            className="absolute right-0 mr-[-1%] top-1/2 z-10 transform -translate-y-1/2 bg-white rounded-full p-2 shadow hover:bg-gray-100"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>


                                </div>
                            )}


                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainContent;