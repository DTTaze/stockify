import { X } from "lucide-react";

import { ButtonCustom } from "@/components/common/form/button";
import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import { MarketListItem } from "@/types/watchlist/watchlist.type";

export type AddStockModalProps = {
  addSearchTerm: string;
  setAddSearchTerm: (v: string) => void;
  onClose: () => void;
  filteredCompanies: MarketListItem[];
  watchlistSymbols: Set<string>;
  handleAdd: (symbol: string) => void;
  isPending: boolean;
};

export function AddStockModal({
  addSearchTerm,
  setAddSearchTerm,
  onClose,
  filteredCompanies,
  watchlistSymbols,
  handleAdd,
  isPending,
}: AddStockModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-brand-900 text-xl">Thêm cổ phiếu</h2>
          <ButtonCustom
            onClick={onClose}
            bgColor="bg-transparent hover:bg-gray-100"
            transition="transition-colors"
            height="h-auto"
            className="rounded-lg p-1 text-gray-400"
          >
            <X className="h-5 w-5" />
          </ButtonCustom>
        </div>
        <InputSearch
          placeholder="Tìm mã cổ phiếu..."
          value={addSearchTerm}
          onChange={(e) => setAddSearchTerm(e.target.value)}
          autoFocus
          classNameWrapper="mb-4"
        />
        <div className="max-h-72 overflow-y-auto">
          {filteredCompanies.slice(0, 50).map((company) => {
            const inWatchlist = watchlistSymbols.has(company.symbol);
            return (
              <div
                key={company.symbol}
                className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <div>
                  <div className="text-brand-900 text-sm font-medium">
                    {company.symbol}
                  </div>
                  <div className="text-xs text-gray-500">
                    {company.description}
                  </div>
                </div>
                <ButtonCustom
                  onClick={() => handleAdd(company.symbol)}
                  disabled={inWatchlist || isPending}
                  bgColor="bg-brand-900 hover:bg-brand-700"
                  transition="transition-colors"
                  height="h-auto"
                  className="rounded-lg px-3 py-1 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {inWatchlist ? "Đã thêm" : "Thêm"}
                </ButtonCustom>
              </div>
            );
          })}
          {filteredCompanies.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              Không tìm thấy cổ phiếu
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
