import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-neon-pink/15 text-neon-pink",
        purple: "border-transparent bg-neon-purple/15 text-neon-purple",
        blue: "border-transparent bg-neon-blue/15 text-neon-blue",
        outline: "border-white/15 text-foreground",
        muted: "border-transparent bg-white/5 text-muted-foreground",
        success: "border-transparent bg-emerald-400/15 text-emerald-300",
        warning: "border-transparent bg-amber-400/15 text-amber-300",
        danger: "border-transparent bg-red-400/15 text-red-300",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
