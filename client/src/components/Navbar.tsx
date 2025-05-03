import { useState, useEffect, useRef, createContext, useContext } from "react";
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
  Newspaper,
  UserCircle,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
          open: { d: "M6 6L18 18", opacity: 1 }
        }}
        transition={{ duration: 0.3 }}
      />
      <Path
        variants={{
          closed: { d: "M3 12h18", opacity: 1 },
          open: { d: "M6 12h12", opacity: 0 }
        }}
        transition={{ duration: 0.3 }}
      />
      <Path
        variants={{
          closed: { d: "M3 18h18", opacity: 1 },
          open: { d: "M6 18L18 6", opacity: 1 }
        }}
        transition={{ duration: 0.3 }}
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
      when: "afterChildren",
      ease: "easeInOut"
    }
  },
  visible: { 
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.4,
      when: "beforeChildren",
      staggerChildren: 0.1,
      ease: "easeOut"
    }
  }
};

// Mobile auth component for mobile menu
interface MobileAuthAreaProps {
  closeMobileMenu: () => void;
}

const MobileAuthArea: React.FC<MobileAuthAreaProps> = ({ closeMobileMenu }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (user && isAuthenticated()) {
    // Create fallback initials safely
    const getInitials = () => {
      if (!user.fullName) return 'U';
      return user.fullName.split(' ').map(n => n[0]).join('') || 'U';
    };

    return (
      <div className="flex flex-col">
        <div className="flex items-center space-x-3 mb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.profileImage} alt={user.fullName || 'User'} />
            <AvatarFallback className="text-sm bg-primary-100 text-primary-800">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-primary-700">{user.fullName || 'User'}</p>
            <p className="text-xs text-slate-500">{user.email || ''}</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-1">
          <Link href="/profile" className="flex-1" onClick={closeMobileMenu}>
            <button className="w-full py-2 px-3 bg-white rounded-lg shadow-sm text-primary-600 border border-primary-100 text-sm font-medium flex items-center justify-center">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </button>
          </Link>
          <button 
            className="flex-1 py-2 px-3 bg-white rounded-lg shadow-sm text-red-600 border border-red-100 text-sm font-medium flex items-center justify-center"
            onClick={() => {
              logout();
              closeMobileMenu();
              navigate('/');
            }}
          >
            <LogIn className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex space-x-3">
      <Link href="/login" className="flex-1" onClick={closeMobileMenu}>
        <button className="w-full py-3 text-primary-600 bg-white border border-primary-200 rounded-lg shadow-sm text-sm font-medium hover:bg-primary-50 transition-colors duration-200">
          Login
        </button>
      </Link>
      <Link href="/register" className="flex-1" onClick={closeMobileMenu}>
        <button className="w-full py-3 text-white bg-primary-600 rounded-lg shadow-md text-sm font-medium hover:bg-primary-700 transition-colors duration-200">
          Sign Up
        </button>
      </Link>
    </div>
  );
};

// Auth buttons component to display login/register or profile
const AuthButtons = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (user && isAuthenticated()) {
    // Create fallback initials safely
    const getInitials = () => {
      if (!user.fullName) return 'U';
      return user.fullName.split(' ').map(n => n[0]).join('') || 'U';
    };
    
    // Logged in user
    return (
      <motion.div className="relative" variants={itemVariants} ref={dropdownRef}>
        <motion.button
          className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200"
          onClick={() => setShowDropdown(!showDropdown)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.profileImage} alt={user.fullName || 'User'} />
            <AvatarFallback className="text-xs bg-primary-100 text-primary-800">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline-block max-w-[100px] truncate">
            {user.fullName || 'User'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </motion.button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg overflow-hidden z-50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                <Link href="/profile">
                  <motion.div
                    className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-600"
                    whileHover={{ x: 3 }}
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Profile
                  </motion.div>
                </Link>
                <button
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  onClick={() => {
                    logout();
                    setShowDropdown(false);
                    navigate('/');
                  }}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Logout
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Not logged in
  return (
    <motion.div className="flex items-center space-x-2" variants={itemVariants}>
      <Link href="/login">
        <motion.button
          className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-800 transition-colors duration-200"
          whileHover={{ y: -2 }}
          whileTap={{ y: 0 }}
        >
          Login
        </motion.button>
      </Link>
      <Link href="/register">
        <motion.button
          className="px-4 py-1.5 text-sm font-medium text-white bg-primary-600 rounded-full hover:bg-primary-700 transition-colors duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign Up
        </motion.button>
      </Link>
    </motion.div>
  );
};

const Navbar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{[key: number]: boolean}>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
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
  
  // Handle click outside mobile menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = ''; // Re-enable scrolling
    }
    
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

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
            {/* Menu Items */}
            <div className="flex items-center space-x-4 lg:space-x-6">
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
            </div>

            {/* Spacer to push auth buttons and search to the end */}
            <div className="flex-grow"></div>

            {/* Authentication buttons */}
            <AuthButtons />

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
              className={cn(
                "p-2 ml-2 rounded-full focus:outline-none transition-colors duration-200", 
                isMobileMenuOpen 
                  ? "bg-primary-600 text-white hover:bg-primary-700" 
                  : "bg-slate-100/80 text-slate-700 hover:text-primary-600 hover:bg-slate-200/80"
              )}
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={toggleMobileMenu}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MenuIcon isOpen={isMobileMenuOpen} />
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation Backdrop */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>
            
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              ref={menuRef}
              className="md:hidden fixed inset-x-0 top-16 bg-white/95 backdrop-blur-sm shadow-lg z-40 max-h-[80vh] overflow-y-auto touch-auto overscroll-contain"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="container mx-auto px-4 pt-4 pb-6">
                {/* Removed the separate close button as we'll use the hamburger button to toggle the menu */}
                <div className="space-y-3">
                  {menuItems.map((item: MenuItem) => (
                    <motion.div 
                      key={item.id} 
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      className="touch-manipulation"
                    >
                      {item.children && item.children.length > 0 ? (
                        <div className="mobile-dropdown overflow-hidden rounded-2xl shadow-md mb-3 border border-slate-200 bg-white">
                          <button 
                            className="w-full text-left flex justify-between items-center px-4 py-3.5 rounded-t-2xl text-base font-medium bg-gradient-to-r from-primary-50 to-white text-primary-700 hover:from-primary-100 hover:to-primary-50 transition-colors duration-200"
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
                              className="text-primary-500"
                            >
                              <ChevronDown className="h-5 w-5" />
                            </motion.div>
                          </button>
                          <AnimatePresence>
                            {mobileDropdownOpen[item.id] && (
                              <motion.div 
                                className="bg-white border-t border-slate-100"
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
                                      className="block px-5 py-3.5 text-base font-medium text-slate-800 hover:bg-primary-50 hover:text-primary-600 border-b border-slate-100 last:border-b-0 transition-colors duration-200"
                                      whileHover={{ x: 5 }}
                                      transition={{ type: "spring", stiffness: 300 }}
                                    >
                                      <span className="text-current">{child.title}</span>
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
                              "block px-4 py-3.5 mb-3 rounded-2xl text-base shadow-md transition-all duration-200 flex items-center",
                              item.title === "Home" 
                                ? "bg-gradient-to-r from-primary-600 to-primary-700 text-white font-bold" 
                                : location === item.url 
                                  ? "bg-primary-600 text-white font-bold" 
                                  : "bg-white text-slate-800 hover:bg-primary-50 hover:text-primary-600 font-medium"
                            )}
                            whileHover={{ x: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {getMenuIcon(item.title)}
                            <span className="text-current">{item.title}</span>
                          </motion.div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>
                
                {/* Mobile Auth Buttons - Now at the bottom */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    <MobileAuthArea 
                      closeMobileMenu={() => setIsMobileMenuOpen(false)}
                    />
                  </div>
                </div>
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