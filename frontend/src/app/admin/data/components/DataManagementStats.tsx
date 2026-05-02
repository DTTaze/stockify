import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

type Props = {
  totalStocks: string | number;
  updated: string | number;
  needsUpdate: string | number;
  totalRecords: string | number;
};

export function DataManagementStats(props: Props) {
  const { totalStocks, updated, needsUpdate, totalRecords } = props;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
      <StatCard title="Tổng cổ phiếu" value={totalStocks} />
      <StatCard title="Đã cập nhật" value={updated} color="text-green-600" />
      <StatCard
        title="Cần cập nhật"
        value={needsUpdate}
        color="text-orange-600"
      />
      <StatCard title="Tổng records" value={totalRecords} />
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
    <Card className="gap-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className={`text-3xl font-bold ${color}`}>{value}</div>
      </CardContent>
    </Card>
  );
}
