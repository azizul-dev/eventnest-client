"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Calendar,
  Search,
  ArrowRight,
  Star,
} from "lucide-react";
import { useEvents } from "@/hooks/useEvents";
import { useCategories } from "@/hooks/useCategories";
import { EventCard } from "@/components/events/EventCard";
import { EventCardSkeleton } from "@/components/ui/Skeleton";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined
  );
  const { categories } = useCategories();
  const { events, isLoading: eventsLoading } = useEvents({
    limit: 6,
    categoryId: selectedCategory,
  });

  // Staggered motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="space-y-24 pb-20">
      {/* ─────────────────────────────────────────────────────────────
          1. Hero Section
      ───────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-24 md:pb-32 bg-gradient-to-b from-[#0F3D2E]/60 via-[#0A2A1F]/40 to-transparent">
        {/* Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/20 via-[#D97A3D]/20 to-emerald-900/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto space-y-8"
          >
            {/* Pill Tag */}
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D97A3D]/40 bg-[#D97A3D]/15 text-[#D97A3D] text-xs font-extrabold tracking-wide uppercase shadow-sm">
                <Sparkles className="w-4 h-4 text-[#D97A3D] animate-pulse" />
                The Premier Live Events Platform
              </span>
            </motion.div>

            {/* Main Heading — Fix: Base #F5F3ED, Highlighted #D97A3D */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-[#F5F3ED] leading-[1.1]"
            >
              Discover & Book{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#D97A3D] to-[#C86B4A]">
                Unforgettable
              </span>{" "}
              Events
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-[#F5F3ED]/80 leading-relaxed font-normal"
            >
              From electrifying music concerts and tech conferences to interactive masterclasses. Reserve your seats in real-time with zero friction.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
            >
              <Link
                href="/events"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white font-extrabold text-base shadow-lg shadow-[#D97A3D]/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
              >
                Explore All Events
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/register"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-emerald-400/30 bg-[#133E31]/60 backdrop-blur-md text-[#F5F3ED] font-bold text-base hover:bg-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                Create Account
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-14 max-w-2xl mx-auto"
          >
            <form
              action="/events"
              className="relative flex items-center bg-[#133E31] p-2 rounded-full border border-emerald-500/30 shadow-2xl shadow-black/30"
            >
              <Search className="w-6 h-6 text-emerald-300/60 ml-4" />
              <input
                type="text"
                name="search"
                placeholder="Search concerts, tech summits, workshops..."
                className="w-full px-4 py-3 bg-transparent text-[#F5F3ED] placeholder-emerald-200/50 focus:outline-none text-sm font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white text-xs font-extrabold shadow-md hover:opacity-90 transition-opacity"
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          2. Category Quick-Filter Chips
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3ED]">
              Browse by Category
            </h2>
            <p className="text-sm text-emerald-200/70">
              Filter live events tailored to your interests
            </p>
          </div>
          <Link
            href="/events"
            className="text-sm font-bold text-[#D97A3D] hover:text-[#C86B4A] flex items-center gap-1 transition-colors"
          >
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(undefined)}
            className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === undefined
                ? "bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white shadow-md shadow-[#D97A3D]/25"
                : "bg-[#133E31]/80 text-[#F5F3ED]/90 border border-emerald-500/20 hover:border-[#D97A3D]/40"
            }`}
          >
            🔥 All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? "bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white shadow-md shadow-[#D97A3D]/25"
                  : "bg-[#133E31]/80 text-[#F5F3ED]/90 border border-emerald-500/20 hover:border-[#D97A3D]/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. Featured Events Grid
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-[#F5F3ED]">
              Featured Events
            </h2>
            <p className="text-sm text-emerald-200/70">
              Handpicked upcoming experiences selling fast
            </p>
          </div>
        </div>

        {eventsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16 bg-[#133E31]/80 rounded-3xl border border-emerald-500/20 space-y-4">
            <Calendar className="w-12 h-12 text-[#D97A3D] mx-auto" />
            <h3 className="text-lg font-bold text-[#F5F3ED]">No events found in this category</h3>
            <p className="text-sm text-emerald-200/70">
              Try selecting another category or clear filters.
            </p>
            <button
              onClick={() => setSelectedCategory(undefined)}
              className="px-6 py-2.5 rounded-full bg-[#D97A3D] text-white font-semibold text-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {events.map((event) => (
              <motion.div key={event.id} variants={itemVariants}>
                <EventCard event={event} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. Platform Stats Banner — Copper Accent
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#065F46] via-[#044E38] to-[#0A2A1F] border border-emerald-500/30 p-10 md:p-16 overflow-hidden shadow-2xl text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#D97A3D]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center relative z-10">
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black block text-[#D97A3D]">100%</span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200/90">
                Verified Bookings
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black block text-emerald-400">50k+</span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200/90">
                Seats Reserved
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black block text-[#D97A3D]">4.9★</span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200/90">
                Average Rating
              </span>
            </div>
            <div className="space-y-2">
              <span className="text-4xl md:text-5xl font-black block text-emerald-400">24/7</span>
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-200/90">
                Real-Time Updates
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. Testimonials Section
      ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#D97A3D]">
            Community Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F5F3ED]">
            Loved by Event Attendees
          </h2>
          <p className="text-sm text-emerald-200/70">
            Hear what our verified attendees have to say about their booking experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: "Sophia Martinez",
              role: "Music Enthusiast",
              comment:
                "Booking concert tickets on EventNest was smooth! The real-time seat availability indicator gave me peace of mind before confirming.",
              rating: 5,
            },
            {
              name: "Alexander Chen",
              role: "Tech Lead & Speaker",
              comment:
                "As an attendee at tech summits, I love how clean the dashboard is for managing my bookings and receiving instant digital passes.",
              rating: 5,
            },
            {
              name: "Elena Rostova",
              role: "Workshop Organizer",
              comment:
                "The admin portal is crisp and simple to use. Updating seat counts and category details takes seconds. Highly recommended!",
              rating: 5,
            },
          ].map((t, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-[#133E31]/80 border border-emerald-500/20 space-y-4 shadow-md"
            >
              <div className="flex items-center gap-1 text-[#D97A3D]">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#D97A3D]" />
                ))}
              </div>
              <p className="text-sm text-[#F5F3ED]/90 leading-relaxed italic">
                "{t.comment}"
              </p>
              <div className="pt-4 border-t border-emerald-500/15">
                <p className="font-bold text-sm text-[#F5F3ED]">
                  {t.name}
                </p>
                <p className="text-xs text-emerald-300/60">{t.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
