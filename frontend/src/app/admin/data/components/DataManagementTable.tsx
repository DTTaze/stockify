import { AlertCircle, Calendar, Check, RefreshCw } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { Badge } from "@/components/ui/Badge";
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
import { formatDateTime } from "@/utils/string";

type Stock = {
  symbol: string;
  last_updated: string;
  total_records: number;
  status: StockStatus;
};

type Props = {
  stocks: Stock[];
  isLoading: boolean;
  isBusy: boolean;
  updatingStock: string | null;
  onUpdateStock: (symbol: string) => void;
};

export function DataManagementTable(props: Props) {
  const { stocks, isLoading, isBusy, updatingStock, onUpdateStock } = props;

  return (
    <Card className="rounded-xl border py-0 shadow-sm">
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-brand-900 hover:bg-brand-900 bg-linear-to-r from-[bg-brand-600] to-[bg-brand-950] text-white">
                <TableHead className="p-4 text-sm text-white uppercase">
                  Cổ phiếu
                </TableHead>
                <TableHead className="text-sm text-white uppercase">
                  Cập nhật lần cuối
                </TableHead>
                <TableHead className="text-sm text-white uppercase">
                  Số lượng records
                </TableHead>
                <TableHead className="text-sm text-white uppercase">
                  Trạng thái
                </TableHead>
                <TableHead className="text-sm text-white uppercase">
                  Hành động
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.symbol}>
                  <TableCell className="p-4 font-medium">
                    {stock.symbol}
                  </TableCell>

                  <TableCell>
                    <div className="text-muted-foreground flex items-center gap-2 text-sm">
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
                      className="bg-brand-900 hover:bg-brand-700 flex items-center space-x-2 rounded-lg px-4 py-2 text-white shadow-md transition-all disabled:opacity-50"
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${
                          updatingStock === stock.symbol ? "animate-spin" : ""
                        }`}
                      />
                      Cập nhật
                    </ButtonCustom>
                  </TableCell>
                </TableRow>
              ))}

              {!stocks.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-muted-foreground h-24 text-center"
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
      </CardContent>
    </Card>
  );
}

function StatusSuccess() {
  return (
    <Badge variant="outline" className="gap-1 border-green-500 text-green-600">
      <Check className="h-3 w-3" />
      Mới nhất
    </Badge>
  );
}

function StatusWarning() {
  return (
    <Badge
      variant="outline"
      className="gap-1 border-orange-500 text-orange-600"
    >
      <AlertCircle className="h-3 w-3" />
      Cần cập nhật
    </Badge>
  );
}
