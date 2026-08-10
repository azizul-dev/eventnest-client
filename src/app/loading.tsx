"use client";

import { motion } from "framer-motion";
import { Ticket } from "lucide-react";

/**
 * app/loading.tsx — Next.js App Router global route-level loading UI.
 * Renders automatically while a page segment is loading.
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0A0F0D] gap-10">
      {/* Animated brand logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        {/* Rotating ticket icon */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 rounded-3xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #065f46, #059669, #d97a3d)",
            boxShadow: "0 0 40px rgba(217,122,61,0.4)",
          }}
        >
          <Ticket className="w-9 h-9 text-white -rotate-12" />
        </motion.div>

        {/* Brand name */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center"
        >
          <p
            className="text-2xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(135deg, #10b981, #d97a3d)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EventNest
          </p>
          <p className="text-xs text-emerald-600/70 dark:text-emerald-500/50 mt-1 tracking-widest uppercase font-semibold">
            Loading your experience…
          </p>
        </motion.div>
      </motion.div>

      {/* Copper animated progress bar */}
      <div className="w-56 h-1 rounded-full bg-emerald-900/40 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #d97a3d, #c86b4a, #d97a3d)",
            backgroundSize: "200% 100%",
          }}
          animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Pulsing dots */}
      <div className="dot-pulse flex items-center gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2 h-2 rounded-full"
            style={{
              background: i === 1 ? "#d97a3d" : "#059669",
              display: "block",
            }}
          />
        ))}
      </div>
    </div>
  );
}
