"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Events", href: "/events" },
    ...(isAuthenticated ? [{ name: "My Bookings", href: "/dashboard" }] : []),
    ...(isAdmin ? [{ name: "Admin Portal", href: "/admin" }] : []),
  ];

  return (
    <header className="sticky top-4 z-50 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pointer-events-auto">
      {/* Floating Pill Container */}
      <div className="w-full bg-[#3A5F45]/85 backdrop-blur-md border border-emerald-400/25 rounded-full px-6 py-3 shadow-2xl shadow-black/40 flex items-center justify-between transition-all">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#065F46] via-[#059669] to-[#D97A3D] flex items-center justify-center shadow-lg shadow-[#D97A3D]/20 group-hover:scale-105 transition-transform">
            <Ticket className="w-5 h-5 text-white transform -rotate-12" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl tracking-tight text-[#F5F3ED]">
              Event<span className="text-[#D97A3D]">Nest</span>
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#D97A3D] -mt-1">
              Live Experiences
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0F3D2E]/60 p-1.5 rounded-full border border-emerald-400/20">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-5 py-2 text-xs font-bold rounded-full transition-all duration-200 ${
                  isActive
                    ? "text-white shadow-md shadow-[#D97A3D]/20"
                    : "text-[#F5F3ED]/80 hover:text-white hover:bg-emerald-400/10"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] rounded-full -z-10 shadow-[0_0_15px_rgba(217,122,61,0.4)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Profile */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 pr-4 rounded-full border border-emerald-400/25 bg-[#0F3D2E]/40 hover:bg-[#0F3D2E]/80 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#059669] to-[#D97A3D] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs font-bold text-[#F5F3ED]">
                  {user?.name.split(" ")[0]}
                </span>
              </button>

              {/* User Dropdown */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#133E31] rounded-2xl border border-emerald-500/30 p-2 shadow-2xl z-50"
                  >
                    <div className="p-3 border-b border-emerald-500/20">
                      <p className="font-bold text-sm text-[#F5F3ED]">
                        {user?.name}
                      </p>
                      <p className="text-xs text-emerald-200/60 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#F5F3ED]/90 hover:bg-emerald-500/20 rounded-xl transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#D97A3D]" />
                        My Bookings
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#D97A3D] hover:bg-[#D97A3D]/20 rounded-xl transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-[#D97A3D]" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-400 hover:bg-rose-500/20 rounded-xl transition-colors mt-1 border-t border-emerald-500/20"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-xs font-bold text-[#F5F3ED]/90 hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-xs font-extrabold text-white rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] shadow-md shadow-[#D97A3D]/30 hover:scale-105 active:scale-95 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full bg-[#0F3D2E]/60 text-[#F5F3ED] border border-emerald-400/20"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mt-3 border border-emerald-400/25 bg-[#3A5F45]/95 backdrop-blur-xl rounded-3xl p-4 shadow-2xl space-y-3"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-2xl text-sm font-bold transition-colors ${
                  pathname === link.href
                    ? "bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white"
                    : "text-[#F5F3ED] hover:bg-emerald-500/20"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-3 border-t border-emerald-400/20">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <p className="font-bold text-sm text-[#F5F3ED]">{user?.name}</p>
                    <p className="text-xs text-emerald-200/60">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-rose-500/20 text-rose-300 font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-2xl border border-emerald-400/30 text-[#F5F3ED] font-bold text-xs text-center"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 rounded-2xl bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white font-bold text-xs text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
