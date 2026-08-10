import { useState, useEffect, useCallback } from "react";
import { Booking, ApiResponse, PaginatedResponse } from "@/types";
import { api } from "@/lib/api";

export const useBookings = (page = 1, limit = 50) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page,
    limit,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get<ApiResponse<PaginatedResponse<Booking>>>(
        "/bookings",
        { params: { page, limit } }
      );
      // Backend returns { bookings: [...], pagination: {...} }
      setBookings(response.data.data.bookings || []);
      setPagination(response.data.data.pagination);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch bookings.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const cancelBooking = async (bookingId: string): Promise<Booking> => {
    const response = await api.patch<ApiResponse<Booking>>(
      `/bookings/${bookingId}/cancel`
    );
    await fetchBookings();
    return response.data.data;
  };

  return {
    bookings,
    pagination,
    isLoading,
    error,
    refetch: fetchBookings,
    cancelBooking,
  };
};
