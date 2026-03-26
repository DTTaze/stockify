import { Search } from "lucide-react";

interface StockSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const POPULAR_STOCKS = [
  { symbol: "VNM", name: "Vinamilk" },
  { symbol: "VCB", name: "Vietcombank" },
  { symbol: "VHM", name: "Vinhomes" },
  { symbol: "VIC", name: "Vingroup" },
  { symbol: "HPG", name: "Hòa Phát" },
  { symbol: "FPT", name: "FPT Corporation" },
  { symbol: "MSN", name: "Masan Group" },
  { symbol: "MWG", name: "Mobile World" },
];

export function StockSelector({ value, onChange }: StockSelectorProps) {
  return (
    <div className="relative">
      <Search className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[200px] appearance-none rounded-lg border border-gray-300 bg-white py-2 pr-4 pl-10 outline-none focus:border-transparent focus:ring-2 focus:ring-indigo-500"
      >
        {POPULAR_STOCKS.map((stock) => (
          <option key={stock.symbol} value={stock.symbol}>
            {stock.symbol} - {stock.name}
          </option>
        ))}
      </select>
    </div>
  );
}
