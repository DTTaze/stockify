import { VariantProps } from "class-variance-authority";
import { Loader2Icon } from "lucide-react";
import { ComponentProps, ReactNode } from "react";

import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/utils";

export interface Props
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  height?: string;
  width?: string;
  bgColor?: string;
  transition?: string;
  loading?: boolean;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

export const ButtonCustom = (props: Props) => {
  const {
    children,
    className,
    height = "h-10",
    width,
    bgColor,
    loading,
    prefixIcon,
    suffixIcon,
    transition = "transition-all duration-300 hover:scale-[1.02]",
    ...rest
  } = props;
  return (
    <Button
      className={cn(
        "cursor-pointer p-3",
        "flex items-center",
        height,
        width,
        bgColor,
        transition,
        className,
      )}
      {...rest}
    >
      {loading ? (
        <Loader2Icon className="animate-spin" />
      ) : (
        <>
          {prefixIcon}
          {children}
          {suffixIcon}
        </>
      )}
    </Button>
  );
};
