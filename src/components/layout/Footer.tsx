import React from "react";
import Link from "next/link";
import { Ticket, Heart } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0A2A1F] border-t border-emerald-500/20 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#065F46] via-[#059669] to-[#D97A3D] flex items-center justify-center shadow-md">
                <Ticket className="w-5 h-5 text-white transform -rotate-12" />
              </div>
              <span className="font-extrabold text-2xl text-[#F5F3ED]">
                Event<span className="text-[#D97A3D]">Nest</span>
              </span>
            </Link>
            <p className="text-sm text-emerald-200/70 leading-relaxed">
              The premier platform for discovering, booking, and hosting unforgettable live experiences, concerts, workshops, and seminars.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#F5F3ED]">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/70">
              <li>
                <Link href="/events" className="hover:text-[#D97A3D] transition-colors">
                  All Upcoming Events
                </Link>
              </li>
              <li>
                <Link href="/events?status=UPCOMING" className="hover:text-[#D97A3D] transition-colors">
                  Concerts & Music
                </Link>
              </li>
              <li>
                <Link href="/events?status=ONGOING" className="hover:text-[#D97A3D] transition-colors">
                  Workshops & Masterclasses
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-[#D97A3D] transition-colors">
                  Seminars & Conferences
                </Link>
              </li>
            </ul>
          </div>

          {/* User Account */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#F5F3ED]">
              Account & Portal
            </h4>
            <ul className="space-y-2.5 text-sm text-emerald-200/70">
              <li>
                <Link href="/dashboard" className="hover:text-[#D97A3D] transition-colors">
                  My Bookings
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#D97A3D] transition-colors">
                  User Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-[#D97A3D] transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-[#D97A3D] transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#F5F3ED]">
              Stay in the Loop
            </h4>
            <p className="text-xs text-emerald-200/70">
              Subscribe to receive weekly curated event recommendations in your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2.5 rounded-full text-xs bg-[#133E31] border border-emerald-500/30 focus:outline-none focus:border-[#D97A3D] text-[#F5F3ED] placeholder-emerald-200/50"
              />
              <button className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white text-xs font-bold hover:opacity-90 transition-opacity flex-shrink-0">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-emerald-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <p>© {new Date().getFullYear()} EventNest. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-[#D97A3D] fill-[#D97A3D]" /> for performance
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
