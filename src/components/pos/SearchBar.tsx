import { Search, ScanBarcode } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onScanClick: () => void;
}

export function SearchBar({ value, onChange, onScanClick }: SearchBarProps) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
      </div>
      <button 
        onClick={onScanClick}
        className="h-12 px-4 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-secondary flex items-center gap-2 transition-colors"
      >
        <ScanBarcode className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Scan</span>
      </button>
    </div>
  );
}
