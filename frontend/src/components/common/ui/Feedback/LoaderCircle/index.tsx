import { LoaderCircle } from "lucide-react";

import { cn } from "@/utils";

interface Props {
  classNameWrapper?: string;
  LoaderCircleWrapper?: string;
}

export const LoaderCircleCustom = (props: Props) => {
  const { classNameWrapper, LoaderCircleWrapper } = props;
  return (
    <div className={cn("h-full w-full", classNameWrapper)}>
      <div className="flex h-full w-full items-center justify-center">
        <LoaderCircle
          className={cn(
            "text-primary w-full animate-spin",
            LoaderCircleWrapper,
          )}
        />
      </div>
    </div>
  );
};
