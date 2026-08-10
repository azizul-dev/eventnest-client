import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  variant?: "copper" | "emerald" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  isLoading = false,
  loadingText,
  variant = "copper",
  size = "md",
  children,
  className = "",
  disabled,
  ...props
}) => {
  let baseStyles =
    "inline-flex items-center justify-center font-bold rounded-full transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none";

  let sizeStyles = "px-6 py-3 text-sm";
  if (size === "sm") sizeStyles = "px-4 py-2 text-xs";
  if (size === "lg") sizeStyles = "px-8 py-4 text-base";

  let variantStyles = "";
  switch (variant) {
    case "copper":
      variantStyles =
        "bg-gradient-to-r from-[#D97A3D] to-[#C86B4A] text-white shadow-lg shadow-[#D97A3D]/25 hover:shadow-[#D97A3D]/40 hover:scale-[1.02] active:scale-[0.98]";
      break;
    case "emerald":
      variantStyles =
        "bg-gradient-to-r from-[#065F46] via-[#059669] to-[#10B981] text-white shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98]";
      break;
    case "outline":
      variantStyles =
        "border border-emerald-400/30 text-[#F5F3ED] hover:bg-emerald-500/20";
      break;
    case "ghost":
      variantStyles =
        "text-[#F5F3ED] hover:bg-emerald-500/20";
      break;
    case "danger":
      variantStyles =
        "bg-rose-500 text-white shadow-md hover:bg-rose-600 active:scale-[0.98]";
      break;
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-white" />
          <span>{loadingText || "Processing..."}</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
