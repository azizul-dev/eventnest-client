"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, TicketX, Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 relative overflow-hidden bg-[#F5FAF7] dark:bg-[#0A0F0D] text-gray-900 dark:text-emerald-50">
      {/* Background Copper/Emerald Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-900/20 via-emerald-600/10 to-[#D97A3D]/20 rounded-full blur-3xl -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-lg w-full text-center space-y-8 p-8 rounded-3xl bg-white/60 dark:bg-[#0F1A14]/80 border border-gray-200 dark:border-emerald-500/20 shadow-2xl backdrop-blur-xl"
      >
        {/* Decorative Graphic Icon */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-24 h-24 mx-auto"
        >
          <div className="w-full h-full rounded-3xl bg-gradient-to-tr from-[#065F46] via-[#059669] to-[#D97A3D] p-0.5 shadow-xl shadow-[#D97A3D]/20">
            <div className="w-full h-full rounded-[23px] bg-[#0A0F0D] flex items-center justify-center">
              <TicketX className="w-12 h-12 text-[#D97A3D]" />
            </div>
          </div>
          <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-[#D97A3D] text-white shadow-md">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: "10s" }} />
          </div>
        </motion.div>

        {/* Stylized 404 Heading */}
        <div className="space-y-2">
          <h1 className="text-7xl sm:text-8xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 via-emerald-400 to-[#D97A3D] drop-shadow-[0_4px_25px_rgba(217,122,61,0.3)]">
            404
          </h1>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-emerald-100">
            This Event Got Cancelled
          </h2>
          <p className="text-sm text-gray-600 dark:text-emerald-400/70 max-w-sm mx-auto leading-relaxed">
            The page or event pass you were looking for was sold out, moved to a different venue, or wandered off the map.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white font-extrabold text-sm shadow-lg shadow-[#D97A3D]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            <Home className="w-4 h-4" />
            Back to Event Home
          </Link>
          <Link
            href="/events"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-gray-300 dark:border-emerald-500/30 bg-transparent text-gray-800 dark:text-emerald-200 font-bold text-sm hover:bg-emerald-500/10 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Browse All Events
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
