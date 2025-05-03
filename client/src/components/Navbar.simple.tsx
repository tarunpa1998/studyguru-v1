import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu as MenuIcon, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Fetch menu data from API
  const { data: menuItems = [] as MenuItem[] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Add scroll detection for navbar shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header 
      className={cn(
        "sticky top-0 bg-white z-50 transition-shadow duration-300",
        isScrolled || isMobileMenuOpen || isSearchOpen ? "shadow-md" : "shadow-sm"
      )}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <span className="text-primary-600 font-bold text-xl md:text-2xl">
                StudyGlobal
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <div key={item.id} className="relative group">
                {item.children && item.children.length > 0 ? (
                  <>
                    <button className="text-slate-700 hover:text-primary-600 font-medium flex items-center">
                      {item.title}
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </button>
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="py-2">
                        {item.children.map((child) => (
                          <Link key={child.id} href={child.url}>
                            <div className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600">
                              {child.title}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link href={item.url}>
                    <div className={cn(
                      "text-slate-700 hover:text-primary-600 font-medium",
                      location === item.url && "text-primary-600"
                    )}>
                      {item.title}
                    </div>
                  </Link>
                )}
              </div>
            ))}

            <button 
              className="p-2 rounded-full bg-slate-100 text-slate-700" 
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <button 
              className="p-2 rounded-full bg-slate-100 text-slate-700 mx-1" 
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              className={cn(
                "p-2 rounded-full mx-1", 
                isMobileMenuOpen 
                  ? "bg-primary-600 text-white" 
                  : "bg-slate-100 text-slate-700"
              )}
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Background Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40 md:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
            style={{ top: "64px" }}
          />
        )}

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div 
            ref={menuRef}
            className="fixed inset-x-0 bg-white shadow-lg z-50 md:hidden overflow-y-auto max-h-[80vh]"
            style={{ top: "64px" }}
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-bold text-primary-600">Menu</h2>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-primary-600 text-white px-3 py-1 rounded font-medium flex items-center"
                >
                  Close <X className="h-4 w-4 ml-1" />
                </button>
              </div>
              
              <div className="space-y-2">
                {menuItems.map((item) => (
                  <div key={item.id} className="mb-2">
                    {item.children && item.children.length > 0 ? (
                      <div className="bg-white rounded-lg shadow border border-slate-200">
                        <button 
                          className="w-full text-left flex justify-between items-center p-3 text-slate-800 font-medium"
                          onClick={() => toggleMobileDropdown(item.id)}
                        >
                          {item.title}
                          <ChevronDown className={cn(
                            "h-5 w-5 transition-transform", 
                            mobileDropdownOpen[item.id] && "rotate-180"
                          )} />
                        </button>
                        
                        {mobileDropdownOpen[item.id] && (
                          <div className="border-t border-slate-100">
                            {item.children.map((child) => (
                              <Link key={child.id} href={child.url}>
                                <div className="block p-3 text-slate-700 hover:bg-slate-50 border-b border-slate-100 last:border-b-0">
                                  {child.title}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <div 
                          className={cn(
                            "block p-3 rounded-lg font-semibold", 
                            item.title === "Home" || location === item.url 
                              ? "bg-primary-600 text-white" 
                              : "bg-white text-slate-800 border border-slate-200 shadow-sm"
                          )}
                        >
                          {item.title}
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-white border-t border-slate-100 p-4 shadow-inner">
          <div className="container mx-auto">
            <SearchBar onSearch={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;