import { ComponentProps, ReactNode } from "react";

import { Input } from "@/components/ui/Input";
import { cn } from "@/utils";

export interface InputCustomProps extends ComponentProps<"input"> {
  classNameWrapper?: string;
  classNameInput?: string;
  prefixIcon?: ReactNode;
  suffixIcon?: ReactNode;
}

export const InputCustom = (props: InputCustomProps) => {
  const {
    classNameWrapper,
    prefixIcon,
    suffixIcon,
    classNameInput,
    disabled,
    ...rest
  } = props;
  return (
    <div
      className={cn(
        "h-12 w-full rounded-lg",
        "border-2 border-gray-200",
        "flex items-center",
        "p-4",
        "focus-within:border-[#d4af37] focus-within:ring-2 focus-within:ring-[#d4af37]",
        "transition-all",
        disabled
          ? "cursor-not-allowed border-0 bg-neutral-50"
          : "bg-white dark:bg-black",
        classNameWrapper,
      )}
    >
      {prefixIcon}

      <Input className={classNameInput} disabled={disabled} {...rest} />

      {suffixIcon}
    </div>
  );
};
