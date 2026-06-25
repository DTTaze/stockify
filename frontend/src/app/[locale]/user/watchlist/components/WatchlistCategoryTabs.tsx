"use client";

import { Check, Edit2, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";

import { useLanguage } from "@/providers/LanguageProvider";
import { cn } from "@/utils";

type WatchlistCategoryTabsProps = {
  watchlistCategories: string[];
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
  onCreateCategory: (name: string) => void;
  onRenameCategory: (oldName: string, newName: string) => void;
  onDeleteCategory: (name: string) => void;
};

export function WatchlistCategoryTabs({
  watchlistCategories,
  selectedCategory,
  onSelectCategory,
  onCreateCategory,
  onRenameCategory,
  onDeleteCategory,
}: WatchlistCategoryTabsProps) {
  const { t } = useLanguage();
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [isRenameMode, setIsRenameMode] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [renameCatName, setRenameCatName] = useState("");

  return (
    <div className="border-border flex flex-wrap items-center gap-2 border-b pb-3">
      {watchlistCategories.map((cat) => {
        const isActive = cat === selectedCategory;
        const isDefault = cat === "Danh mục của tôi";

        return (
          <div
            key={cat}
            className={cn(
              "group relative flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-semibold transition-all",
              isActive
                ? "bg-brand-900 border-brand-900 text-white shadow-sm"
                : "bg-card text-muted-foreground hover:bg-muted/80 hover:text-foreground border-border",
            )}
          >
            {isRenameMode && isActive ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onRenameCategory(cat, renameCatName);
                  setIsRenameMode(false);
                }}
                className="flex items-center gap-1.5"
              >
                <input
                  type="text"
                  value={renameCatName}
                  onChange={(e) => setRenameCatName(e.target.value)}
                  className="bg-background text-foreground border-border focus:ring-accent-500 h-6 w-28 rounded border px-1.5 text-xs font-normal outline-none focus:ring-1"
                  autoFocus
                />
                <button
                  type="submit"
                  className="hover:text-accent-300 cursor-pointer text-white transition-colors"
                >
                  <Check className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsRenameMode(false)}
                  className="cursor-pointer text-white transition-colors hover:text-red-300"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
            ) : (
              <>
                <button
                  onClick={() => onSelectCategory(cat)}
                  className="cursor-pointer text-left font-medium outline-none"
                >
                  {cat}
                </button>

                {isActive && !isDefault && (
                  <button
                    onClick={() => {
                      setRenameCatName(cat);
                      setIsRenameMode(true);
                    }}
                    className="ml-1 cursor-pointer text-white/70 transition-colors hover:text-white"
                    title={t("watchlist.renameCategory") || "Đổi tên"}
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {!isDefault && (
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          t("watchlist.confirmDeleteCategory") ||
                            `Bạn có chắc chắn muốn xóa danh mục "${cat}"?`,
                        )
                      ) {
                        onDeleteCategory(cat);
                      }
                    }}
                    className={cn(
                      "ml-1 cursor-pointer rounded p-0.5 transition-colors",
                      isActive
                        ? "text-white/70 hover:bg-white/10 hover:text-red-200"
                        : "text-muted-foreground/60 hover:bg-muted hover:text-red-500",
                    )}
                    title={t("watchlist.deleteCategory") || "Xóa"}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </>
            )}
          </div>
        );
      })}

      {isCreateMode ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const name = newCatName.trim();
            if (name) {
              onCreateCategory(name);
              setNewCatName("");
              setIsCreateMode(false);
            }
          }}
          className="border-border bg-card flex items-center gap-1.5 rounded-lg border p-1.5"
        >
          <input
            type="text"
            placeholder={
              t("watchlist.inputCategoryName") || "Nhập tên danh mục..."
            }
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            className="bg-background text-foreground focus:ring-accent-500 border-border h-8 w-40 rounded border px-2 text-xs outline-none focus:ring-1"
            autoFocus
          />
          <button
            type="submit"
            className="bg-brand-900 hover:bg-brand-700 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-white transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsCreateMode(false);
              setNewCatName("");
            }}
            className="bg-muted text-muted-foreground hover:bg-muted/80 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsCreateMode(true)}
          className="border-muted-foreground/45 hover:border-brand-900 hover:text-brand-900 text-muted-foreground flex cursor-pointer items-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-sm font-semibold transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>{t("watchlist.createCategory") || "Tạo danh mục mới"}</span>
        </button>
      )}
    </div>
  );
}
