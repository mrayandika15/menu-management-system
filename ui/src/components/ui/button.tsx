import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  {
    variants: {
      variant: {
        primary:
          "bg-[#253BFF] text-white hover:bg-[#1f30cc] focus-visible:outline-[#253BFF]",
        secondary:
          "bg-[#1D2939] text-white hover:bg-[#111827] focus-visible:outline-[#1D2939]",
        outline:
          "border border-slate-300 text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400",
        ghost:
          "text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400",
        tonal:
          "bg-[#E4F6CB] text-[#101828] hover:bg-[#d7edb5] focus-visible:outline-[#9FF443]",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-6",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };

