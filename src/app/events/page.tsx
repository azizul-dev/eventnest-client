"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  RotateCcw,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";
import { EventCard } from "@/components/events/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";
import { EventStatus } from "@/types";

export default function EventsListingPage() {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | "">("");

  const {
    events,
    pagination,
    isLoading,
    updateFilters,
    setPage,
  } = useEvents({
    limit: 9,
    search: searchTerm || undefined,
    categoryId: selectedCategory || undefined,
    status: (selectedStatus as EventStatus) || undefined,
  });

  const { categories } = useCategories();

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSelectedStatus("");
    updateFilters({ search: undefined, categoryId: undefined, status: undefined });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3ED]">
            Explore Events
          </h1>
          <p className="text-sm text-emerald-200/70 mt-1">
            Discover concerts, workshops, conferences, and seminars near you.
          </p>
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setMobileFilterOpen(true)}
          className="md:hidden flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#133E31] border border-emerald-500/30 text-sm font-bold text-[#D97A3D]"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter Events
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 space-y-6 bg-[#133E31]/80 p-6 rounded-3xl border border-emerald-500/20 h-fit sticky top-28 text-[#F5F3ED]">
          <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
            <h3 className="font-extrabold text-lg flex items-center gap-2 text-[#F5F3ED]">
              <Filter className="w-5 h-5 text-[#D97A3D]" />
              Filters
            </h3>
            {(selectedCategory || selectedStatus || searchTerm) && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-[#D97A3D] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>

          {/* Search Field */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/70">
              Search Keywords
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-emerald-300/50 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateFilters({ search: e.target.value || undefined });
                }}
                placeholder="Title, venue..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-[#0F3D2E]/80 border border-emerald-500/30 focus:outline-none focus:border-[#D97A3D] text-[#F5F3ED] placeholder-emerald-200/40"
              />
            </div>
          </div>

          {/* Category Radio Group */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/70">
              Categories
            </label>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              <button
                onClick={() => {
                  setSelectedCategory("");
                  updateFilters({ categoryId: undefined });
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === ""
                    ? "bg-[#D97A3D]/20 text-[#D97A3D] font-bold"
                    : "hover:bg-emerald-500/10 text-emerald-100/80"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    updateFilters({ categoryId: cat.id });
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    selectedCategory === cat.id
                      ? "bg-[#D97A3D]/20 text-[#D97A3D] font-bold"
                      : "hover:bg-emerald-500/10 text-emerald-100/80"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Event Status Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/70">
              Event Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                const val = e.target.value as EventStatus | "";
                setSelectedStatus(val);
                updateFilters({ status: val || undefined });
              }}
              className="w-full px-3 py-2.5 rounded-xl text-sm bg-[#0F3D2E]/80 border border-emerald-500/30 focus:outline-none focus:border-[#D97A3D] text-[#F5F3ED]"
            >
              <option value="" className="bg-[#133E31] text-[#F5F3ED]">All Statuses</option>
              <option value="UPCOMING" className="bg-[#133E31] text-[#F5F3ED]">Upcoming</option>
              <option value="ONGOING" className="bg-[#133E31] text-[#F5F3ED]">Ongoing</option>
              <option value="COMPLETED" className="bg-[#133E31] text-[#F5F3ED]">Completed</option>
              <option value="CANCELLED" className="bg-[#133E31] text-[#F5F3ED]">Cancelled</option>
            </select>
          </div>
        </aside>

        {/* Events Grid & Pagination */}
        <main className="lg:col-span-3 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <EventCardSkeleton key={i} />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-24 bg-[#133E31]/80 rounded-3xl border border-emerald-500/20 space-y-4 p-8">
              <Calendar className="w-12 h-12 text-[#D97A3D] mx-auto" />
              <h3 className="text-xl font-bold text-[#F5F3ED]">No events matched your filter criteria</h3>
              <p className="text-sm text-emerald-200/70 max-w-sm mx-auto">
                Try searching with different keywords, select another category, or reset filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white font-bold text-xs shadow-md"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-6 border-t border-emerald-500/20">
              <span className="text-xs text-emerald-200/70">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total events)
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPage(pagination.page - 1)}
                  className="p-2.5 rounded-full border border-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500/20 transition-colors text-[#F5F3ED]"
                >
                  <ChevronLeft className="w-5 h-5 text-[#F5F3ED]" />
                </button>

                {[...Array(pagination.totalPages)].map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                        pagination.page === pNum
                          ? "bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white shadow-md shadow-[#D97A3D]/25"
                          : "border border-emerald-500/30 hover:bg-emerald-500/20 text-[#F5F3ED]"
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage(pagination.page + 1)}
                  className="p-2.5 rounded-full border border-emerald-500/30 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-emerald-500/20 transition-colors text-[#F5F3ED]"
                >
                  <ChevronRight className="w-5 h-5 text-[#F5F3ED]" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFilterOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-80 bg-[#133E31] h-full p-6 space-y-6 overflow-y-auto shadow-2xl z-10 text-[#F5F3ED]"
            >
              <div className="flex items-center justify-between pb-4 border-b border-emerald-500/20">
                <h3 className="font-extrabold text-lg text-[#F5F3ED]">Filter Events</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-[#F5F3ED]" />
                </button>
              </div>

              {/* Mobile Search */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-emerald-200/70">Search</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Keyword..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm bg-[#0F3D2E] border border-emerald-500/30 text-[#F5F3ED]"
                />
              </div>

              {/* Mobile Categories */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-emerald-200/70">Categories</label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                      selectedCategory === "" ? "bg-[#D97A3D] text-white" : "text-[#F5F3ED]"
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold ${
                        selectedCategory === c.id ? "bg-[#D97A3D] text-white" : "text-[#F5F3ED]"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Apply Button */}
              <button
                onClick={() => {
                  updateFilters({ search: searchTerm || undefined, categoryId: selectedCategory || undefined });
                  setMobileFilterOpen(false);
                }}
                className="w-full py-3 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white font-bold text-sm shadow-md"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
