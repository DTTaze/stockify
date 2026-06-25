export const BOARD_TABS = [
  {
    id: "WATCHLIST",
    label: "Danh mục của tôi",
    translationKey: "boardTabWatchlist",
    hasChevron: true,
  },
  {
    id: "AI",
    label: "Cổ phiếu AI",
    translationKey: "boardTabAi",
    hasChevron: false,
  },
  {
    id: "VN30",
    label: "VN30",
    translationKey: "boardTabVn30",
    hasChevron: true,
  },
  {
    id: "HNX30",
    label: "HNX30",
    translationKey: "boardTabHnx30",
    hasChevron: false,
  },
  {
    id: "HOSE",
    label: "HOSE",
    translationKey: "boardTabHose",
    hasChevron: true,
  },
  { id: "HNX", label: "HNX", translationKey: "boardTabHnx", hasChevron: true },
  {
    id: "CP_NGANH",
    label: "CP Ngành",
    translationKey: "boardTabCpNganh",
    hasChevron: true,
  },
] as const;

export const ITEMS_PER_PAGE = 12;
