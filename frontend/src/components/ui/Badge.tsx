import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils/index";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none transition-[color,background-color,box-shadow] overflow-hidden focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary-500 text-neutral-50 [a&]:hover:bg-primary-600 focus-visible:ring-2 focus-visible:ring-primary-300/60",
        secondary:
          "border-neutral-200 bg-neutral-100 text-neutral-700 [a&]:hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-300/60",
        destructive:
          "border-transparent bg-danger-500 text-neutral-50 [a&]:hover:bg-danger-600 focus-visible:ring-2 focus-visible:ring-danger-300/60",
        outline:
          "bg-transparent text-neutral-900 border-neutral-300 [a&]:hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-300/60 dark:text-white",
        success:
          "border-success-300 bg-success-100 text-success-600 [a&]:hover:bg-success-600 focus-visible:ring-2 focus-visible:ring-success-300/60 dark:text-success-900 dark:bg-success-900 dark:text-success-500 dark:border-transparent",
        info: "border-transparent bg-info-500 text-neutral-50 [a&]:hover:bg-info-600 focus-visible:ring-2 focus-visible:ring-info-300/60",
        warning:
          "border-warning-300 bg-warning-100 text-warning-600 [a&]:hover:bg-warning-600 focus-visible:ring-2 focus-visible:ring-warning-300/60 dark:bg-warning-900 dark:text-warning-500",
        neutral:
          "border-neutral-300 bg-neutral-100 text-neutral-800 [a&]:hover:bg-neutral-200 focus-visible:ring-2 focus-visible:ring-neutral-300/60 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
