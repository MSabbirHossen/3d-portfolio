import React, { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1">
        <input
          type={type}
          ref={ref}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          className={cn(
            "flex h-10 w-full rounded-lg border border-slate-700/80 bg-slate-900/60 px-3.5 py-2 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-rose-500/80 focus-visible:ring-rose-400",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
