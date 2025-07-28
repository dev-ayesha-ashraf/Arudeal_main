// services/product.service.ts (updated with additional methods)
import { apiService } from "./api.service";
import { API_CONFIG } from "../config/api";
import { FeaturedProduct, MainProduct, ApiResponse } from "../types";

export class ProductService {
  static async getFeaturedProducts(
    limit: number = 6
  ): Promise<FeaturedProduct[]> {
    try {
      const response: ApiResponse<FeaturedProduct[]> = await apiService.get(
        API_CONFIG.ENDPOINTS.PRODUCTS.FEATURED,
        { limit }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  }

  static async getProductsByCategory(
    categoryId: number,
    limit: number = 10
  ): Promise<MainProduct[]> {
    try {
      const response: ApiResponse<MainProduct[]> = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PRODUCTS.BY_CATEGORY}/${categoryId}`,
        { limit }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error fetching products by category:", error);
      return [];
    }
  }

  static async searchProducts(
    query: string,
    page: number = 1,
    limit: number = 12
  ): Promise<ApiResponse<MainProduct[]>> {
    try {
      return await apiService.get(API_CONFIG.ENDPOINTS.PRODUCTS.SEARCH, {
        q: query,
        page,
        limit,
      });
    } catch (error) {
      console.error("Error searching products:", error);
      throw error;
    }
  }

  static async getProductDetails(productId: number): Promise<MainProduct> {
    try {
      const response: ApiResponse<MainProduct> = await apiService.get(
        `${API_CONFIG.ENDPOINTS.PRODUCTS.DETAILS}/${productId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  }

  static async addToFavorites(
    productId: number
  ): Promise<{ success: boolean }> {
    try {
      const response = await apiService.post("/user/favorites", { productId });
      return response.data;
    } catch (error) {
      console.error("Error adding to favorites:", error);
      throw error;
    }
  }
}
