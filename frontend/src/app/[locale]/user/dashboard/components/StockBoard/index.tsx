/* eslint-disable max-lines */
import { Check, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";

import { BoardHeader } from "./BoardHeader";
import { BoardPagination } from "./BoardPagination";
import { BoardRow } from "./BoardRow";
import { ITEMS_PER_PAGE } from "./constants";
import { useStockBoard } from "./hooks/useStockBoard";
import { BoardSkeleton } from "./skeletons/BoardSkeleton";

interface StockBoardProps {
  selectedStock: string;
  onSelectStock: (symbol: string) => void;
}

export function StockBoard({ selectedStock, onSelectStock }: StockBoardProps) {
  const {
    activeTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    watchlistSymbols,
    trainedSymbols,
    totalItems,
    totalPages,
    boardRows,
    isLoading,
    handleTabChange,
    handleWatchlistToggle,
    addToWatchlist,
    removeFromWatchlist,
    t,
    watchlistCategories,
    selectedCategory,
    handleSelectCategory,
    handleCreateCategory,
    selectedVn30SubIndex,
    setSelectedVn30SubIndex,
    selectedIcbCode,
    setSelectedIcbCode,
    selectedIcbIndustryName,
    icbIndustries,
  } = useStockBoard();

  const [isWatchlistDropdownOpen, setIsWatchlistDropdownOpen] = useState(false);
  const [isVn30DropdownOpen, setIsVn30DropdownOpen] = useState(false);
  const [isCpNganhDropdownOpen, setIsCpNganhDropdownOpen] = useState(false);
  const [icbSearchQuery, setIcbSearchQuery] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleToggleWatchlistDropdown = () => {
    setIsVn30DropdownOpen(false);
    setIsCpNganhDropdownOpen(false);
    if (activeTab !== "WATCHLIST") {
      handleTabChange("WATCHLIST");
      setIsWatchlistDropdownOpen(true);
    } else {
      setIsWatchlistDropdownOpen(!isWatchlistDropdownOpen);
    }
  };

  const handleToggleVn30Dropdown = () => {
    setIsWatchlistDropdownOpen(false);
    setIsCpNganhDropdownOpen(false);
    if (activeTab !== "VN30") {
      handleTabChange("VN30");
      setIsVn30DropdownOpen(true);
    } else {
      setIsVn30DropdownOpen(!isVn30DropdownOpen);
    }
  };

  const handleToggleCpNganhDropdown = () => {
    setIsWatchlistDropdownOpen(false);
    setIsVn30DropdownOpen(false);
    if (activeTab !== "CP_NGANH") {
      handleTabChange("CP_NGANH");
      setIsCpNganhDropdownOpen(true);
    } else {
      setIsCpNganhDropdownOpen(!isCpNganhDropdownOpen);
    }
  };

  const filteredIndustries = useMemo(() => {
    return icbIndustries
      .filter((ind) => ind.stockCount > 0)
      .filter((ind) => {
        const q = icbSearchQuery.toLowerCase().trim();
        return (
          ind.name.toLowerCase().includes(q) ||
          ind.code.toLowerCase().includes(q)
        );
      });
  }, [icbIndustries, icbSearchQuery]);

  const handleCreateNewCategory = () => {
    const trimmed = newCategoryName.trim();
    if (!trimmed) {
      setValidationError("Tên danh mục không được để trống");
      return;
    }
    handleCreateCategory(trimmed);
    setNewCategoryName("");
    setValidationError("");
    setIsWatchlistDropdownOpen(false);
  };

  const isMutatingWatchlist =
    addToWatchlist.isPending || removeFromWatchlist.isPending;

  return (
    <div className="relative flex h-full flex-col overflow-visible rounded-xl border border-gray-200 bg-white shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/60">
      {/* Board Navigation */}
      <BoardHeader
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleTabChange={handleTabChange}
        selectedCategory={selectedCategory}
        onToggleWatchlistDropdown={handleToggleWatchlistDropdown}
        selectedVn30SubIndex={selectedVn30SubIndex}
        onToggleVn30Dropdown={handleToggleVn30Dropdown}
        selectedIcbIndustryName={selectedIcbIndustryName}
        onToggleCpNganhDropdown={handleToggleCpNganhDropdown}
      />

      {/* Watchlist Dropdown Menu Overlay */}
      {isWatchlistDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setIsWatchlistDropdownOpen(false);
              setValidationError("");
            }}
          />
          <div
            className="absolute top-[38px] left-[20px] z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 text-slate-800 shadow-xl sm:left-[190px] dark:border-slate-800 dark:bg-[#1a1b25] dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Dropdown Items (List of Categories) */}
            <div className="scrollbar-thin mb-2 max-h-40 space-y-1 overflow-y-auto">
              {watchlistCategories.map((cat) => {
                const isCatSelected = cat === selectedCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => {
                      handleSelectCategory(cat);
                      setIsWatchlistDropdownOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                      isCatSelected
                        ? "bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "text-slate-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{cat}</span>
                    {isCatSelected && (
                      <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-2 border-t border-gray-200 dark:border-slate-800" />

            {/* Create Category Input & Button */}
            <div className="mt-1.5 flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Tạo danh mục mới"
                value={newCategoryName}
                onChange={(e) => {
                  setNewCategoryName(e.target.value);
                  if (e.target.value.trim()) {
                    setValidationError("");
                  }
                }}
                className={`h-7 flex-1 rounded border bg-gray-100 px-2 text-xs text-slate-800 placeholder-slate-400 outline-none dark:bg-[#0f1015] dark:text-white dark:placeholder-slate-500 ${
                  validationError
                    ? "animate-shake border-red-500 focus:ring-1 focus:ring-red-500"
                    : "dark:border-slate-850 border-gray-300 focus:ring-1 focus:ring-blue-500"
                }`}
              />
              <button
                onClick={handleCreateNewCategory}
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded bg-blue-600 text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Validation Warning */}
            {validationError && (
              <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold text-red-500 select-none">
                <span>⚠️</span>
                <span>{validationError}</span>
              </div>
            )}
          </div>
        </>
      )}

      {/* VN30 Sub-Indices Dropdown Menu Overlay */}
      {isVn30DropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setIsVn30DropdownOpen(false)}
          />
          <div
            className="absolute top-[38px] left-[60px] z-50 grid w-[360px] grid-cols-2 gap-x-6 gap-y-1.5 rounded-lg border border-gray-200 bg-white p-4 text-slate-800 shadow-xl sm:left-[350px] dark:border-slate-800 dark:bg-[#1a1b25] dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Column 1 */}
            <div className="space-y-1">
              {["VN30", "VN100", "VNMID", "VNSML"].map((idx) => {
                const isIdxSelected = idx === selectedVn30SubIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVn30SubIndex(idx);
                      setIsVn30DropdownOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                      isIdxSelected
                        ? "bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "text-slate-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{idx}</span>
                    {isIdxSelected && (
                      <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="space-y-1">
              {["VNSI", "VNX50", "VNXALL", "VNALL"].map((idx) => {
                const isIdxSelected = idx === selectedVn30SubIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedVn30SubIndex(idx);
                      setIsVn30DropdownOpen(false);
                    }}
                    className={`flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs font-semibold transition-all ${
                      isIdxSelected
                        ? "bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "text-slate-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    }`}
                  >
                    <span>{idx}</span>
                    {isIdxSelected && (
                      <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* CP_NGANH Dropdown Menu Overlay */}
      {isCpNganhDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => {
              setIsCpNganhDropdownOpen(false);
              setIcbSearchQuery("");
            }}
          />
          <div
            className="absolute top-[38px] left-[100px] z-50 w-72 rounded-lg border border-gray-200 bg-white p-3 text-slate-800 shadow-xl sm:left-[510px] dark:border-slate-800 dark:bg-[#1a1b25] dark:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Box */}
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Tìm nhanh ngành..."
                value={icbSearchQuery}
                onChange={(e) => setIcbSearchQuery(e.target.value)}
                className="dark:border-slate-850 h-8 w-full rounded border border-gray-300 bg-gray-50 px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:bg-[#0f1015] dark:text-white dark:placeholder-slate-500"
              />
            </div>
            {/* Industries list */}
            <div className="scrollbar-thin max-h-60 space-y-1 overflow-y-auto pr-1">
              {filteredIndustries.length === 0 ? (
                <div className="py-6 text-center text-xs text-gray-400">
                  Không tìm thấy ngành
                </div>
              ) : (
                filteredIndustries.map((ind) => {
                  const isSelected = ind.code === selectedIcbCode;
                  return (
                    <button
                      key={ind.code}
                      onClick={() => {
                        setSelectedIcbCode(ind.code);
                        setIsCpNganhDropdownOpen(false);
                        setIcbSearchQuery("");
                      }}
                      className={`flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-all ${
                        isSelected
                          ? "bg-blue-50 font-bold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                          : "text-slate-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
                      }`}
                      style={{
                        paddingLeft: `${Math.max(10, ind.level * 10)}px`,
                      }}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        {ind.level > 1 && (
                          <span className="text-gray-300 select-none">↳</span>
                        )}
                        <span className="truncate">{ind.name}</span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <span className="rounded bg-gray-100 px-1 py-0.5 text-[9px] font-bold text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          {ind.stockCount} mã
                        </span>
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Grid Scroll Area */}
      <Table
        classNameWrapper="no-scrollbar min-h-[300px] flex-1 overflow-auto"
        className="w-full border-collapse text-left select-none"
      >
        <TableHeader>
          {/* Row 1 Header */}
          <TableRow className="dark:text-slate-405 border-b border-gray-200 bg-gray-50/70 text-center text-[12.5px] font-bold tracking-wider text-gray-500 uppercase dark:border-slate-800 dark:bg-slate-900/60">
            <TableHead
              rowSpan={2}
              className="w-8 border-r border-gray-200 p-2 dark:border-slate-800"
            >
              ★
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[70px] border-r border-gray-200 p-2 text-left dark:border-slate-800"
            >
              {t("boardStocksHeader")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[45px] border-r border-gray-200 p-2 text-fuchsia-600 dark:border-slate-800 dark:text-fuchsia-400"
            >
              {t("ceil")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[45px] border-r border-gray-200 p-2 text-cyan-600 dark:border-slate-800 dark:text-cyan-400"
            >
              {t("floor")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[45px] border-r border-gray-200 p-2 text-amber-500 dark:border-slate-800 dark:text-yellow-400"
            >
              {t("ref")}
            </TableHead>
            <TableHead
              colSpan={6}
              className="border-r border-gray-200 p-1 text-gray-700 dark:border-slate-800 dark:text-slate-300"
            >
              {t("buyer")}
            </TableHead>
            <TableHead
              colSpan={3}
              className="border-r border-gray-200 p-1 text-gray-700 dark:border-slate-800 dark:text-slate-300"
            >
              {t("match")}
            </TableHead>
            <TableHead
              colSpan={6}
              className="border-r border-gray-200 p-1 text-gray-700 dark:border-slate-800 dark:text-slate-300"
            >
              {t("seller")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[75px] border-r border-gray-200 p-2 text-right dark:border-slate-800"
            >
              {t("totalVol")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="min-w-[50px] border-r border-gray-200 p-2 text-right text-green-600 dark:border-slate-800 dark:text-green-400"
            >
              {t("high")}
            </TableHead>
            <TableHead
              rowSpan={2}
              className="dark:text-rose-455 min-w-[50px] p-2 text-right text-rose-600"
            >
              {t("low")}
            </TableHead>
          </TableRow>
          {/* Row 2 Header (Bid / Match / Ask subcolumns) */}
          <TableRow className="text-gray-550 dark:text-slate-505 border-b border-gray-200 bg-gray-50/40 text-right text-[11.5px] font-extrabold uppercase dark:border-slate-800 dark:bg-slate-900/40">
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price3")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty3")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price2")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty2")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price1")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200 p-1 dark:border-slate-800">
              {t("qty1")}
            </TableHead>
            <TableHead className="text-gray-650 min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40 dark:text-slate-300">
              {t("price")}
            </TableHead>
            <TableHead className="text-gray-655 min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40 dark:text-slate-300">
              {t("quantity")}
            </TableHead>
            <TableHead className="text-gray-655 border-r border-gray-200 p-1 dark:border-slate-800 dark:text-slate-300">
              {t("changePercent")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price1")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty1")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price2")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("qty2")}
            </TableHead>
            <TableHead className="min-w-[42px] border-r border-gray-200/40 p-1 dark:border-slate-800/40">
              {t("price3")}
            </TableHead>
            <TableHead className="min-w-[45px] border-r border-gray-200 p-1 dark:border-slate-800">
              {t("qty3")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-gray-150 divide-y font-mono text-[13.5px] dark:divide-slate-900">
          {isLoading ? (
            <BoardSkeleton rowsCount={ITEMS_PER_PAGE} />
          ) : boardRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={24}
                className="dark:text-slate-505 py-12 text-center text-xs font-semibold text-gray-400 uppercase"
              >
                {t("noStocksFound")}
              </TableCell>
            </TableRow>
          ) : (
            boardRows.map((row) => (
              <BoardRow
                key={row.symbol}
                row={row}
                isSelected={selectedStock === row.symbol}
                onSelectStock={onSelectStock}
                watchlistSymbols={watchlistSymbols}
                trainedSymbols={trainedSymbols}
                handleWatchlistToggle={handleWatchlistToggle}
                isMutatingWatchlist={isMutatingWatchlist}
              />
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <BoardPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
}
