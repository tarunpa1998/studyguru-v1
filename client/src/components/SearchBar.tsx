import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

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
          <div className="absolute left-4 top-3.5 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for scholarships, universities, countries..."
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="absolute right-14 top-3.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
              onClick={clearSearch}
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <button 
          type="submit" 
          className="absolute right-3 top-2 px-2 py-1.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
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
