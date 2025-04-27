import { useState } from "react";
import { useLocation } from "wouter";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: () => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) {
        onSearch();
      }
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearch}>
        <input
          type="search"
          placeholder="Search for scholarships, universities, countries..."
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button 
          type="submit" 
          className="absolute right-3 top-2 text-slate-400 hover:text-primary-600"
          aria-label="Search"
        >
          <Search className="h-6 w-6" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
