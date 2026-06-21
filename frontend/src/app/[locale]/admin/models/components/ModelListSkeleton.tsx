import { cn } from "@/utils";

export default function ModelListSekeleton() {
  return (
    <div className={cn("space-y-4")}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse",
            "rounded-xl border border-gray-200",
            "bg-white",
            "p-6",
            "shadow-sm",
          )}
        >
          <div className={cn("mb-4", "flex items-center justify-between")}>
            <div className={cn("flex items-center space-x-4")}>
              <div className={cn("h-14 w-14", "rounded-xl", "bg-gray-200")} />
              <div className={cn("space-y-2")}>
                <div className={cn("h-6 w-32", "rounded", "bg-gray-200")} />
                <div className={cn("h-4 w-24", "rounded", "bg-gray-200")} />
              </div>
            </div>

            <div className={cn("h-8 w-24", "rounded-full", "bg-gray-200")} />
          </div>

          <div
            className={cn("mb-4", "grid grid-cols-1 gap-4", "md:grid-cols-3")}
          >
            {[1, 2, 3].map((j) => (
              <div
                key={j}
                className={cn(
                  "rounded-xl border border-gray-100",
                  "bg-gray-50",
                  "p-4",
                )}
              >
                <div
                  className={cn("mb-2", "h-4 w-24", "rounded", "bg-gray-200")}
                />
                <div className={cn("h-8 w-16", "rounded", "bg-gray-200")} />
              </div>
            ))}
          </div>

          <div className={cn("flex items-center justify-between")}>
            <div className={cn("flex space-x-3")}>
              <div className={cn("h-10 w-24", "rounded-lg", "bg-gray-200")} />
              <div className={cn("h-10 w-24", "rounded-lg", "bg-gray-200")} />
              <div className={cn("h-10 w-24", "rounded-lg", "bg-gray-200")} />
            </div>

            <div className={cn("h-10 w-24", "rounded-lg", "bg-gray-200")} />
          </div>
        </div>
      ))}
    </div>
  );
}
