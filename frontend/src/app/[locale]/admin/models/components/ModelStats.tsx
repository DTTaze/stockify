import { ModelItem } from "@/types/model-management";
import { cn } from "@/utils";

interface ModelStatsProps {
  models: (ModelItem & {
    metrics?: { accuracy?: number };
  })[];
  isSummaryLoading: boolean;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function ModelStats(props: ModelStatsProps) {
  const {
    models,
    isSummaryLoading,
    activeFilter = "all",
    onFilterChange,
  } = props;

  const totalCount = models.length;
  const runningCount = models.filter((m) => m.status === "running").length;
  const trainingCount = models.filter((m) => m.status === "training").length;

  const averageAccuracy =
    models.length > 0
      ? (
          models.reduce((sum, m) => sum + (m.metrics?.accuracy || 0), 0) /
          models.length
        ).toFixed(1) + "%"
      : "0.0%";

  const cards = [
    {
      id: "all",
      label: "Tổng Models",
      value: totalCount,
      textClass: "text-brand-900 font-semibold",
      activeClass: "border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/5",
      isFilter: true,
    },
    {
      id: "running",
      label: "Đang chạy",
      value: runningCount,
      textClass: "text-green-600 font-semibold",
      activeClass: "border-green-500 ring-2 ring-green-500/20 bg-green-50/5",
      isFilter: true,
    },
    {
      id: "training",
      label: "Đang train",
      value: trainingCount,
      textClass: "text-blue-600 font-semibold",
      activeClass: "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/5",
      isFilter: true,
    },
    {
      id: "accuracy",
      label: "Độ chính xác TB",
      value: averageAccuracy,
      textClass: "text-brand-900 font-semibold",
      activeClass: "",
      isFilter: false,
    },
  ];

  return (
    <div className={cn("grid grid-cols-1 gap-6", "md:grid-cols-4")}>
      {cards.map((card) => {
        const isActive = activeFilter === card.id;
        return (
          <div
            key={card.label}
            onClick={() => {
              if (card.isFilter && onFilterChange) {
                onFilterChange(card.id);
              }
            }}
            className={cn(
              "rounded-xl border border-gray-200",
              "bg-white",
              "p-6",
              "shadow-sm transition-all duration-300",
              card.isFilter &&
                "cursor-pointer hover:scale-[1.02] hover:shadow-md",
              isActive
                ? card.activeClass
                : card.isFilter && "hover:border-gray-300",
            )}
          >
            <div className={cn("mb-2", "text-sm text-gray-600")}>
              {card.label}
            </div>
            <div className={cn("text-3xl", card.textClass)}>
              {isSummaryLoading ? (
                <div
                  className={cn(
                    "h-9 w-16",
                    "animate-pulse",
                    "rounded bg-gray-200",
                  )}
                />
              ) : (
                card.value
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
