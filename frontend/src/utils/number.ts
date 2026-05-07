export function formatLargeNumber(value: number): string {
  return `${(value / 1000).toFixed(0)}K`;
}
