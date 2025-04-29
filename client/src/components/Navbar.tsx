import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, X, Search, ChevronDown, ChevronUp } from "lucide-react";
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

const navVariants = {
  hidden: { 
    opacity: 0,
    y: -10,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -8 },
  visible: { opacity: 1, y: 0 }
};

const mobileMenuVariants = {
  hidden: { 
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren"
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  }
};

const Navbar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{[key: number]: boolean}>({});

  // No more fallback menu - we only use the MongoDB data
  
  // Fetch menu data from MongoDB
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
            <Link href="/">
              <motion.span 
                className="text-primary-600 font-bold text-2xl"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                StudyGlobal
              </motion.span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <motion.div 
            className="hidden md:flex items-center space-x-8"
            initial="hidden"
            animate="visible"
            variants={navVariants}
          >
            {menuItems.map((item: MenuItem) => (
              item.children && item.children.length > 0 ? (
                <motion.div key={item.id} className="relative group" variants={itemVariants}>
                  <button 
                    className={cn(
                      "text-slate-700 hover:text-primary-600 font-medium inline-flex items-center",
                      location.startsWith(item.url) && "text-primary-600"
                    )}
                  >
                    {item.title}
                    <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100">
                    {item.children.map((child) => (
                      <Link 
                        key={child.id} 
                        href={child.url}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link 
                    href={item.url}
                    className={cn(
                      "text-slate-700 hover:text-primary-600 font-medium relative",
                      location === item.url && "text-primary-600"
                    )}
                  >
                    {item.title}
                    {location === item.url && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" 
                        layoutId="navIndicator"
                      />
                    )}
                  </Link>
                </motion.div>
              )
            ))}
          </motion.div>

          {/* Search Icon and Mobile Menu Button */}
          <div className="flex items-center">
            <motion.button 
              className="p-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none" 
              aria-label="Search"
              onClick={toggleSearch}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Search className="h-6 w-6" />
            </motion.button>
            <motion.button 
              className="md:hidden p-2 ml-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none" 
              aria-label="Menu" 
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden overflow-hidden"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {menuItems.map((item: MenuItem) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    {item.children && item.children.length > 0 ? (
                      <div className="mobile-dropdown bg-white rounded-lg overflow-hidden shadow-sm mb-2">
                        <button 
                          className="w-full text-left flex justify-between items-center px-4 py-3 rounded-md text-base font-medium text-slate-700 hover:bg-primary-50"
                          onClick={() => toggleMobileDropdown(item.id)}
                        >
                          {item.title}
                          {mobileDropdownOpen[item.id] ? 
                            <ChevronUp className="h-5 w-5 text-primary-600" /> : 
                            <ChevronDown className="h-5 w-5" />
                          }
                        </button>
                        <AnimatePresence>
                          {mobileDropdownOpen[item.id] && (
                            <motion.div 
                              className="bg-slate-50 border-t border-slate-100"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              {item.children.map((child) => (
                                <Link 
                                  key={child.id} 
                                  href={child.url}
                                  className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-primary-100 hover:text-primary-600 border-b border-slate-100 last:border-0"
                                >
                                  {child.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.url}
                        className={cn(
                          "block px-4 py-3 mb-2 rounded-lg text-base font-medium hover:bg-primary-50 shadow-sm bg-white",
                          location === item.url 
                            ? "text-primary-600 border-l-4 border-primary-600" 
                            : "text-slate-700"
                        )}
                      >
                        {item.title}
                      </Link>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div 
            className="bg-white border-t border-slate-100 py-3 px-4 shadow-inner"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto">
              <SearchBar onSearch={() => setIsSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
