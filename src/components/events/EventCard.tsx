"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Ticket, Users, ChevronRight } from "lucide-react";
import { Event } from "@/types";
import { Badge } from "@/components/ui/Badge";

interface EventCardProps {
  event: Event;
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate percentage of seats remaining
  const seatPercentage = Math.round(
    (event.availableSeats / event.totalSeats) * 100
  );

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative rounded-3xl bg-[#133E31]/80 border border-emerald-500/20 overflow-hidden shadow-md hover:shadow-2xl hover:shadow-[#D97A3D]/15 hover:border-[#D97A3D]/40 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Banner image with overlay gradient */}
        <div className="relative h-48 w-full bg-gradient-to-tr from-[#065F46] via-[#044E38] to-[#0A2A1F] overflow-hidden">
          {/* Gradient backdrop pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-[#D97A3D]/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#133E31] via-transparent to-transparent" />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            {event.category && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#0F3D2E]/80 backdrop-blur-md text-[#F5F3ED] shadow-sm border border-emerald-500/30">
                {event.category.name}
              </span>
            )}
            <Badge status={event.status} />
          </div>

          {/* Center visual emblem */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Ticket className="w-16 h-16 text-emerald-400/15 transform -rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          <div className="space-y-1.5">
            <h3 className="font-extrabold text-xl text-[#F5F3ED] group-hover:text-[#D97A3D] transition-colors line-clamp-1">
              {event.title}
            </h3>
            <p className="text-xs text-emerald-200/70 line-clamp-2 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Details list */}
          <div className="space-y-2 text-xs font-medium text-emerald-200/80">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D97A3D]" />
              <span>
                {formattedDate} • {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>

          {/* Seat Progress Bar */}
          <div className="space-y-1.5 pt-2">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-emerald-300/70 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-emerald-400" /> Seats Available
              </span>
              <span
                className={
                  event.availableSeats === 0
                    ? "text-rose-400 font-bold"
                    : event.availableSeats < 10
                    ? "text-[#D97A3D] font-bold"
                    : "text-emerald-400"
                }
              >
                {event.availableSeats} / {event.totalSeats}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0F3D2E]/60 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  event.availableSeats === 0
                    ? "bg-rose-500"
                    : seatPercentage < 20
                    ? "bg-[#D97A3D]"
                    : "bg-gradient-to-r from-[#059669] to-[#D97A3D]"
                }`}
                style={{ width: `${seatPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-6 pt-0 flex items-center justify-between border-t border-emerald-500/15 mt-4">
        <div>
          <span className="text-xs text-emerald-300/60 font-semibold block">Price</span>
          <span className="text-2xl font-black text-[#D97A3D]">
            ${event.price.toFixed(2)}
          </span>
        </div>

        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white text-xs font-extrabold shadow-md shadow-[#D97A3D]/20 group-hover:shadow-[#D97A3D]/40 transition-all"
        >
          View Event
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
};
