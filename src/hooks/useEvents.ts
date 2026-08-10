import { useState, useEffect, useCallback } from "react";
import { Event, ApiResponse, PaginatedResponse, EventStatus } from "@/types";
import { api } from "@/lib/api";

interface EventQueryParams {
  page?: number;
  limit?: number;
  categoryId?: string;
  status?: EventStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export const useEvents = (initialParams: EventQueryParams = {}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: initialParams.page || 1,
    limit: initialParams.limit || 10,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [params, setParams] = useState<EventQueryParams>(initialParams);

  const fetchEvents = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Build clean query params (exclude undefined values)
      const queryParams: Record<string, string | number> = {};
      if (params.page) queryParams.page = params.page;
      if (params.limit) queryParams.limit = params.limit;
      if (params.categoryId) queryParams.categoryId = params.categoryId;
      if (params.status) queryParams.status = params.status;
      if (params.search) queryParams.search = params.search;
      if (params.startDate) queryParams.startDate = params.startDate;
      if (params.endDate) queryParams.endDate = params.endDate;

      const response = await api.get<ApiResponse<PaginatedResponse<Event>>>(
        "/events",
        { params: queryParams }
      );
      const data = response.data.data;
      // Backend returns { events: [...], pagination: {...} }
      setEvents(data.events || []);
      setPagination(data.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch events.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const updateFilters = (newFilters: Partial<EventQueryParams>) => {
    setParams((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const setPage = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return {
    events,
    pagination,
    isLoading,
    error,
    params,
    updateFilters,
    setPage,
    refetch: fetchEvents,
  };
};
