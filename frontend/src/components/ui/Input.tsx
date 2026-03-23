import { ComponentProps } from "react";

import { cn } from "@/utils/index";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "focus-visible:outline-none",
        "h-12 w-full",
        "disabled:bg-neutral-50",
        "text-base font-medium text-neutral-900",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
