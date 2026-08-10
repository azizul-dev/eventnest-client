"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  FolderPlus,
  CalendarPlus,
  Ticket,
  Edit2,
  Trash2,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { Category, Event, Booking, ApiResponse, PaginatedResponse, EventStatus } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton, TableRowSkeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

type TabType = "categories" | "events" | "bookings";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("events");

  // Data states
  const [categories, setCategories] = useState<Category[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSavingCategory, setIsSavingCategory] = useState(false);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Category Modal State
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryName, setCategoryName] = useState("");

  // Event Modal State
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: "",
    description: "",
    venue: "",
    eventDate: "",
    price: 0,
    totalSeats: 50,
    categoryId: "",
    status: "UPCOMING" as EventStatus,
  });

  // Guard access
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated || !isAdmin) {
        toast.error("Access denied. Admin portal is restricted.");
        router.push("/");
      }
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  // Fetch data
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [catRes, eventRes, bookingRes] = await Promise.all([
        api.get<ApiResponse<PaginatedResponse<Category>>>("/categories?limit=100"),
        api.get<ApiResponse<PaginatedResponse<Event>>>("/events?limit=100"),
        api.get<ApiResponse<PaginatedResponse<Booking>>>("/bookings?limit=100"),
      ]);
      setCategories(catRes.data.data.categories || []);
      setEvents(eventRes.data.data.events || []);
      setBookings(bookingRes.data.data.bookings || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load admin dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Category Actions
  const handleOpenCategoryModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryName(cat.name);
    } else {
      setEditingCategory(null);
      setCategoryName("");
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setIsSavingCategory(true);
    try {
      if (editingCategory) {
        await api.patch(`/categories/${editingCategory.id}`, {
          name: categoryName,
        });
        toast.success("Category updated successfully.");
      } else {
        await api.post("/categories", { name: categoryName });
        toast.success("Category created successfully.");
      }
      setCategoryModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save category.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete category.");
    }
  };

  // Event Actions
  const handleOpenEventModal = (ev?: Event) => {
    if (ev) {
      setEditingEvent(ev);
      setEventFormData({
        title: ev.title,
        description: ev.description,
        venue: ev.venue,
        eventDate: new Date(ev.eventDate).toISOString().slice(0, 16),
        price: ev.price,
        totalSeats: ev.totalSeats,
        categoryId: ev.categoryId,
        status: ev.status,
      });
    } else {
      setEditingEvent(null);
      setEventFormData({
        title: "",
        description: "",
        venue: "",
        eventDate: new Date().toISOString().slice(0, 16),
        price: 49.99,
        totalSeats: 100,
        categoryId: categories[0]?.id || "",
        status: "UPCOMING",
      });
    }
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingEvent(true);
    try {
      const payload = {
        ...eventFormData,
        price: Number(eventFormData.price),
        totalSeats: Number(eventFormData.totalSeats),
        eventDate: new Date(eventFormData.eventDate).toISOString(),
      };

      if (editingEvent) {
        await api.patch(`/events/${editingEvent.id}`, payload);
        toast.success("Event updated successfully.");
      } else {
        await api.post("/events", payload);
        toast.success("Event created successfully.");
      }
      setEventModalOpen(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to save event.");
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to soft-delete this event?")) return;
    try {
      await api.delete(`/events/${id}`);
      toast.success("Event soft-deleted.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete event.");
    }
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-4">
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  const inputClass = "w-full p-3 rounded-2xl text-sm bg-[#0F3D2E]/80 border border-emerald-500/30 text-[#F5F3ED] placeholder-emerald-200/40 focus:outline-none focus:border-[#D97A3D]";
  const labelClass = "text-xs font-bold uppercase text-emerald-200/70";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#065F46] via-[#044E38] to-[#0A2A1F] text-white shadow-xl border border-emerald-500/25">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#D97A3D]/20 flex items-center justify-center border border-[#D97A3D]/30">
            <ShieldCheck className="w-6 h-6 text-[#D97A3D]" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-[#F5F3ED]">Admin Control Portal</h1>
            <p className="text-xs text-emerald-200/80">
              Manage categories, events, and monitor platform bookings
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-colors self-start md:self-auto"
        >
          <RefreshCw className="w-4 h-4 text-[#D97A3D]" /> Refresh Data
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2 overflow-x-auto">
        {(["events", "categories", "bookings"] as TabType[]).map((tab) => {
          const icons = { events: CalendarPlus, categories: FolderPlus, bookings: Ticket };
          const counts = { events: events.length, categories: categories.length, bookings: bookings.length };
          const Icon = icons[tab];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white shadow-md shadow-[#D97A3D]/25"
                  : "text-emerald-200/80 hover:bg-emerald-500/15"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab} ({counts[tab]})
            </button>
          );
        })}
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#F5F3ED]">Events List</h3>
            <Button onClick={() => handleOpenEventModal()} variant="copper" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Create Event
            </Button>
          </div>

          <div className="bg-[#133E31]/80 rounded-3xl border border-emerald-500/20 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F3D2E]/60 text-emerald-300/70 uppercase font-bold border-b border-emerald-500/20">
                <tr>
                  <th className="p-4">Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={7} />
                    <TableRowSkeleton cols={7} />
                    <TableRowSkeleton cols={7} />
                  </>
                ) : events.map((ev) => (
                  <tr key={ev.id} className="hover:bg-emerald-500/5">
                    <td className="p-4 font-bold text-[#F5F3ED]">{ev.title}</td>
                    <td className="p-4 text-emerald-200/80">{ev.category?.name || "Uncategorized"}</td>
                    <td className="p-4 text-emerald-200/80">{new Date(ev.eventDate).toLocaleDateString()}</td>
                    <td className="p-4 font-semibold text-[#D97A3D]">${ev.price}</td>
                    <td className="p-4 text-emerald-200/80">
                      {ev.availableSeats} / {ev.totalSeats}
                    </td>
                    <td className="p-4">
                      <Badge status={ev.status} />
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEventModal(ev)}
                        className="p-1.5 rounded-lg border border-emerald-500/25 hover:bg-[#D97A3D]/15 text-[#D97A3D]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(ev.id)}
                        className="p-1.5 rounded-lg border border-emerald-500/25 hover:bg-rose-500/15 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <div className="space-y-4 max-w-3xl">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-[#F5F3ED]">Categories List</h3>
            <Button onClick={() => handleOpenCategoryModal()} variant="copper" size="sm">
              <Plus className="w-4 h-4 mr-1" /> Add Category
            </Button>
          </div>

          <div className="bg-[#133E31]/80 rounded-3xl border border-emerald-500/20 overflow-hidden shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F3D2E]/60 text-emerald-300/70 uppercase font-bold border-b border-emerald-500/20">
                <tr>
                  <th className="p-4">Category Name</th>
                  <th className="p-4">ID</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={3} />
                    <TableRowSkeleton cols={3} />
                  </>
                ) : categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-emerald-500/5">
                    <td className="p-4 font-bold text-[#F5F3ED]">{cat.name}</td>
                    <td className="p-4 text-emerald-300/50 font-mono text-[10px]">{cat.id}</td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenCategoryModal(cat)}
                        className="p-1.5 rounded-lg border border-emerald-500/25 hover:bg-[#D97A3D]/15 text-[#D97A3D]"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg border border-emerald-500/25 hover:bg-rose-500/15 text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Bookings Tab */}
      {activeTab === "bookings" && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-[#F5F3ED]">All Platform Bookings</h3>
          <div className="bg-[#133E31]/80 rounded-3xl border border-emerald-500/20 overflow-x-auto shadow-sm">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0F3D2E]/60 text-emerald-300/70 uppercase font-bold border-b border-emerald-500/20">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Attendee</th>
                  <th className="p-4">Event</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-500/10">
                {isLoading ? (
                  <>
                    <TableRowSkeleton cols={6} />
                    <TableRowSkeleton cols={6} />
                  </>
                ) : bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-emerald-500/5">
                    <td className="p-4 font-mono text-emerald-300/50 text-[10px]">{b.id}</td>
                    <td className="p-4 font-bold text-[#F5F3ED]">{b.user?.name} ({b.user?.email})</td>
                    <td className="p-4 text-emerald-200/85">{b.event?.title}</td>
                    <td className="p-4 font-bold text-[#D97A3D]">{b.seatCount}</td>
                    <td className="p-4">
                      <Badge status={b.status} />
                    </td>
                    <td className="p-4 text-emerald-300/50">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Category Modal */}
      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title={editingCategory ? "Edit Category" : "Create New Category"}
      >
        <form onSubmit={handleSaveCategory} className="space-y-4">
          <div className="space-y-1">
            <label className={labelClass}>Category Name</label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Concert, Masterclass..."
              className={inputClass}
              required
            />
          </div>
          <Button
            type="submit"
            isLoading={isSavingCategory}
            loadingText="Saving..."
            variant="copper"
            className="w-full py-3"
          >
            Save Category
          </Button>
        </form>
      </Modal>

      {/* Event Modal */}
      <Modal
        isOpen={eventModalOpen}
        onClose={() => setEventModalOpen(false)}
        title={editingEvent ? "Edit Event" : "Create New Event"}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveEvent} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={eventFormData.title}
                onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Category</label>
              <select
                value={eventFormData.categoryId}
                onChange={(e) => setEventFormData({ ...eventFormData, categoryId: e.target.value })}
                className={inputClass}
                required
              >
                <option value="" className="bg-[#133E31]">Select Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="bg-[#133E31]">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Venue</label>
            <input
              type="text"
              value={eventFormData.venue}
              onChange={(e) => setEventFormData({ ...eventFormData, venue: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>Event Date &amp; Time</label>
              <input
                type="datetime-local"
                value={eventFormData.eventDate}
                onChange={(e) => setEventFormData({ ...eventFormData, eventDate: e.target.value })}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={eventFormData.price}
                onChange={(e) => setEventFormData({ ...eventFormData, price: parseFloat(e.target.value) || 0 })}
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-1">
              <label className={labelClass}>Total Seats</label>
              <input
                type="number"
                value={eventFormData.totalSeats}
                onChange={(e) => setEventFormData({ ...eventFormData, totalSeats: parseInt(e.target.value) || 1 })}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Status</label>
            <select
              value={eventFormData.status}
              onChange={(e) => setEventFormData({ ...eventFormData, status: e.target.value as EventStatus })}
              className={inputClass}
            >
              <option value="UPCOMING" className="bg-[#133E31]">UPCOMING</option>
              <option value="ONGOING" className="bg-[#133E31]">ONGOING</option>
              <option value="COMPLETED" className="bg-[#133E31]">COMPLETED</option>
              <option value="CANCELLED" className="bg-[#133E31]">CANCELLED</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className={labelClass}>Description</label>
            <textarea
              rows={3}
              value={eventFormData.description}
              onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
              className={inputClass}
              required
            />
          </div>

          <Button
            type="submit"
            isLoading={isSavingEvent}
            loadingText="Saving Event..."
            variant="copper"
            className="w-full py-3.5"
          >
            Save Event Details
          </Button>
        </form>
      </Modal>
    </div>
  );
}
