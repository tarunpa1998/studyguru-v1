import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";

interface MenuItem {
  id: number;
  title: string;
  url: string;
  children: {
    id: number;
    title: string;
    url: string;
  }[];
}

const Navbar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{[key: number]: boolean}>({});

  // Fetch menu data
  const { data: menuItems = [], isLoading } = useQuery({
    queryKey: ['/api/menu'],
  });

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const toggleMobileDropdown = (id: number) => {
    setMobileDropdownOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <header className="sticky top-0 bg-white shadow-sm z-50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-primary-600 font-bold text-2xl">StudyGlobal</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item: MenuItem) => (
              item.children && item.children.length > 0 ? (
                <div key={item.id} className="relative group">
                  <button 
                    className={cn(
                      "text-slate-700 hover:text-primary-600 font-medium inline-flex items-center",
                      location.startsWith(item.url) && "text-primary-600"
                    )}
                  >
                    {item.title}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 hidden group-hover:block">
                    {item.children.map((child) => (
                      <Link 
                        key={child.id} 
                        href={child.url}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary-50"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link 
                  key={item.id} 
                  href={item.url}
                  className={cn(
                    "text-slate-700 hover:text-primary-600 font-medium",
                    location === item.url && "text-primary-600"
                  )}
                >
                  {item.title}
                </Link>
              )
            ))}
          </div>

          {/* Search Icon and Mobile Menu Button */}
          <div className="flex items-center">
            <button 
              className="p-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none" 
              aria-label="Search"
              onClick={toggleSearch}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <button 
              className="md:hidden p-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none" 
              aria-label="Menu" 
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn("md:hidden", isMobileMenuOpen ? "block" : "hidden")}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item: MenuItem) => (
              item.children && item.children.length > 0 ? (
                <div key={item.id} className="mobile-dropdown">
                  <button 
                    className="w-full text-left flex justify-between items-center px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-primary-50"
                    onClick={() => toggleMobileDropdown(item.id)}
                  >
                    {item.title}
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d={mobileDropdownOpen[item.id] ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} 
                      />
                    </svg>
                  </button>
                  <div className={cn("pl-4", mobileDropdownOpen[item.id] ? "block" : "hidden")}>
                    {item.children.map((child) => (
                      <Link 
                        key={child.id} 
                        href={child.url}
                        className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-primary-50"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.id}
                  href={item.url}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:bg-primary-50"
                >
                  {item.title}
                </Link>
              )
            ))}
          </div>
        </div>
      </nav>

      {/* Search Bar */}
      <div className={cn("bg-white border-t border-slate-100 py-3 px-4 shadow-inner", isSearchOpen ? "block" : "hidden")}>
        <div className="container mx-auto">
          <SearchBar onSearch={() => setIsSearchOpen(false)} />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
