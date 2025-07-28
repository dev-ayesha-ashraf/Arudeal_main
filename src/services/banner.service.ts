import { apiService } from "./api.service";
// import { API_CONFIG } from "../config/api";
import { HeroSlide, Category, ApiResponse } from "../types";

interface BannerMetrics {
  id: string;
  impressions: number;
  clicks: number;
  clickThroughRate: number;
  conversionRate: number;
}

interface CategoryWithMetrics extends Category {
  productCount?: number;
  isPopular?: boolean;
  lastUpdated?: string;
}

interface HeroSlideWithMetrics extends HeroSlide {
  impressions?: number;
  clicks?: number;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
  targetAudience?: string[];
}

interface BannerFilters {
  isActive?: boolean;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export class BannerService {
  private static cache: Map<string, any> = new Map();
  private static cacheExpiry: Map<string, number> = new Map();
  private static readonly CACHE_DURATION = 30 * 60 * 1000;

  private static isCacheValid(key: string): boolean {
    const expiry = this.cacheExpiry.get(key);
    return expiry ? Date.now() < expiry : false;
  }

  private static setCache(key: string, data: any): void {
    this.cache.set(key, data);
    this.cacheExpiry.set(key, Date.now() + this.CACHE_DURATION);
  }

  static async getHeroSlides(options?: {
    forceRefresh?: boolean;
    includeInactive?: boolean;
    filters?: BannerFilters;
  }): Promise<HeroSlideWithMetrics[]> {
    const cacheKey = `hero-slides-${JSON.stringify(options || {})}`;

    try {
      if (!options?.forceRefresh && this?.isCacheValid(cacheKey)) {
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
          return cachedData;
        }
      }

      const params: Record<string, any> = {};

      if (options?.includeInactive !== undefined) {
        params.include_inactive = options.includeInactive;
      }

      if (options?.filters?.isActive !== undefined) {
        params.status = options.filters.isActive ? "active" : "inactive";
      }

      if (options?.forceRefresh) {
        params.timestamp = Date.now();
      }

      const response: ApiResponse<HeroSlideWithMetrics[]> =
        await apiService.get("/banners", params);

      let slides = response.data || [];

      const processedSlides = slides.map((slide: any, index: number) => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle || "",
        discount: slide.discount || "",
        image: slide.image || slide.image_url,
        bgGradient: slide.bgGradient || "",
        link: slide.link || slide.link_url || "",
        isActive: slide.isActive ?? slide.is_active ?? index === 0,
        impressions: slide.impressions || slide.impressionCount || 0,
        clicks: slide.clicks || slide.clickCount || 0,
        clickThroughRate: slide.clickThroughRate || 0,
        conversionRate: slide.conversionRate || 0,
        startDate: slide.startDate,
        endDate: slide.endDate,
        targetAudience: slide.targetAudience || [],
        createdAt: slide.createdAt,
        updatedAt: slide.updatedAt,
        bannerType: slide.bannerType || "hero",
        status: slide.status || "active",
        order: slide.order || index,
      }));

      this.setCache(cacheKey, processedSlides);
      return processedSlides;
    } catch (error) {
      console.error("Error fetching hero slides:", error);

      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        console.warn("Using cached hero slides due to API error");
        return cachedData;
      }

      throw error;
    }
  }

  static async getActiveHeroSlides(): Promise<HeroSlideWithMetrics[]> {
    try {
      const response: ApiResponse<HeroSlideWithMetrics[]> =
        await apiService.get("/banners/public/active");

      const slides = response.data || [];

      return slides.map((slide: any) => ({
        id: slide.id,
        title: slide.title,
        subtitle: slide.subtitle || "",
        discount: slide.discount || "",
        image: slide.image || slide.image_url,
        bgGradient: slide.bgGradient || "",
        link: slide.link || slide.link_url || "",
        isActive: true,
        impressions: slide.impressions || 0,
        clicks: slide.clicks || 0,
        clickThroughRate: slide.clickThroughRate || 0,
        conversionRate: slide.conversionRate || 0,
        startDate: slide.startDate,
        endDate: slide.endDate,
        targetAudience: slide.targetAudience || [],
      }));
    } catch (error) {
      console.error("Error fetching active hero slides:", error);
      throw error;
    }
  }

  static async getCategories(options?: {
    includeProductCount?: boolean;
    sortBy?: "name" | "popularity" | "productCount";
    forceRefresh?: boolean;
  }): Promise<CategoryWithMetrics[]> {
    const cacheKey = `categories-${JSON.stringify(options || {})}`;

    try {
      if (!options?.forceRefresh && this?.isCacheValid(cacheKey)) {
        const cachedData = this.cache.get(cacheKey);
        if (cachedData) {
          return cachedData;
        }
      }

      const params: Record<string, any> = {};

      if (options?.includeProductCount) {
        params.include_product_count = true;
      }

      if (options?.sortBy) {
        params.sort_by = options.sortBy;
      }

      const response: ApiResponse<CategoryWithMetrics[]> = await apiService.get(
        "/categories-enhanced",
        params
      );

      let categories = response.data || [];

      if (options?.sortBy) {
        categories = this.sortCategories(categories, options.sortBy);
      }

      this.setCache(cacheKey, categories);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);

      const cachedData = this.cache.get(cacheKey);
      if (cachedData) {
        console.warn("Using cached categories due to API error");
        return cachedData;
      }

      throw error;
    }
  }

  static async updateBannerOrder(
    bannerOrder: { id: string; position: number }[]
  ): Promise<{ success: boolean; message?: string }> {
    try {
      if (!bannerOrder || bannerOrder.length === 0) {
        throw new Error("Banner order data is required");
      }

      const isValidOrder = bannerOrder.every(
        (item) => item.id && typeof item.position === "number"
      );

      if (!isValidOrder) {
        throw new Error("Invalid banner order data format");
      }

      const response = await apiService.put("/banners/order", {
        bannerOrder,
        timestamp: Date.now(),
      });

      this.clearCacheByPattern("hero-slides");

      return {
        success: true,
        message: response.data?.message || "Banner order updated successfully",
        ...response.data,
      };
    } catch (error) {
      console.error("Error updating banner order:", error);
      throw new Error(
        error instanceof Error ? error.message : "Failed to update banner order"
      );
    }
  }

  static async createHeroSlide(
    slideData: Omit<HeroSlideWithMetrics, "id">
  ): Promise<{ success: boolean; slide?: HeroSlideWithMetrics }> {
    try {
      const backendData = {
        title: slideData.title,
        subtitle: slideData.subtitle,
        description: slideData.subtitle,
        discount: slideData.discount,
        image: slideData.image,
        link: slideData.link,
        bgGradient: slideData.bgGradient,
        isActive: slideData.isActive ?? true,
        bannerType: "hero",
        status: slideData.isActive ? "active" : "inactive",
        order: 0,
        startDate: slideData.startDate,
        endDate: slideData.endDate,
        targetAudience: slideData.targetAudience || [],
      };

      const response = await apiService.post("/banners", backendData);

      this.clearCacheByPattern("hero-slides");

      return {
        success: true,
        slide: response.data,
      };
    } catch (error) {
      console.error("Error creating hero slide:", error);
      throw new Error("Failed to create hero slide");
    }
  }

  static async updateHeroSlide(
    slideId: string,
    slideData: Partial<HeroSlideWithMetrics>
  ): Promise<{ success: boolean; slide?: HeroSlideWithMetrics }> {
    try {
      if (!slideId) {
        throw new Error("Slide ID is required");
      }

      const backendData: Record<string, any> = {};

      if (slideData.title !== undefined) backendData.title = slideData.title;
      if (slideData.subtitle !== undefined) {
        backendData.subtitle = slideData.subtitle;
        backendData.description = slideData.subtitle;
      }
      if (slideData.discount !== undefined)
        backendData.discount = slideData.discount;
      if (slideData.image !== undefined) backendData.image = slideData.image;
      if (slideData.link !== undefined) backendData.link = slideData.link;
      if (slideData.bgGradient !== undefined)
        backendData.bgGradient = slideData.bgGradient;
      if (slideData.isActive !== undefined) {
        backendData.isActive = slideData.isActive;
        backendData.status = slideData.isActive ? "active" : "inactive";
      }
      if (slideData.startDate !== undefined)
        backendData.startDate = slideData.startDate;
      if (slideData.endDate !== undefined)
        backendData.endDate = slideData.endDate;
      if (slideData.targetAudience !== undefined)
        backendData.targetAudience = slideData.targetAudience;

      const response = await apiService.put(`/banners/${slideId}`, backendData);

      this.clearCacheByPattern("hero-slides");

      return {
        success: true,
        slide: response.data,
      };
    } catch (error) {
      console.error(`Error updating hero slide ${slideId}:`, error);
      throw new Error("Failed to update hero slide");
    }
  }

  static async deleteHeroSlide(slideId: string): Promise<{ success: boolean }> {
    try {
      if (!slideId) {
        throw new Error("Slide ID is required");
      }

      const response = await apiService.delete(`/banners/${slideId}`);

      this.clearCacheByPattern("hero-slides");

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error(`Error deleting hero slide ${slideId}:`, error);
      throw new Error("Failed to delete hero slide");
    }
  }

  static async getBannerMetrics(
    bannerIds?: string[]
  ): Promise<BannerMetrics[]> {
    try {
      const params = bannerIds ? { bannerIds: bannerIds.join(",") } : {};

      const response: ApiResponse<BannerMetrics[]> = await apiService.get(
        "/banners/metrics",
        params
      );

      return response.data || [];
    } catch (error) {
      console.error("Error fetching banner metrics:", error);
      return [];
    }
  }

  static async trackBannerClick(
    bannerId: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean }> {
    try {
      if (!bannerId) {
        throw new Error("Banner ID is required");
      }

      const response = await apiService.post("/analytics/banner-click", {
        bannerId,
        timestamp: Date.now(),
        ...metadata,
      });

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error(`Error tracking banner click for ${bannerId}:`, error);
      return { success: false };
    }
  }

  static async trackBannerImpression(
    bannerId: string,
    metadata?: Record<string, any>
  ): Promise<{ success: boolean }> {
    try {
      if (!bannerId) {
        throw new Error("Banner ID is required");
      }

      const response = await apiService.post("/analytics/banner-impression", {
        bannerId,
        timestamp: Date.now(),
        ...metadata,
      });

      return {
        success: true,
        ...response.data,
      };
    } catch (error) {
      console.error(`Error tracking banner impression for ${bannerId}:`, error);
      return { success: false };
    }
  }

  static async getCategoryById(
    categoryId: number
  ): Promise<CategoryWithMetrics | null> {
    try {
      if (!categoryId || categoryId <= 0) {
        throw new Error("Valid category ID is required");
      }

      const response: ApiResponse<CategoryWithMetrics> = await apiService.get(
        `/categories-enhanced/${categoryId}`
      );

      return response.data || null;
    } catch (error) {
      console.error(`Error fetching category ${categoryId}:`, error);
      return null;
    }
  }

  static async createCategory(
    categoryData: Omit<Category, "id">
  ): Promise<{ success: boolean; category?: Category }> {
    try {
      const response = await apiService.post("/categories-enhanced", {
        ...categoryData,
        timestamp: Date.now(),
      });

      this.clearCacheByPattern("categories");

      return {
        success: true,
        category: response.data,
      };
    } catch (error) {
      console.error("Error creating category:", error);
      throw new Error("Failed to create category");
    }
  }

  static async updateCategory(
    categoryId: number,
    categoryData: Partial<Category>
  ): Promise<{ success: boolean; category?: Category }> {
    try {
      if (!categoryId || categoryId <= 0) {
        throw new Error("Valid category ID is required");
      }

      const response = await apiService.put(
        `/categories-enhanced/${categoryId}`,
        {
          ...categoryData,
          timestamp: Date.now(),
        }
      );

      this.clearCacheByPattern("categories");

      return {
        success: true,
        category: response.data,
      };
    } catch (error) {
      console.error(`Error updating category ${categoryId}:`, error);
      throw new Error("Failed to update category");
    }
  }

  private static sortCategories(
    categories: CategoryWithMetrics[],
    sortBy: "name" | "popularity" | "productCount"
  ): CategoryWithMetrics[] {
    return [...categories].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "popularity":
          return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
        case "productCount":
          return (b.productCount || 0) - (a.productCount || 0);
        default:
          return 0;
      }
    });
  }

  private static clearCacheByPattern(pattern: string): void {
    const keysToDelete = Array.from(this.cache.keys()).filter((key) =>
      key.includes(pattern)
    );

    keysToDelete.forEach((key) => {
      this.cache.delete(key);
      this.cacheExpiry.delete(key);
    });
  }

  static clearCache(): void {
    this.cache.clear();
    this.cacheExpiry.clear();
  }

  static getCacheInfo(): {
    size: number;
    keys: string[];
    validKeys: string[];
  } {
    const now = Date.now();
    const validKeys = Array.from(this.cache.keys()).filter((key) => {
      const expiry = this.cacheExpiry.get(key);
      return expiry ? now < expiry : false;
    });

    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      validKeys,
    };
  }
}

export type {
  BannerMetrics,
  CategoryWithMetrics,
  HeroSlideWithMetrics,
  BannerFilters,
};
