// hooks/queries/useBannersQuery.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerService } from "../../services/banner.service";
import type {
  HeroSlideWithMetrics,
  CategoryWithMetrics,
} from "../../services/banner.service";

// Query Keys Factory
export const bannerKeys = {
  all: ["banners"] as const,
  heroSlides: () => [...bannerKeys.all, "hero-slides"] as const,
  heroSlidesWithOptions: (options: any) =>
    [...bannerKeys.heroSlides(), options] as const,
  categories: () => [...bannerKeys.all, "categories"] as const,
  categoriesWithOptions: (options: any) =>
    [...bannerKeys.categories(), options] as const,
};

// Hero Slides Query
export const useHeroSlidesQuery = (options?: {
  forceRefresh?: boolean;
  includeInactive?: boolean;
  filters?: any;
}) => {
  return useQuery({
    queryKey: options
      ? bannerKeys.heroSlidesWithOptions(options)
      : bannerKeys.heroSlides(),
    queryFn: async (): Promise<HeroSlideWithMetrics[]> => {
      return await BannerService.getHeroSlides(options);
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Categories Query
export const useCategoriesQuery = (options?: {
  includeProductCount?: boolean;
  sortBy?: "name" | "popularity" | "productCount";
  forceRefresh?: boolean;
}) => {
  return useQuery({
    queryKey: options
      ? bannerKeys.categoriesWithOptions(options)
      : bannerKeys.categories(),
    queryFn: async (): Promise<CategoryWithMetrics[]> => {
      return await BannerService.getCategories(options);
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Combined Banner Data Query
export const useBannerDataQuery = () => {
  const heroSlidesQuery = useHeroSlidesQuery();
  const categoriesQuery = useCategoriesQuery();

  return {
    heroSlides: heroSlidesQuery.data || [],
    categories: categoriesQuery.data || [],
    isLoading: heroSlidesQuery.isLoading || categoriesQuery.isLoading,
    isError: heroSlidesQuery.isError || categoriesQuery.isError,
    error: heroSlidesQuery.error || categoriesQuery.error,
    refetch: async () => {
      await Promise.all([heroSlidesQuery.refetch(), categoriesQuery.refetch()]);
    },
  };
};

// Banner Click Tracking Mutation
export const useBannerClickMutation = () => {
  return useMutation({
    mutationFn: async ({
      bannerId,
      metadata,
    }: {
      bannerId: string;
      metadata?: Record<string, any>;
    }) => {
      return await BannerService.trackBannerClick(bannerId, metadata);
    },
    onError: (error) => {
      console.error("Failed to track banner click:", error);
    },
  });
};

// Banner Impression Tracking Mutation
export const useBannerImpressionMutation = () => {
  return useMutation({
    mutationFn: async ({
      bannerId,
      metadata,
    }: {
      bannerId: string;
      metadata?: Record<string, any>;
    }) => {
      return await BannerService.trackBannerImpression(bannerId, metadata);
    },
    onError: (error) => {
      console.error("Failed to track banner impression:", error);
    },
  });
};

// Update Banner Order Mutation
export const useUpdateBannerOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bannerOrder: { id: string; position: number }[]) => {
      return await BannerService.updateBannerOrder(bannerOrder);
    },
    onSuccess: () => {
      // Invalidate all hero slides queries
      queryClient.invalidateQueries({
        queryKey: bannerKeys.all,
      });
    },
    onError: (error) => {
      console.error("Failed to update banner order:", error);
    },
  });
};

// Create Hero Slide Mutation
export const useCreateHeroSlideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slideData: Omit<HeroSlideWithMetrics, "id">) => {
      return await BannerService.createHeroSlide(slideData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.heroSlides(),
      });
    },
  });
};

// Update Hero Slide Mutation
export const useUpdateHeroSlideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      slideId,
      slideData,
    }: {
      slideId: string;
      slideData: Partial<HeroSlideWithMetrics>;
    }) => {
      return await BannerService.updateHeroSlide(slideId, slideData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.heroSlides(),
      });
    },
  });
};

// Delete Hero Slide Mutation
export const useDeleteHeroSlideMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (slideId: string) => {
      return await BannerService.deleteHeroSlide(slideId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bannerKeys.heroSlides(),
      });
    },
  });
};
