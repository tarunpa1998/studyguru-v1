import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  GraduationCap, 
  Globe, 
  Building, 
  FileText, 
  Newspaper 
} from "lucide-react";
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

// Menu Icon animation variants
const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="2"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

const MenuIcon = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <motion.svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      animate={isOpen ? "open" : "closed"}
    >
      <Path
        variants={{
          closed: { d: "M3 6h18", opacity: 1 },
          open: { d: "M3 6h18", opacity: 1 }
        }}
        transition={{ duration: 0.2 }}
      />
      <Path
        variants={{
          closed: { d: "M3 12h18", opacity: 1 },
          open: { d: "M3 12h18", opacity: 0 }
        }}
        transition={{ duration: 0.2 }}
      />
      <Path
        variants={{
          closed: { d: "M3 18h18", opacity: 1 },
          open: { d: "M3 18h18", opacity: 1 }
        }}
        transition={{ duration: 0.2 }}
      />
      <Path
        variants={{
          closed: { d: "M3 6h18", opacity: 0, rotate: 0, y: 0 },
          open: { d: "M20 6L4 20", opacity: 1, rotate: 0, y: 0 }
        }}
        transition={{ duration: 0.2 }}
      />
      <Path
        variants={{
          closed: { d: "M3 18h18", opacity: 0, rotate: 0, y: 0 },
          open: { d: "M4 4L20 20", opacity: 1, rotate: 0, y: 0 }
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.svg>
  );
};

// Icon map for menu items
const menuIconMap: Record<string, any> = {
  "Scholarships": GraduationCap,
  "Countries": Globe,
  "Universities": Building,
  "Articles": FileText,
  "News": Newspaper
};

const navVariants = {
  hidden: { 
    opacity: 0,
    y: -10,
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1
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
      duration: 0.3,
      when: "afterChildren"
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const Navbar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{[key: number]: boolean}>({});
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Fetch menu data from MongoDB
  const { data: menuItems = [] as MenuItem[], isLoading } = useQuery<MenuItem[]>({
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

  // Get icon component for menu item
  const getMenuIcon = (title: string) => {
    const IconComponent = menuIconMap[title];
    return IconComponent ? <IconComponent className="h-5 w-5 mr-2" /> : null;
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
          <div className="flex items-center">
            <Link href="/">
              <motion.span 
                className="text-primary-600 font-bold text-xl md:text-2xl"
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
            className="hidden md:flex items-center space-x-6 lg:space-x-8"
            initial="hidden"
            animate="visible"
            variants={navVariants}
          >
            {menuItems.map((item: MenuItem) => (
              item.children && item.children.length > 0 ? (
                <motion.div key={item.id} className="relative group" variants={itemVariants}>
                  <button 
                    className={cn(
                      "text-slate-700 hover:text-primary-600 font-medium inline-flex items-center py-1 px-2 rounded-md transition-colors duration-200",
                      location.startsWith(item.url) && "text-primary-600 bg-primary-50/60"
                    )}
                  >
                    {getMenuIcon(item.title)}
                    {item.title}
                    <ChevronDown className="h-4 w-4 ml-1 group-hover:rotate-180 transition-transform duration-200" />
                  </button>
                  <motion.div 
                    className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                  >
                    <div className="py-2">
                      {item.children.map((child) => (
                        <Link 
                          key={child.id} 
                          href={child.url}
                        >
                          <motion.div
                            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors duration-200"
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {child.title}
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link href={item.url}>
                    <motion.div 
                      className={cn(
                        "text-slate-700 hover:text-primary-600 font-medium relative inline-flex items-center py-1 px-2 rounded-md transition-colors duration-200",
                        location === item.url && "text-primary-600 bg-primary-50/60"
                      )}
                      whileHover={{ y: -2 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      {getMenuIcon(item.title)}
                      {item.title}
                      {location === item.url && (
                        <motion.div 
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600" 
                          layoutId="navIndicator"
                        />
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              )
            ))}

            {/* Search Button - Desktop */}
            <motion.button 
              className="p-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none bg-slate-100/80 hover:bg-slate-200/80 transition-colors duration-200" 
              aria-label="Search"
              onClick={toggleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              <Search className="h-5 w-5" />
            </motion.button>
          </motion.div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center">
            <motion.button 
              className="p-2 ml-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none bg-slate-100/80 hover:bg-slate-200/80 transition-colors duration-200" 
              aria-label="Search"
              onClick={toggleSearch}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Search className="h-5 w-5" />
            </motion.button>
            <motion.button 
              className="p-2 ml-2 rounded-full text-slate-700 hover:text-primary-600 focus:outline-none bg-slate-100/80 hover:bg-slate-200/80 transition-colors duration-200" 
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              className="md:hidden overflow-hidden bg-white"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <div className="px-2 pt-3 pb-4 space-y-2">
                {menuItems.map((item: MenuItem) => (
                  <motion.div key={item.id} variants={itemVariants}>
                    {item.children && item.children.length > 0 ? (
                      <div className="mobile-dropdown overflow-hidden rounded-2xl shadow-sm mb-2 border border-slate-100">
                        <button 
                          className="w-full text-left flex justify-between items-center px-4 py-3 rounded-t-2xl text-base font-medium text-slate-700 hover:bg-primary-50 transition-colors duration-200"
                          onClick={() => toggleMobileDropdown(item.id)}
                          aria-expanded={mobileDropdownOpen[item.id] ? "true" : "false"}
                        >
                          <span className="flex items-center">
                            {getMenuIcon(item.title)}
                            {item.title}
                          </span>
                          <motion.div
                            animate={{ rotate: mobileDropdownOpen[item.id] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <ChevronDown className="h-5 w-5 text-slate-500" />
                          </motion.div>
                        </button>
                        <AnimatePresence>
                          {mobileDropdownOpen[item.id] && (
                            <motion.div 
                              className="bg-slate-50"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {item.children.map((child) => (
                                <Link 
                                  key={child.id} 
                                  href={child.url}
                                >
                                  <motion.div
                                    className="block px-4 py-3 text-base font-medium text-slate-600 hover:bg-primary-100 hover:text-primary-600 border-t border-slate-100 transition-colors duration-200"
                                    whileHover={{ x: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                  >
                                    {child.title}
                                  </motion.div>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link href={item.url}>
                        <motion.div
                          className={cn(
                            "block px-4 py-3 mb-2 rounded-2xl text-base font-medium hover:bg-primary-50 shadow-sm border border-slate-100 transition-all duration-200 flex items-center",
                            location === item.url 
                              ? "text-primary-600 border-l-4 border-l-primary-600 pl-3" 
                              : "text-slate-700"
                          )}
                          whileHover={{ x: 5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {getMenuIcon(item.title)}
                          {item.title}
                        </motion.div>
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
            className="bg-white border-t border-slate-100 py-4 px-4 shadow-inner"
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
