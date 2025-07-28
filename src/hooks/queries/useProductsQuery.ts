// hooks/queries/useProductsQuery.ts
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { ProductService } from "../../services/product.service";
import { FeaturedProduct, MainProduct, ApiResponse } from "../../types/index";

// Query Keys
export const PRODUCT_QUERY_KEYS = {
  all: ["products"] as const,
  featured: () => [...PRODUCT_QUERY_KEYS.all, "featured"] as const,
  featuredWithLimit: (limit: number) =>
    [...PRODUCT_QUERY_KEYS.featured(), limit] as const,
  byCategory: (categoryId: number) =>
    [...PRODUCT_QUERY_KEYS.all, "category", categoryId] as const,
  search: (query: string) =>
    [...PRODUCT_QUERY_KEYS.all, "search", query] as const,
  details: (id: number) => [...PRODUCT_QUERY_KEYS.all, "details", id] as const,
} as const;

// Featured Products Query
export const useFeaturedProductsQuery = (limit: number = 6) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.featuredWithLimit(limit),
    queryFn: () => ProductService.getFeaturedProducts(limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    select: (data: FeaturedProduct[]) => {
      // Transform or filter data if needed
      return data;
    },
  });
};

// Products by Category Query
export const useProductsByCategoryQuery = (
  categoryId: number,
  limit: number = 10
) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.byCategory(categoryId),
    queryFn: () => ProductService.getProductsByCategory(categoryId, limit),
    enabled: !!categoryId, // Only run if categoryId is truthy
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Infinite Product Search Query
export const useInfiniteProductSearchQuery = (
  query: string,
  limit: number = 12
) => {
  return useInfiniteQuery({
    queryKey: PRODUCT_QUERY_KEYS.search(query),
    queryFn: ({ pageParam = 1 }) =>
      ProductService.searchProducts(query, pageParam, limit),
    enabled: !!query.trim(),
    getNextPageParam: (lastPage: ApiResponse<MainProduct[]>, allPages) => {
      const hasMore = lastPage.data && lastPage.data.length === limit;
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
  });
};

// Regular Product Search Query (for simple pagination)
export const useProductSearchQuery = (
  query: string,
  page: number = 1,
  limit: number = 12
) => {
  return useQuery({
    queryKey: [...PRODUCT_QUERY_KEYS.search(query), page, limit],
    queryFn: () => ProductService.searchProducts(query, page, limit),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Product Details Query
export const useProductDetailsQuery = (productId: number) => {
  return useQuery({
    queryKey: PRODUCT_QUERY_KEYS.details(productId),
    queryFn: () => ProductService.getProductDetails(productId),
    enabled: !!productId,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

// Mutation for adding product to favorites
export const useAddToFavoritesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: number) => ProductService.addToFavorites(productId),
    onSuccess: (data, productId) => {
      queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.featured(),
      });

      // Update the specific product in cache
      queryClient.setQueryData(
        PRODUCT_QUERY_KEYS.details(productId),
        (oldData: any) => ({
          ...oldData,
          isFavorite: true,
        })
      );
    },
    onError: (error) => {
      console.error("Failed to add to favorites:", error);
    },
  });
};

// Mutation for refreshing featured products
export const useRefreshFeaturedProductsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (limit: number = 6) => {
      // Invalidate the query to force a refetch
      await queryClient.invalidateQueries({
        queryKey: PRODUCT_QUERY_KEYS.featuredWithLimit(limit),
      });
      return ProductService.getFeaturedProducts(limit);
    },
    onSuccess: () => {
      console.log("Featured products refreshed successfully");
    },
  });
};
