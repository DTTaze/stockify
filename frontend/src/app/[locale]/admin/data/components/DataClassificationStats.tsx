import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { cn } from "@/utils";

type Props = {
  summary:
    | {
        HOSE: number;
        VN30: number;
        HNX: number;
        UPCOM: number;
        CW: number;
        ETF: number;
        FU_INDEX: number;
      }
    | undefined;
};

export function DataClassificationStats({ summary }: Props) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-7">
      <StatCard title="HOSE" value={summary?.HOSE ?? "--"} />
      <StatCard
        title="VN30"
        value={summary?.VN30 ?? "--"}
        color="text-purple-600"
      />
      <StatCard title="HNX" value={summary?.HNX ?? "--"} />
      <StatCard title="UPCOM" value={summary?.UPCOM ?? "--"} />
      <StatCard title="CW" value={summary?.CW ?? "--"} color="text-amber-600" />
      <StatCard
        title="ETF"
        value={summary?.ETF ?? "--"}
        color="text-blue-600"
      />
      <StatCard
        title="FU INDEX"
        value={summary?.FU_INDEX ?? "--"}
        color="text-red-600"
      />
    </div>
  );
}

function StatCard({
  title,
  value,
  color = "text-brand-900",
}: {
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <Card className={cn("gap-0", "shadow-sm", "bg-white")}>
      <CardHeader className={cn("pb-2", "pt-4", "px-4")}>
        <CardTitle
          className={cn(
            "text-xs font-semibold tracking-wider uppercase",
            "text-gray-500",
          )}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className={cn("text-xl font-bold", color)}>{value}</div>
      </CardContent>
    </Card>
  );
}
