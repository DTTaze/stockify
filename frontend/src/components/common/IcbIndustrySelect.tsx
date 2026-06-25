import { Check, ChevronDown, Folder, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { cn } from "@/utils";

type Industry = {
  code: string;
  name: string;
  enName?: string;
  level: number;
  stockCount: number;
};

type Props = {
  industries: Industry[];
  activeIcbCode: string;
  onChange: (code: string) => void;
  isLoading?: boolean;
};

const LEVEL_BADGE_STYLES: Record<number, string> = {
  1: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20",
  2: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20",
  3: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20",
};

const DEFAULT_LEVEL_STYLE =
  "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/10 dark:text-purple-400 dark:border-purple-900/20";

const INDENT_STYLES: Record<number, string> = {
  2: "pl-6 border-l border-border ml-2",
  3: "pl-10 border-l border-border ml-4",
  4: "pl-14 border-l border-border ml-6",
};

const DEFAULT_INDENT_STYLE = "pl-3";

export function IcbIndustrySelect({
  industries,
  activeIcbCode,
  onChange,
  isLoading = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevelFilter, setSelectedLevelFilter] = useState<string>("all");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close popover when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Find active industry
  const activeIndustry = useMemo(() => {
    return industries.find((ind) => ind.code === activeIcbCode);
  }, [industries, activeIcbCode]);

  // Filter industries locally for search and level
  const filteredIndustries = useMemo(() => {
    return industries.filter((ind) => {
      const matchesSearch =
        ind.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ind.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ind.enName &&
          ind.enName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesLevel =
        selectedLevelFilter === "all" ||
        ind.level.toString() === selectedLevelFilter;
      return matchesSearch && matchesLevel;
    });
  }, [industries, searchQuery, selectedLevelFilter]);

  // Style helper for level badges
  const getLevelBadgeStyles = (level: number) => {
    return LEVEL_BADGE_STYLES[level] || DEFAULT_LEVEL_STYLE;
  };

  const getIndentStyles = (level: number) => {
    return INDENT_STYLES[level] || DEFAULT_INDENT_STYLE;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {/* Popover trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading || industries.length === 0}
        className={cn(
          "border-input bg-background text-foreground hover:border-brand-700 focus:border-brand-700 focus:ring-brand-700 dark:hover:border-brand-400 dark:focus:border-brand-400 dark:focus:ring-brand-400 flex w-full cursor-pointer items-center justify-between rounded-lg border px-3 py-2 text-left text-sm shadow-xs transition-all focus:ring-1 disabled:opacity-50",
          isOpen &&
            "border-brand-700 ring-brand-700 dark:border-brand-400 dark:ring-brand-400 ring-1",
        )}
      >
        {isLoading ? (
          <span className="text-muted-foreground">Đang tải ngành...</span>
        ) : industries.length === 0 ? (
          <span className="text-muted-foreground">Không có dữ liệu ngành.</span>
        ) : activeIndustry ? (
          <div className="mr-2 flex items-center gap-2 overflow-hidden">
            <Badge
              variant="outline"
              className={cn(
                "px-1.5 py-0 text-[10px] font-semibold whitespace-nowrap",
                getLevelBadgeStyles(activeIndustry.level),
              )}
            >
              L{activeIndustry.level}
            </Badge>
            <span className="text-foreground truncate font-semibold">
              {activeIndustry.name}
            </span>
            <span className="text-muted-foreground shrink-0 text-xs">
              ({activeIndustry.stockCount} mã)
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">Chọn ngành ICB...</span>
        )}
        <ChevronDown
          className={cn(
            "text-muted-foreground h-4 w-4 shrink-0 transition-transform duration-200",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Popover content */}
      {isOpen && (
        <div className="animate-in fade-in slide-in-from-top-1 border-border bg-popover text-popover-foreground absolute right-0 left-0 z-50 mt-1 max-h-96 w-full overflow-hidden rounded-xl border p-2 shadow-xl duration-150">
          <div className="flex flex-col gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Tìm nhanh tên hoặc mã ngành..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-input bg-background focus-visible:ring-brand-700 dark:focus-visible:ring-brand-400 h-9 pr-8 pl-9 text-sm"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="bg-muted hover:bg-muted/80 absolute top-1/2 right-2.5 flex h-4 w-4 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full"
                >
                  <X className="text-muted-foreground h-3 w-3" />
                </button>
              )}
            </div>

            {/* Level Quick Filters */}
            <div className="border-border flex flex-wrap gap-1 border-b pb-2">
              {[
                { label: "Tất cả", value: "all" },
                { label: "Cấp 1", value: "1" },
                { label: "Cấp 2", value: "2" },
                { label: "Cấp 3", value: "3" },
                { label: "Cấp 4", value: "4" },
              ].map((pill) => (
                <button
                  key={pill.value}
                  type="button"
                  onClick={() => setSelectedLevelFilter(pill.value)}
                  className={cn(
                    "cursor-pointer rounded-md border px-2 py-0.5 text-xs font-semibold transition-all",
                    selectedLevelFilter === pill.value
                      ? "border-brand-900 bg-brand-900 dark:border-brand-700 dark:bg-brand-700 text-white"
                      : "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* List Option Items */}
            <div className="flex max-h-60 flex-col overflow-y-auto pr-1">
              {filteredIndustries.length === 0 ? (
                <div className="text-muted-foreground py-6 text-center text-xs">
                  Không tìm thấy ngành phù hợp bộ lọc.
                </div>
              ) : (
                filteredIndustries.map((ind) => {
                  const isSelected = ind.code === activeIcbCode;
                  return (
                    <button
                      key={ind.code}
                      type="button"
                      onClick={() => {
                        onChange(ind.code);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "group hover:bg-muted/60 flex w-full cursor-pointer items-center justify-between rounded-lg py-2 pr-2 text-left text-sm transition-all",
                        getIndentStyles(ind.level),
                        isSelected &&
                          "bg-brand-50 hover:bg-brand-50/80 dark:bg-brand-500/10 dark:hover:bg-brand-500/15",
                      )}
                    >
                      <div className="mr-2 flex items-center gap-2 overflow-hidden">
                        {ind.level === 1 ? (
                          <Folder className="text-brand-800 dark:text-brand-300 h-4 w-4 shrink-0" />
                        ) : (
                          <span className="text-muted-foreground/60 select-none">
                            ↳
                          </span>
                        )}
                        <span
                          className={cn(
                            "text-foreground truncate font-medium",
                            ind.level === 1 && "font-bold",
                            isSelected &&
                              "text-brand-800 dark:text-brand-300 font-bold",
                          )}
                        >
                          {ind.name}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-[10px]">
                          ({ind.code})
                        </span>
                      </div>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                          {ind.stockCount} mã
                        </span>
                        {isSelected && (
                          <Check className="text-brand-800 dark:text-brand-300 h-4 w-4 shrink-0 font-bold" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
