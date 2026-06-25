"use client";

import { useEffect, useState } from "react";

export function useWatchlistCategories() {
  const [watchlistCategories, setWatchlistCategories] = useState<string[]>([
    "Danh mục của tôi",
  ]);
  const [selectedCategory, setSelectedCategory] =
    useState<string>("Danh mục của tôi");
  const [categoryMappings, setCategoryMappings] = useState<
    Record<string, string[]>
  >({
    "Danh mục của tôi": [],
  });

  useEffect(() => {
    const savedCategories = localStorage.getItem(
      "stockify_watchlist_categories",
    );
    const savedSelected = localStorage.getItem(
      "stockify_selected_watchlist_category",
    );
    const savedMappings = localStorage.getItem("stockify_category_symbols");

    if (savedCategories) {
      try {
        setWatchlistCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error("Failed to parse watchlist categories", e);
      }
    }
    if (savedSelected) {
      setSelectedCategory(savedSelected);
    }
    if (savedMappings) {
      try {
        setCategoryMappings(JSON.parse(savedMappings));
      } catch (e) {
        console.error("Failed to parse category symbols", e);
      }
    }
  }, []);

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    localStorage.setItem("stockify_selected_watchlist_category", categoryName);
  };

  const handleCreateCategory = (categoryName: string) => {
    const name = categoryName.trim();
    if (!name) {
      return;
    }
    if (!watchlistCategories.includes(name)) {
      const updatedCats = [...watchlistCategories, name];
      setWatchlistCategories(updatedCats);
      localStorage.setItem(
        "stockify_watchlist_categories",
        JSON.stringify(updatedCats),
      );

      const updatedMappings = { ...categoryMappings, [name]: [] };
      setCategoryMappings(updatedMappings);
      localStorage.setItem(
        "stockify_category_symbols",
        JSON.stringify(updatedMappings),
      );
    }
    handleSelectCategory(name);
  };

  const handleRenameCategory = (oldName: string, newName: string) => {
    const trimmedNew = newName.trim();
    if (!trimmedNew || trimmedNew === oldName) {
      return;
    }

    if (watchlistCategories.includes(trimmedNew)) {
      alert("Tên danh mục đã tồn tại!");
      return;
    }

    const updatedCats = watchlistCategories.map((c) =>
      c === oldName ? trimmedNew : c,
    );
    setWatchlistCategories(updatedCats);
    localStorage.setItem(
      "stockify_watchlist_categories",
      JSON.stringify(updatedCats),
    );

    const updatedMappings = { ...categoryMappings };
    if (updatedMappings[oldName]) {
      updatedMappings[trimmedNew] = updatedMappings[oldName];
      delete updatedMappings[oldName];
    } else {
      updatedMappings[trimmedNew] = [];
    }
    setCategoryMappings(updatedMappings);
    localStorage.setItem(
      "stockify_category_symbols",
      JSON.stringify(updatedMappings),
    );

    if (selectedCategory === oldName) {
      handleSelectCategory(trimmedNew);
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    if (categoryName === "Danh mục của tôi") {
      alert("Không thể xóa danh mục mặc định!");
      return;
    }

    const updatedCats = watchlistCategories.filter((c) => c !== categoryName);
    setWatchlistCategories(updatedCats);
    localStorage.setItem(
      "stockify_watchlist_categories",
      JSON.stringify(updatedCats),
    );

    const updatedMappings = { ...categoryMappings };
    delete updatedMappings[categoryName];
    setCategoryMappings(updatedMappings);
    localStorage.setItem(
      "stockify_category_symbols",
      JSON.stringify(updatedMappings),
    );

    if (selectedCategory === categoryName) {
      handleSelectCategory("Danh mục của tôi");
    }
  };

  return {
    watchlistCategories,
    setWatchlistCategories,
    selectedCategory,
    setSelectedCategory,
    categoryMappings,
    setCategoryMappings,
    handleSelectCategory,
    handleCreateCategory,
    handleRenameCategory,
    handleDeleteCategory,
  };
}
