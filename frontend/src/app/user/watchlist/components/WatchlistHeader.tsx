import { InputSearch } from "@/components/common/form/input/InputCustom/InputSearch";
import { cn } from "@/utils";

type WatchlistHeaderProps = {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
};

export function WatchlistHeader(props: WatchlistHeaderProps) {
  const { searchTerm, onSearchTermChange } = props;

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        "sm:flex-row sm:items-center sm:justify-between",
      )}
    >
      <div>
        <h1 className={cn("mb-2 text-3xl", "text-brand-900")}>
          Watchlist của tôi
        </h1>

        <p className="text-gray-600">Theo dõi các cổ phiếu yêu thích của bạn</p>
      </div>

      <div className={cn("flex items-center", "space-x-3")}>
        <InputSearch
          placeholder="Tìm cổ phiếu..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          classNameWrapper="w-64"
        />
      </div>
    </div>
  );
}
