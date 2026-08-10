export type Role = "ADMIN" | "USER";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isDeleted?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type EventStatus = "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

export interface Event {
  id: string;
  title: string;
  description: string;
  venue: string;
  eventDate: string;
  price: number;
  totalSeats: number;
  availableSeats: number;
  status: EventStatus;
  categoryId: string;
  category?: Category;
  isDeleted?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface Booking {
  id: string;
  seatCount: number;
  status: BookingStatus;
  userId: string;
  user?: Pick<User, "id" | "name" | "email">;
  eventId: string;
  event?: Pick<Event, "id" | "title" | "venue" | "eventDate" | "price">;
  isDeleted?: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  userId: string;
  user?: Pick<User, "id" | "name">;
  eventId: string;
  event?: Pick<Event, "id" | "title">;
  isDeleted?: boolean;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Generic paginated list shape — used when the key name is known in the hook
export interface PaginatedResponse<T> {
  items?: T[];
  pagination: Pagination;
  // resource-specific keys returned by the backend:
  categories?: T[];
  events?: T[];
  bookings?: T[];
  reviews?: T[];
  users?: T[];
}
