import { Skeleton } from "@/components/ui/Skeleton";

interface UserStatsProps {
  totalCount: number;
  activeCount: number;
  suspendedCount: number;
  isLoading?: boolean;
}

export function UserStats({
  totalCount,
  activeCount,
  suspendedCount,
  isLoading,
}: UserStatsProps) {
  const cards = [
    { label: "Tổng User", value: totalCount, textClass: "text-brand-900" },
    {
      label: "Đang hoạt động",
      value: activeCount,
      textClass: "text-green-600",
    },
    { label: "Bị khóa", value: suspendedCount, textClass: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-2 text-sm text-gray-600">{card.label}</div>
          {isLoading ? (
            <Skeleton className="mt-1 h-9 w-20" />
          ) : (
            <div className={`text-3xl ${card.textClass}`}>{card.value}</div>
          )}
        </div>
      ))}
    </div>
  );
}
