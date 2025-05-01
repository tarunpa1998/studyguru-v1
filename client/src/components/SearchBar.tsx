import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="relative max-w-3xl mx-auto"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <div className="absolute left-4 top-3.5 text-slate-400">
            <Search className="h-5 w-5" />
          </div>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search for scholarships, universities, countries..."
            className="w-full pl-12 pr-12 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <motion.button
              type="button"
              className="absolute right-14 top-3.5 text-slate-400 hover:text-slate-600"
              aria-label="Clear search"
              onClick={clearSearch}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-5 w-5" />
            </motion.button>
          )}
        </div>
        <motion.button 
          type="submit" 
          className="absolute right-3 top-2 px-2 py-1.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors duration-200"
          aria-label="Search"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!searchQuery.trim()}
        >
          <span className="text-sm font-medium">Search</span>
        </motion.button>
      </form>
      
      {/* Suggestion UI could be implemented here */}
      <div className="mt-1">
        {/* Common search suggestions could go here */}
      </div>
    </motion.div>
  );
};

export default SearchBar;
