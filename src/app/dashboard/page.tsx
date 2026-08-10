"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Ticket,
  Calendar,
  MapPin,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";
import { Booking } from "@/types";

export default function UserDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { bookings, isLoading: bookingsLoading, cancelBooking, refetch } =
    useBookings(1, 50);

  const [selectedBookingToCancel, setSelectedBookingToCancel] =
    useState<Booking | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading || !user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 space-y-8">
        <Skeleton className="h-40 w-full rounded-3xl" />
        <Skeleton className="h-64 w-full rounded-3xl" />
      </div>
    );
  }

  const handleCancelConfirm = async () => {
    if (!selectedBookingToCancel) return;
    setIsCancelling(true);
    try {
      await cancelBooking(selectedBookingToCancel.id);
      toast.success(
        "Booking cancelled successfully. Seats have been restored."
      );
      setSelectedBookingToCancel(null);
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* User Profile Card Header */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#065F46] via-[#044E38] to-[#0A2A1F] p-8 sm:p-10 text-white shadow-2xl overflow-hidden border border-emerald-500/25">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D97A3D]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#059669] to-[#D97A3D] flex items-center justify-center text-white font-extrabold text-2xl shadow-inner border border-white/20">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F5F3ED]">{user.name}</h1>
                <Badge status={user.role} />
              </div>
              <p className="text-xs text-emerald-200/80 font-medium">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              className="px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#D97A3D]" /> Refresh Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[#F5F3ED]">
              My Event Passes &amp; Bookings
            </h2>
            <p className="text-xs text-emerald-200/70">
              Manage your reserved tickets and view event schedules
            </p>
          </div>
        </div>

        {bookingsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 bg-[#133E31]/80 rounded-3xl border border-emerald-500/20 space-y-4 p-8">
            <Ticket className="w-12 h-12 text-[#D97A3D] mx-auto" />
            <h3 className="text-lg font-bold text-[#F5F3ED]">No active bookings yet</h3>
            <p className="text-xs text-emerald-200/70 max-w-sm mx-auto">
              Explore upcoming concerts, workshops, and seminars to reserve your first seat!
            </p>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white font-bold text-xs shadow-md hover:scale-105 transition-transform"
            >
              Browse Events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-3xl bg-[#133E31]/80 border border-emerald-500/20 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Event info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-3">
                    <Badge status={booking.status} />
                    <span className="text-xs font-mono text-emerald-300/50">
                      ID: {booking.id}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg text-[#F5F3ED]">
                    {booking.event?.title || "Event Pass"}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-200/80">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {booking.event?.venue}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D97A3D]" />
                      {booking.event?.eventDate
                        ? new Date(booking.event.eventDate).toLocaleDateString()
                        : "TBD"}
                    </span>
                  </div>
                </div>

                {/* Seat & Price summary */}
                <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-emerald-500/20 pt-4 md:pt-0 md:pl-6">
                  <div>
                    <span className="text-xs text-emerald-300/60 font-semibold block">Seats</span>
                    <span className="text-xl font-extrabold text-[#D97A3D]">
                      {booking.seatCount} Seat(s)
                    </span>
                  </div>

                  <div>
                    <span className="text-xs text-emerald-300/60 font-semibold block">Total Paid</span>
                    <span className="text-xl font-black text-[#F5F3ED]">
                      ${((booking.event?.price || 0) * booking.seatCount).toFixed(2)}
                    </span>
                  </div>

                  {/* Actions */}
                  {booking.status === "CONFIRMED" && (
                    <button
                      onClick={() => setSelectedBookingToCancel(booking)}
                      className="px-4 py-2 rounded-full border border-rose-400/30 text-rose-400 hover:bg-rose-500/15 text-xs font-bold transition-colors"
                    >
                      Cancel Pass
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={!!selectedBookingToCancel}
        onClose={() => setSelectedBookingToCancel(null)}
        title="Cancel Booking Pass"
      >
        <div className="space-y-4 text-center py-2">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto" />
          <h3 className="font-bold text-lg text-[#F5F3ED]">
            Are you sure you want to cancel?
          </h3>
          <p className="text-xs text-emerald-200/70">
            Cancelling this booking will release{" "}
            <span className="font-bold text-rose-400">
              {selectedBookingToCancel?.seatCount} seat(s)
            </span>{" "}
            back to the available pool for {selectedBookingToCancel?.event?.title}.
          </p>

          <div className="flex items-center gap-3 pt-4">
            <Button
              onClick={() => setSelectedBookingToCancel(null)}
              variant="outline"
              className="flex-1 py-3 text-xs"
            >
              Keep Booking
            </Button>
            <Button
              onClick={handleCancelConfirm}
              isLoading={isCancelling}
              loadingText="Cancelling..."
              variant="danger"
              className="flex-1 py-3 text-xs"
            >
              Yes, Cancel Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
