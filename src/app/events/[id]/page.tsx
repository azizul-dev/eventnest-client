"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Ticket,
  Users,
  Star,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  ShieldCheck,
  Plus,
  Minus,
} from "lucide-react";
import { Event, Review, ApiResponse, Booking, PaginatedResponse } from "@/types";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const { user, isAuthenticated } = useAuth();

  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Booking Modal State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [seatCount, setSeatCount] = useState(1);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

  // Review Check State
  const [hasConfirmedBooking, setHasConfirmedBooking] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Fetch Event Details
  const fetchEventData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [eventRes, reviewRes] = await Promise.all([
        api.get<ApiResponse<Event>>(`/events/${eventId}`),
        api.get<ApiResponse<PaginatedResponse<Review>>>(`/reviews?eventId=${eventId}`),
      ]);
      setEvent(eventRes.data.data);
      setReviews(reviewRes.data.data.reviews || []);
    } catch (err: any) {
      setError(err.message || "Failed to load event details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    if (isAuthenticated && user) {
      api
        .get<ApiResponse<PaginatedResponse<Booking>>>("/bookings?limit=100")
        .then((res) => {
          const userBookings = res.data.data.bookings || [];
          const confirmed = userBookings.some(
            (b: Booking) => b.eventId === eventId && b.status === "CONFIRMED"
          );
          setHasConfirmedBooking(confirmed);
        })
        .catch(() => setHasConfirmedBooking(false));
    }
  }, [isAuthenticated, user, eventId]);

  const handleBookingSubmit = async () => {
    if (!isAuthenticated) {
      toast.error("Please log in to book seats.");
      router.push("/login");
      return;
    }

    setIsSubmittingBooking(true);
    try {
      await api.post("/bookings", {
        eventId,
        seatCount,
      });
      toast.success("🎉 Booking confirmed! Seats reserved successfully.");
      setBookingModalOpen(false);
      setSeatCount(1);
      fetchEventData();
      setHasConfirmedBooking(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to complete booking.");
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please enter a comment for your review.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      await api.post("/reviews", {
        eventId,
        rating: reviewRating,
        comment: reviewComment,
      });
      toast.success("Review submitted! Thank you for your feedback.");
      setReviewComment("");
      fetchEventData();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-8">
        <Skeleton className="h-80 w-full rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <AlertCircle className="w-16 h-16 text-rose-400 mx-auto" />
        <h2 className="text-2xl font-bold text-[#F5F3ED]">Event Not Found</h2>
        <p className="text-emerald-200/70">{error || "This event may have been removed."}</p>
        <button
          onClick={() => router.push("/events")}
          className="px-6 py-3 rounded-full bg-[#D97A3D] text-white font-bold text-xs"
        >
          Back to Events
        </button>
      </div>
    );
  }

  const formattedDate = new Date(event.eventDate).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const formattedTime = new Date(event.eventDate).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back Link */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-200/70 hover:text-[#D97A3D] transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Events
      </button>

      {/* Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-tr from-[#065F46] via-[#044E38] to-[#0A2A1F] p-8 sm:p-12 text-white overflow-hidden shadow-2xl border border-emerald-500/25">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-emerald-500/20 via-[#D97A3D]/20 to-transparent" />

        <div className="relative z-10 space-y-6 max-w-3xl">
          <div className="flex items-center gap-3">
            {event.category && (
              <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#0F3D2E]/80 backdrop-blur-md text-[#F5F3ED] border border-emerald-400/20">
                {event.category.name}
              </span>
            )}
            <Badge status={event.status} />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight text-[#F5F3ED]">
            {event.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-sm font-medium text-emerald-100/90">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#D97A3D]" />
              <span>
                {formattedDate} at {formattedTime}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <span>{event.venue}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Details & Booking Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left 2 Cols: Description & Reviews */}
        <div className="lg:col-span-2 space-y-10">
          {/* About Event */}
          <div className="bg-[#133E31]/80 p-8 rounded-3xl border border-emerald-500/20 space-y-4">
            <h2 className="text-xl font-bold text-[#F5F3ED]">
              About This Experience
            </h2>
            <p className="text-emerald-100/85 text-sm leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="bg-[#133E31]/80 p-8 rounded-3xl border border-emerald-500/20 space-y-6">
            <div className="flex items-center justify-between border-b border-emerald-500/15 pb-4">
              <h2 className="text-xl font-bold text-[#F5F3ED] flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-[#D97A3D]" />
                Verified Reviews ({reviews.length})
              </h2>
            </div>

            {/* Write a Review Form */}
            {isAuthenticated ? (
              hasConfirmedBooking ? (
                <form
                  onSubmit={handleReviewSubmit}
                  className="bg-[#0F3D2E]/60 p-6 rounded-2xl border border-emerald-500/20 space-y-4"
                >
                  <h4 className="font-bold text-sm text-[#F5F3ED]">
                    Leave a Review for this Event
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-200/70">Rating:</span>
                    <div className="flex items-center gap-1 text-[#D97A3D]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="hover:scale-110 transition-transform"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              star <= reviewRating
                                ? "fill-[#D97A3D] text-[#D97A3D]"
                                : "text-emerald-300/40"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience..."
                    className="w-full p-3 rounded-xl text-sm bg-[#0F3D2E]/80 border border-emerald-500/25 focus:outline-none focus:border-[#D97A3D] text-[#F5F3ED] placeholder-emerald-200/40"
                  />
                  <Button
                    type="submit"
                    isLoading={isSubmittingReview}
                    loadingText="Submitting..."
                    variant="copper"
                    size="sm"
                  >
                    Post Review
                  </Button>
                </form>
              ) : (
                <div className="p-4 rounded-2xl bg-[#D97A3D]/10 border border-[#D97A3D]/25 text-xs text-[#D97A3D] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                  Only attendees with a confirmed booking can write a review.
                </div>
              )
            ) : (
              <p className="text-xs text-emerald-200/70">
                Please{" "}
                <button
                  onClick={() => router.push("/login")}
                  className="text-[#D97A3D] font-bold hover:underline"
                >
                  log in
                </button>{" "}
                to post a review.
              </p>
            )}

            {/* Reviews List */}
            {reviews.length === 0 ? (
              <p className="text-xs text-emerald-200/50 italic py-4 text-center">
                No reviews yet. Be the first attendee to share feedback!
              </p>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-5 rounded-2xl bg-[#0F3D2E]/50 border border-emerald-500/15 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-[#F5F3ED]">
                        {rev.user?.name || "Attendee"}
                      </span>
                      <div className="flex items-center gap-1 text-[#D97A3D]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#D97A3D]" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-emerald-100/85">
                      {rev.comment}
                    </p>
                    <span className="text-[10px] text-emerald-300/40 block">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Booking Sidebar Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 bg-[#133E31]/80 p-6 rounded-3xl border border-emerald-500/20 space-y-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs text-emerald-300/60 font-semibold block">
                Price per Seat
              </span>
              <span className="text-3xl font-black text-[#D97A3D]">
                ${event.price.toFixed(2)}
              </span>
            </div>

            {/* Seat Availability Indicator */}
            <div className="p-4 rounded-2xl bg-[#0F3D2E]/60 border border-emerald-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-emerald-200/70 flex items-center gap-1">
                  <Users className="w-4 h-4 text-emerald-400" /> Available Seats
                </span>
                <span
                  className={
                    isSoldOut
                      ? "text-rose-400"
                      : event.availableSeats < 10
                      ? "text-[#D97A3D]"
                      : "text-emerald-400"
                  }
                >
                  {event.availableSeats} / {event.totalSeats}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#0F3D2E]/80 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    isSoldOut ? "bg-rose-500" : "bg-gradient-to-r from-[#059669] to-[#D97A3D]"
                  }`}
                  style={{
                    width: `${Math.round(
                      (event.availableSeats / event.totalSeats) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* Booking Action Button */}
            <Button
              disabled={isSoldOut || event.status === "CANCELLED" || event.status === "COMPLETED"}
              onClick={() => setBookingModalOpen(true)}
              variant="copper"
              className="w-full py-4 text-sm"
            >
              <Ticket className="w-5 h-5 mr-2" />
              {isSoldOut ? "Sold Out" : "Reserve Seats Now"}
            </Button>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Confirm Your Booking"
      >
        <div className="space-y-6">
          <div className="space-y-1">
            <h4 className="font-bold text-[#F5F3ED]">{event.title}</h4>
            <p className="text-xs text-emerald-200/70">{formattedDate} • {event.venue}</p>
          </div>

          {/* Seat Counter Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-emerald-200/70">
              Select Number of Seats
            </label>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-[#0F3D2E]/60 border border-emerald-500/20">
              <button
                onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                className="w-10 h-10 rounded-xl bg-[#133E31] flex items-center justify-center font-bold text-lg hover:bg-emerald-500/20 transition-colors"
              >
                <Minus className="w-4 h-4 text-[#F5F3ED]" />
              </button>
              <span className="text-2xl font-black text-[#D97A3D]">{seatCount}</span>
              <button
                onClick={() =>
                  setSeatCount(Math.min(event.availableSeats, seatCount + 1))
                }
                className="w-10 h-10 rounded-xl bg-[#133E31] flex items-center justify-center font-bold text-lg hover:bg-emerald-500/20 transition-colors"
              >
                <Plus className="w-4 h-4 text-[#F5F3ED]" />
              </button>
            </div>
          </div>

          {/* Price Summary */}
          <div className="p-4 rounded-2xl bg-[#D97A3D]/10 border border-[#D97A3D]/25 space-y-2 text-sm">
            <div className="flex justify-between text-emerald-100/80 text-xs">
              <span>Price per seat:</span>
              <span>${event.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-100/80 text-xs">
              <span>Seats:</span>
              <span>x {seatCount}</span>
            </div>
            <div className="pt-2 border-t border-[#D97A3D]/25 flex justify-between font-bold text-base text-[#F5F3ED]">
              <span>Total Price:</span>
              <span className="text-[#D97A3D]">${(event.price * seatCount).toFixed(2)}</span>
            </div>
          </div>

          <Button
            onClick={handleBookingSubmit}
            isLoading={isSubmittingBooking}
            loadingText="Reserving Seats..."
            variant="copper"
            className="w-full py-4"
          >
            Confirm &amp; Reserve
          </Button>
        </div>
      </Modal>
    </div>
  );
}
