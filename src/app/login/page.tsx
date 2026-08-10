"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Ticket, Mail, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back to EventNest!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#133E31] rounded-3xl p-8 border border-emerald-500/25 shadow-2xl shadow-black/30 space-y-6 relative overflow-hidden"
      >
        {/* Copper top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#059669] via-[#D97A3D] to-[#C86B4A]" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#065F46] via-[#059669] to-[#D97A3D] mx-auto flex items-center justify-center shadow-lg shadow-[#D97A3D]/20">
            <Ticket className="w-6 h-6 text-white transform -rotate-12" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#F5F3ED]">
            Welcome Back
          </h1>
          <p className="text-xs text-emerald-200/70">
            Sign in to manage your bookings and access live events
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/70">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-300/50 absolute left-3.5 top-3.5" />
              <input
                {...register("email")}
                type="email"
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-[#0F3D2E]/80 border border-emerald-500/30 focus:outline-none focus:border-[#D97A3D] text-[#F5F3ED] placeholder-emerald-200/40"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-emerald-200/70">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-300/50 absolute left-3.5 top-3.5" />
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm bg-[#0F3D2E]/80 border border-emerald-500/30 focus:outline-none focus:border-[#D97A3D] text-[#F5F3ED] placeholder-emerald-200/40"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-rose-400 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            isLoading={isSubmitting}
            loadingText="Signing In..."
            variant="copper"
            className="w-full py-3.5"
          >
            Sign In
          </Button>
        </form>

        <p className="text-xs text-center text-emerald-200/70">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-bold text-[#D97A3D] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
