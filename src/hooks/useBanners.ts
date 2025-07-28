// hooks/useBanners.ts (refactored to use React Query)
import { useState, useCallback, useEffect } from "react";
import { useBannerDataQuery } from "./queries/useBannersQuery";

export const useBanners = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const bannerQuery = useBannerDataQuery();

  const { heroSlides, categories, isLoading, error, refetch } = bannerQuery;

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  }, [heroSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  }, [heroSlides.length]);

  // Auto-slide functionality
  useEffect(() => {
    if (heroSlides.length === 0) return;

    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(slideInterval);
  }, [heroSlides.length]);

  // Reset current slide when heroSlides change
  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0);
    }
  }, [heroSlides.length, currentSlide]);

  return {
    heroSlides,
    categories,
    currentSlide,
    loading: isLoading,
    error: error?.message || null,
    goToSlide,
    nextSlide,
    prevSlide,
    refreshBanners: refetch,
  };
};
