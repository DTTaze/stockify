import { Card, CardContent } from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { StockStatus } from "@/constants/stock";
import { cn } from "@/utils";

import { DataManagementTableFilters } from "./DataManagementTableFilters";
import { DataManagementTablePagination } from "./DataManagementTablePagination";
import { DataManagementTableRow } from "./DataManagementTableRow";

type Stock = {
  symbol: string;
  last_updated?: string;
  lastUpdated?: string;
  total_records?: number;
  totalRecords?: number;
  status: StockStatus;
};

type Props = {
  stocks: Stock[];
  isLoading: boolean;
  isBusy: boolean;
  updatingStock: string | null;
  onUpdateStock: (symbol: string) => void;
  search: string;
  onSearchChange: (search: string) => void;
  statusFilter: "all" | "updated" | "needs_update";
  onStatusChange: (status: "all" | "updated" | "needs_update") => void;
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  limit: number;
  onLimitChange: (limit: number) => void;
};

export function DataManagementTable(props: Props) {
  const {
    stocks,
    isLoading,
    isBusy,
    updatingStock,
    onUpdateStock,
    search,
    onSearchChange,
    statusFilter,
    onStatusChange,
    total,
    currentPage,
    totalPages,
    onPageChange,
    limit,
    onLimitChange,
  } = props;

  return (
    <Card className={cn("rounded-xl border", "py-0", "shadow-sm")}>
      <CardContent className={cn("p-0")}>
        <DataManagementTableFilters
          search={search}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          onStatusChange={onStatusChange}
          total={total}
        />

        <div className={cn("overflow-x-auto")}>
          <Table>
            <TableHeader>
              <TableRow
                className={cn(
                  "bg-brand-900",
                  "bg-linear-to-r from-[bg-brand-600] to-[bg-brand-950]",
                  "text-white",
                  "hover:bg-brand-900",
                )}
              >
                <TableHead
                  className={cn("p-4", "text-sm uppercase", "text-white")}
                >
                  Cổ phiếu
                </TableHead>

                <TableHead className={cn("text-sm uppercase", "text-white")}>
                  Cập nhật lần cuối
                </TableHead>

                <TableHead className={cn("text-sm uppercase", "text-white")}>
                  Số lượng records
                </TableHead>

                <TableHead className={cn("text-sm uppercase", "text-white")}>
                  Trạng thái
                </TableHead>

                <TableHead className={cn("text-sm uppercase", "text-white")}>
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stocks.map((stock) => (
                <DataManagementTableRow
                  key={stock.symbol}
                  stock={stock}
                  isBusy={isBusy}
                  updatingStock={updatingStock}
                  onUpdateStock={onUpdateStock}
                />
              ))}

              {!stocks.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className={cn(
                      "h-24",
                      "text-center",
                      "text-muted-foreground",
                    )}
                  >
                    {isLoading
                      ? "Đang tải dữ liệu..."
                      : "Không có dữ liệu để hiển thị."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <DataManagementTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          limit={limit}
          onLimitChange={onLimitChange}
        />
      </CardContent>
    </Card>
  );
}
