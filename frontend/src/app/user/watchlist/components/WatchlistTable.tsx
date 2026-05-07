import { Star, Trash2, TrendingDown, TrendingUp } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { WatchlistQuoteItem } from "@/types/watchlist/watchlist.type";
import { cn } from "@/utils";

type WatchlistTableProps = {
  watchlist: WatchlistQuoteItem[];
  removingSymbol: string | null;
  onRemove: (symbol: string) => void;
};

export function WatchlistTable({
  watchlist,
  removingSymbol,
  onRemove,
}: WatchlistTableProps) {
  return (
    <Table
      classNameWrapper={cn(
        "overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm",
      )}
    >
      <TableHeader
        className={cn("from-brand-900 to-brand-700 bg-linear-to-r text-white")}
      >
        <TableRow className="border-none hover:bg-transparent">
          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Cổ phiếu
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Giá hiện tại
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Thay đổi
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Khối lượng
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Dự đoán
          </TableHead>

          <TableHead className="px-6 py-4 text-xs tracking-wider text-white uppercase">
            Hành động
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody className="bg-white">
        {watchlist.map((item) => (
          <TableRow key={item.id} className="hover:bg-blue-50">
            <TableCell className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <Star
                  className={cn(
                    "fill-accent-500 h-5 w-5",
                    "hover:text-accent-500",
                  )}
                />

                <div>
                  <div className="text-brand-900 text-sm">{item.symbol}</div>

                  <div className="text-xs text-gray-500">{item.name}</div>
                </div>
              </div>
            </TableCell>

            <TableCell className="px-6 py-4">
              <div className="text-brand-900 text-sm">
                {item.price.toLocaleString("vi-VN")} ₫
              </div>
            </TableCell>

            <TableCell className="px-6 py-4">
              <div
                className={cn(
                  "flex items-center space-x-2",
                  item.change >= 0 ? "text-green-600" : "text-red-600",
                )}
              >
                {item.change >= 0 ? (
                  <div className="rounded bg-green-100 p-1.5">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="rounded bg-red-100 p-1.5">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                )}

                <span className="text-sm">
                  {item.change >= 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </span>
              </div>
            </TableCell>

            <TableCell className="px-6 py-4 text-sm text-gray-600">
              {item.volume.toLocaleString("vi-VN")}
            </TableCell>

            <TableCell className="px-6 py-4">
              <span
                className={cn(
                  "rounded-full border px-3 py-1 text-xs",
                  item.prediction === "Tăng"
                    ? "border-green-200 bg-green-50 text-green-700"
                    : "border-red-200 bg-red-50 text-red-700",
                )}
              >
                {item.prediction}
              </span>
            </TableCell>

            <TableCell className="px-6 py-4">
              <ButtonCustom
                onClick={() => onRemove(item.symbol)}
                disabled={removingSymbol === item.symbol}
                bgColor="bg-transparent hover:bg-red-50"
                transition="transition-colors"
                className={cn(
                  "rounded-lg p-2 text-red-600",
                  removingSymbol === item.symbol && "opacity-50",
                )}
              >
                <Trash2 className="h-5 w-5" />
              </ButtonCustom>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
