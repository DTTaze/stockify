export enum PredictionTrend {
  UP = "Tăng",
  DOWN = "Giảm",
}

export const MARKET_INDICES = [
  { label: "VN-INDEX", symbol: "vnindex" },
  { label: "VN30", symbol: "vn30" },
  { label: "HNX-INDEX", symbol: "hnxindex" },
  { label: "UPCOM", symbol: "UPCOMINDEX" },
];

export enum StockStatus {
  UPDATED = "updated",
  NEEDS_UPDATE = "needs_update",
}

export enum ModelStatus {
  RUNNING = "running",
  STOPPED = "stopped",
  TRAINING = "training",
}
