import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Focus the input when the search bar appears
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) {
        onSearch();
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className={cn("absolute left-4 top-3.5", isDark ? "text-muted-foreground" : "text-slate-400")}>
            <Search className="h-5 w-5" />
          </div>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for scholarships, universities, countries..."
            className={cn(
              "w-full pl-12 pr-12 py-3 rounded-xl border shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
              isDark 
                ? "bg-card border-border text-foreground placeholder:text-muted-foreground" 
                : "border-slate-200 text-slate-900 placeholder:text-slate-400"
            )}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className={cn(
                "absolute right-14 top-3.5 hover:text-slate-600",
                isDark ? "text-muted-foreground hover:text-foreground" : "text-slate-400"
              )}
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className={cn(
            "absolute right-3 top-2 px-2 py-1.5 text-white rounded-xl transition-colors duration-200",
            isDark ? "bg-primary hover:bg-primary/90" : "bg-primary-600 hover:bg-primary-700"
          )}
          aria-label="Search"
          disabled={!searchQuery.trim()}
        >
          <span className="text-sm font-medium">Search</span>
        </button>
      </form>
      
      {/* Suggestion UI could be implemented here */}
      <div className="mt-1">
        {/* Common search suggestions could go here */}
      </div>
    </div>
  );
};

export default SearchBar;

