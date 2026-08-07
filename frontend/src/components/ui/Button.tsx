import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    const variants = {
      primary: "bg-orange-600 text-white hover:bg-orange-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      secondary: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
      outline: "border-2 border-orange-600 text-orange-600 bg-transparent hover:bg-orange-50 font-bold",
      ghost: "bg-transparent hover:bg-orange-50 text-gray-700 hover:text-orange-600",
      danger: "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    };

    const sizes = {
      sm: "h-9 px-4 text-xs rounded-lg",
      md: "h-11 px-6 py-2 text-sm rounded-xl",
      lg: "h-14 px-10 text-base rounded-2xl font-bold tracking-wide",
      icon: "h-11 w-11 rounded-xl",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 disabled:pointer-events-none disabled:opacity-50",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
