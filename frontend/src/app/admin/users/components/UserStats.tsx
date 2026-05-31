interface UserStatsProps {
  totalCount: number;
  activeCount: number;
  suspendedCount: number;
}

export function UserStats({
  totalCount,
  activeCount,
  suspendedCount,
}: UserStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Tổng User</div>
        <div className="text-brand-900 text-3xl">{totalCount}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Đang hoạt động</div>
        <div className="text-3xl text-green-600">{activeCount}</div>
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-2 text-sm text-gray-600">Bị khóa</div>
        <div className="text-3xl text-red-600">{suspendedCount}</div>
      </div>
    </div>
  );
}
