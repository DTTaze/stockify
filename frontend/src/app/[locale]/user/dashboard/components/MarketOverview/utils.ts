export interface IndexDataStats {
  up: number;
  flat: number;
  down: number;
  ceil: number;
  floor: number;
  valueBillion: number;
}

export function getIndexStats(
  symbol: string,
  price: number,
  change: number,
  volume: number,
): IndexDataStats {
  const codeWeight = symbol.charCodeAt(0) + (symbol.charCodeAt(1) || 0);
  const total = symbol.includes("30")
    ? 30
    : symbol.includes("UPCOM")
      ? 450
      : 350;

  let up = 0;
  let flat = 0;
  let down = 0;
  let ceil = 0;
  let floor = 0;

  if (change > 0) {
    up = Math.round(total * (0.42 + change / 15 + (codeWeight % 10) / 100));
    down = Math.round(total * (0.28 - change / 25 + (codeWeight % 5) / 100));
    flat = total - up - down;
    ceil = Math.round(up * 0.05);
  } else if (change < 0) {
    down = Math.round(
      total * (0.46 + Math.abs(change) / 15 + (codeWeight % 10) / 100),
    );
    up = Math.round(
      total * (0.24 - Math.abs(change) / 25 + (codeWeight % 5) / 100),
    );
    flat = total - up - down;
    floor = Math.round(down * 0.04);
  } else {
    up = Math.round(total * 0.3);
    down = Math.round(total * 0.3);
    flat = total - up - down;
  }

  if (up < 0) {
    up = 0;
  }
  if (down < 0) {
    down = 0;
  }
  if (flat < 0) {
    flat = 0;
  }

  const valueBillion =
    Math.round(price * (volume / 1_000_000) * 0.024 * 1000) / 1000;

  return { up, flat, down, ceil, floor, valueBillion };
}

export function getPriceColor(change: number): string {
  if (change > 0) {
    return "text-emerald-600 dark:text-green-400";
  }
  if (change < 0) {
    return "text-red-600 dark:text-red-500";
  }
  return "text-amber-600 dark:text-yellow-400";
}

export function getBgColor(change: number): string {
  if (change > 0) {
    return "rgba(16, 185, 129, 0.1)";
  }
  if (change < 0) {
    return "rgba(239, 68, 68, 0.1)";
  }
  return "rgba(234, 179, 8, 0.1)";
}

export function formatHistoryForChart(
  history: Array<{
    close?: number;
    Close?: number;
    volume?: number;
    Volume?: number;
  }>,
  latestQuotePrice: number,
) {
  const hours = ["09h", "10h", "11h", "12h", "13h", "14h", "15h"];
  if (!history || history.length < 8) {
    return hours.map((h, i) => ({
      time: h,
      value: latestQuotePrice * (1 + (i - 3) * 0.001),
      volume: 10_000_000 * (1 + Math.sin(i) * 0.5),
    }));
  }
  const last8 = history.slice(-8);
  return hours.map((h, idx) => {
    const histItem = last8[idx] || last8[last8.length - 1];
    return {
      time: h,
      value: histItem.close || histItem.Close || latestQuotePrice,
      volume: histItem.volume || histItem.Volume || 0,
    };
  });
}
