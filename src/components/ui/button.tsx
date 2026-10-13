import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none select-none rounded-lg focus-visible:ring-offset-slate-950";

    const variantStyles = {
      primary:
        "bg-sky-500 text-slate-950 hover:bg-sky-400 focus-visible:ring-sky-400 shadow-sm shadow-sky-500/20 active:scale-[0.98]",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-400 active:scale-[0.98]",
      outline:
        "border border-slate-700/80 bg-slate-900/60 text-slate-200 hover:bg-slate-800 hover:border-slate-600 focus-visible:ring-slate-400 backdrop-blur-sm active:scale-[0.98]",
      ghost:
        "text-slate-300 hover:bg-slate-800/60 hover:text-slate-100 focus-visible:ring-slate-400",
      danger:
        "bg-rose-600 text-white hover:bg-rose-500 focus-visible:ring-rose-400 shadow-sm shadow-rose-600/20 active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-8 px-3 text-xs gap-1.5",
      md: "h-10 px-4 text-sm gap-2",
      lg: "h-12 px-6 text-base gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
