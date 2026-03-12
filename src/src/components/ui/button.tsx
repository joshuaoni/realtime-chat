import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
          "bg-violet-600 text-white shadow-lg shadow-violet-500/20 hover:bg-violet-500 hover:shadow-violet-500/30",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";