import { AlertCircle, Calendar, Check, RefreshCw } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { Badge } from "@/components/ui/Badge";
import { TableCell, TableRow } from "@/components/ui/Table";
import { StockStatus } from "@/constants/stock";
import { cn } from "@/utils";
import { formatDateTime } from "@/utils/string";

type Stock = {
  symbol: string;
  last_updated: string;
  total_records: number;
  status: StockStatus;
};

type RowProps = {
  stock: Stock;
  isBusy: boolean;
  updatingStock: string | null;
  onUpdateStock: (symbol: string) => void;
};

export function DataManagementTableRow({
  stock,
  isBusy,
  updatingStock,
  onUpdateStock,
}: RowProps) {
  return (
    <TableRow>
      <TableCell className={cn("p-4", "font-medium")}>{stock.symbol}</TableCell>

      <TableCell>
        <div
          className={cn(
            "flex items-center gap-2",
            "text-sm",
            "text-muted-foreground",
          )}
        >
          <Calendar className="h-4 w-4" />
          {formatDateTime(stock.last_updated)}
        </div>
      </TableCell>

      <TableCell>{stock.total_records.toLocaleString()}</TableCell>

      <TableCell>
        {stock.status === StockStatus.UPDATED ? (
          <StatusSuccess />
        ) : (
          <StatusWarning />
        )}
      </TableCell>

      <TableCell>
        <ButtonCustom
          size="sm"
          disabled={isBusy}
          onClick={() => onUpdateStock(stock.symbol)}
          className={cn(
            "flex items-center space-x-2",
            "rounded-lg",
            "px-4 py-2",
            "bg-brand-900 text-white",
            "shadow-md",
            "transition-all",
            "hover:bg-brand-700",
            "disabled:opacity-50",
          )}
        >
          <RefreshCw
            className={cn(
              "h-4 w-4",
              updatingStock === stock.symbol && "animate-spin",
            )}
          />
          Cập nhật
        </ButtonCustom>
      </TableCell>
    </TableRow>
  );
}

function StatusSuccess() {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1", "border-green-500 text-green-600")}
    >
      <Check className="h-3 w-3" />
      Mới nhất
    </Badge>
  );
}

function StatusWarning() {
  return (
    <Badge
      variant="outline"
      className={cn("gap-1", "border-orange-500 text-orange-600")}
    >
      <AlertCircle className="h-3 w-3" />
      Cần cập nhật
    </Badge>
  );
}
