import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, Menu, X, ChevronDown } from "lucide-react";
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
  const { data: menuItems = [] as MenuItem[] } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });

  // Close menu on location change
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
    <header className="sticky top-0 bg-white z-50 border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <span className="text-blue-600 font-bold text-xl">StudyGlobal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6">
            {menuItems.map((item) => (
              <div key={item.id}>
                {item.children && item.children.length > 0 ? (
                  <div className="relative">
                    <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                      {item.title}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                ) : (
                  <Link href={item.url}>
                    <span className={cn(
                      "text-gray-700 hover:text-blue-600 font-medium",
                      location === item.url && "text-blue-600"
                    )}>
                      {item.title}
                    </span>
                  </Link>
                )}
              </div>
            ))}
            
            <button onClick={toggleSearch} className="text-gray-700 hover:text-blue-600">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleSearch} className="p-2 text-gray-700 mr-2">
              <Search className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleMobileMenu} 
              className={cn(
                "p-2 rounded-full", 
                isMobileMenuOpen 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-100 text-gray-700"
              )}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40" 
            style={{ top: '64px' }}
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Menu Content */}
          <div className="fixed inset-x-0 bg-white z-50 shadow-lg" style={{ top: '64px' }}>
            <div className="container mx-auto p-4">
              {/* Close Button */}
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <span className="text-blue-600 font-bold">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-medium"
                >
                  Close Menu
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-3">
                {menuItems.map((item) => (
                  <div key={item.id} className="w-full">
                    {item.children && item.children.length > 0 ? (
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                        <button 
                          className="w-full text-left p-3 flex justify-between items-center"
                          onClick={() => toggleMobileDropdown(item.id)}
                        >
                          <span className="text-gray-800 font-medium">{item.title}</span>
                          <ChevronDown className={`h-4 w-4 transition-transform ${mobileDropdownOpen[item.id] ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {mobileDropdownOpen[item.id] && (
                          <div className="border-t border-gray-100">
                            {item.children.map(child => (
                              <Link key={child.id} href={child.url}>
                                <div className="p-3 hover:bg-gray-50 text-gray-700">
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
                            "p-3 rounded-lg font-medium text-center",
                            (item.title === "Home" || location === item.url)
                              ? "bg-blue-600 text-white" 
                              : "bg-white text-gray-800 border border-gray-200"
                          )}
                          style={{ 
                            color: (item.title === "Home" || location === item.url) ? "#ffffff" : "#1f2937",
                            backgroundColor: (item.title === "Home" || location === item.url) ? "#2563eb" : "#ffffff"
                          }}
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
        </>
      )}

      {/* Search panel */}
      {isSearchOpen && (
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="container mx-auto">
            <SearchBar onSearch={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;