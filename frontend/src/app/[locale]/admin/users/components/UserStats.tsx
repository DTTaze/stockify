import { Skeleton } from "@/components/ui/Skeleton";

interface UserStatsProps {
  totalCount: number;
  activeCount: number;
  suspendedCount: number;
  isLoading?: boolean;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export function UserStats({
  totalCount,
  activeCount,
  suspendedCount,
  isLoading,
  activeFilter = "all",
  onFilterChange,
}: UserStatsProps) {
  const cards = [
    {
      id: "all",
      label: "Tổng User",
      value: totalCount,
      textClass: "text-brand-900 dark:text-neutral-50 font-semibold",
      activeClass:
        "border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/5 dark:bg-brand-950/5",
    },
    {
      id: "active",
      label: "Đang hoạt động",
      value: activeCount,
      textClass: "text-green-600 dark:text-success-400 font-semibold",
      activeClass:
        "border-green-500 ring-2 ring-green-500/20 bg-green-50/5 dark:bg-green-950/5",
    },
    {
      id: "suspended",
      label: "Bị khóa",
      value: suspendedCount,
      textClass: "text-red-600 dark:text-danger-400 font-semibold",
      activeClass:
        "border-red-500 ring-2 ring-red-500/20 bg-red-50/5 dark:bg-red-950/5",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => {
        const isActive = activeFilter === card.id;
        return (
          <div
            key={card.label}
            onClick={() => {
              if (onFilterChange) {
                onFilterChange(card.id);
              }
            }}
            className={`border-border bg-card text-card-foreground cursor-pointer rounded-xl border p-6 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md ${
              isActive
                ? card.activeClass
                : "hover:border-neutral-300 dark:hover:border-neutral-700"
            }`}
          >
            <div className="text-muted-foreground mb-2 text-sm">
              {card.label}
            </div>
            {isLoading ? (
              <Skeleton className="mt-1 h-9 w-20" />
            ) : (
              <div className={`text-3xl ${card.textClass}`}>{card.value}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
