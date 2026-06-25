"use client";

import { ListPlus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ButtonCustom } from "@/components/common/form/button";
import { useLanguage } from "@/providers/LanguageProvider";
import { useQueryStockCompanies } from "@/queries/stocks/QueryHooksStocks";

type WatchlistAddStockProps = {
  onAddStockToCategory: (symbol: string) => void;
  onAddStockToCategories: (symbol: string, categories: string[]) => void;
  watchlistCategories: string[];
  selectedCategory: string;
};

export function WatchlistAddStock({
  onAddStockToCategory,
  onAddStockToCategories,
  watchlistCategories,
  selectedCategory,
}: WatchlistAddStockProps) {
  const { t } = useLanguage();
  const [addStockInput, setAddStockInput] = useState("");
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null);
  const [checkedCategories, setCheckedCategories] = useState<
    Record<string, boolean>
  >({});

  const { data: stockCompanies = [] } = useQueryStockCompanies();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showModal) {
        setShowModal(false);
        setSelectedSymbol(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showModal]);

  const filteredCompanies = useMemo(() => {
    const q = addStockInput.trim().toLowerCase();
    if (!q) {
      return [];
    }
    return stockCompanies
      .filter(
        (c) =>
          c.symbol.toLowerCase().includes(q) ||
          c.organizationName.toLowerCase().includes(q),
      )
      .slice(0, 10);
  }, [stockCompanies, addStockInput]);

  const handleSelectAutocomplete = (symbol: string) => {
    const upperSymbol = symbol.trim().toUpperCase();
    if (
      selectedCategory === "Danh mục của tôi" &&
      watchlistCategories.length > 1
    ) {
      setSelectedSymbol(upperSymbol);
      const initialChecked: Record<string, boolean> = {};
      watchlistCategories.forEach((cat) => {
        initialChecked[cat] = cat === "Danh mục của tôi";
      });
      setCheckedCategories(initialChecked);
      setShowModal(true);
    } else {
      onAddStockToCategory(upperSymbol);
    }
    setAddStockInput("");
    setShowAutocomplete(false);
  };

  const handleConfirmAdd = () => {
    if (!selectedSymbol) {
      return;
    }
    const selected = Object.entries(checkedCategories)
      .filter(([_, checked]) => checked)
      .map(([cat]) => cat);

    onAddStockToCategories(selectedSymbol, selected);
    setShowModal(false);
    setSelectedSymbol(null);
  };

  return (
    <div className="relative flex w-full flex-col gap-1 lg:w-72">
      <span className="text-muted-foreground text-xs font-semibold">
        {t("watchlist.addStock") || "Thêm cổ phiếu"}
      </span>
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <input
          type="text"
          placeholder={
            t("watchlist.addStockPlaceholder") || "Mã (ví dụ: VCB)..."
          }
          value={addStockInput}
          onChange={(e) => {
            setAddStockInput(e.target.value);
            setShowAutocomplete(true);
          }}
          onFocus={() => setShowAutocomplete(true)}
          className="border-input bg-card text-foreground placeholder:text-muted-foreground focus:border-accent-500 h-12 w-full rounded-lg border-2 py-2.5 pr-8 pl-9 text-sm transition-colors outline-none"
        />
        {addStockInput && (
          <button
            onClick={() => {
              setAddStockInput("");
              setShowAutocomplete(false);
            }}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showAutocomplete && filteredCompanies.length > 0 && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowAutocomplete(false)}
          />
          <ul className="border-border bg-card divide-border absolute top-full left-0 z-20 mt-1 max-h-60 w-full divide-y overflow-y-auto rounded-lg border shadow-lg">
            {filteredCompanies.map((c) => (
              <li key={c.symbol}>
                <button
                  onClick={() => {
                    handleSelectAutocomplete(c.symbol);
                  }}
                  className="hover:bg-muted/80 text-foreground flex w-full cursor-pointer items-center justify-between px-4 py-2.5 text-left text-sm transition-colors"
                >
                  <span className="text-brand-800 dark:text-brand-300 font-bold">
                    {c.symbol}
                  </span>
                  <span className="text-muted-foreground max-w-[170px] truncate text-right text-xs">
                    {c.organizationName}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {showModal && selectedSymbol && (
        <div
          onClick={() => {
            setShowModal(false);
            setSelectedSymbol(null);
          }}
          className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="border-border bg-card text-card-foreground w-full max-w-md scale-100 transform overflow-hidden rounded-xl border p-6 shadow-xl transition-all"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-accent-500 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 dark:bg-neutral-900/50">
                  <ListPlus className="h-5 w-5" />
                </div>
                <h3 className="text-lg leading-6 font-semibold text-neutral-900 dark:text-neutral-50">
                  {t("watchlist.addStockToMultiple")}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedSymbol(null);
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1.5 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Instruction */}
            <div className="mt-4">
              <p className="text-muted-foreground text-sm leading-relaxed">
                {t("watchlist.selectTargetCategories", {
                  symbol: selectedSymbol,
                })}
              </p>
            </div>

            {/* Checklist */}
            <div className="mt-4 max-h-48 space-y-2.5 overflow-y-auto py-1">
              {watchlistCategories.map((cat) => {
                const isDefault = cat === "Danh mục của tôi";
                return (
                  <label
                    key={cat}
                    className={`border-border flex items-center space-x-3 rounded-lg border p-3 transition-colors ${
                      isDefault
                        ? "bg-muted/40 cursor-not-allowed opacity-80"
                        : "hover:bg-muted/50 cursor-pointer"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checkedCategories[cat] || false}
                      disabled={isDefault}
                      onChange={(e) => {
                        if (!isDefault) {
                          setCheckedCategories((prev) => ({
                            ...prev,
                            [cat]: e.target.checked,
                          }));
                        }
                      }}
                      className="border-input text-accent-500 focus:ring-accent-500/50 h-4 w-4 cursor-pointer rounded border transition-colors focus:ring-2"
                    />
                    <span className="text-foreground text-sm font-medium">
                      {cat}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end space-x-3">
              <ButtonCustom
                onClick={() => {
                  setShowModal(false);
                  setSelectedSymbol(null);
                }}
                variant="outline"
                height="h-9"
                className="cursor-pointer"
              >
                {t("watchlist.cancel")}
              </ButtonCustom>
              <ButtonCustom
                onClick={handleConfirmAdd}
                variant="default"
                height="h-9"
                className="cursor-pointer"
              >
                {t("watchlist.confirm")}
              </ButtonCustom>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
