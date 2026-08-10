import { useState, useEffect, useCallback } from "react";
import { Category, ApiResponse, PaginatedResponse } from "@/types";
import { api } from "@/lib/api";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Category>>>(
        "/categories",
        { params: { limit: 100 } }
      );
      // Backend returns { categories: [...], pagination: {...} }
      setCategories(response.data.data.categories || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch categories.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
};
