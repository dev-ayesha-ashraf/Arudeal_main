import { useMemo } from "react";
import {
  useFeaturedProductsQuery,
  useProductSearchQuery,
  useAddToFavoritesMutation,
  useRefreshFeaturedProductsMutation,
} from "./queries/useProductsQuery";

export const useProducts = (limit: number = 6) => {
  const featuredQuery = useFeaturedProductsQuery(limit);
  const addToFavoritesMutation = useAddToFavoritesMutation();
  const refreshMutation = useRefreshFeaturedProductsMutation();

  const featuredProducts = useMemo(() => {
    return featuredQuery.data || [];
  }, [featuredQuery.data]);

  const addToFavorites = async (productId: number) => {
    try {
      await addToFavoritesMutation.mutateAsync(productId);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  };

  const refreshProducts = async () => {
    try {
      await refreshMutation.mutateAsync(limit);
    } catch (error) {
      console.error("Failed to refresh products:", error);
      throw error;
    }
  };

  return {
    featuredProducts,
    loading: featuredQuery.isLoading,
    error: featuredQuery.error?.message || null,
    isRefreshing: refreshMutation.isPending,
    addToFavorites,
    refreshProducts,
    refetch: featuredQuery.refetch,
  };
};

export const useProductSearch = () => {
  const addToFavoritesMutation = useAddToFavoritesMutation();

  const searchProducts = (
    query: string,
    page: number = 1,
    limit: number = 12
  ) => {
    return useProductSearchQuery(query, page, limit);
  };

  const addToFavorites = async (productId: number) => {
    try {
      await addToFavoritesMutation.mutateAsync(productId);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
      throw error;
    }
  };

  return {
    searchProducts,
    addToFavorites,
    isAddingToFavorites: addToFavoritesMutation.isPending,
  };
};
