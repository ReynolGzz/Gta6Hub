import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Lightweight styled native <select>. Native controls keep filter/sort UIs
 * fast, accessible and zero-JS where possible.
 */
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <div className="relative inline-flex w-full">
      <select
        ref={ref}
        className={cn(
          "h-10 w-full appearance-none rounded-xl border border-white/10 bg-white/5 px-4 pr-9 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-neon-pink/40 focus-visible:border-neon-pink/40 [&>option]:bg-[#0c0a12]",
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
);
Select.displayName = "Select";

export { Select };
