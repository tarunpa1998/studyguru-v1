import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Menu,
  ChevronDown, 
  X, 
  User,
  LogOut,
  GraduationCap, 
  Globe, 
  Building, 
  FileText, 
  Newspaper,
  Home,
  Settings,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";

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

// Icon map for menu items
const menuIconMap: Record<string, any> = {
  "Home": Home,
  "Scholarships": GraduationCap,
  "Countries": Globe,
  "Universities": Building,
  "Articles": FileText,
  "News": Newspaper
};

// Animations
const slideIn = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.3 }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: { duration: 0.2 }
  }
};

const mobileMenuVariants = {
  closed: {
    opacity: 0,
    x: "100%",
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  open: {
    opacity: 1,
    x: "0%",
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerChildren = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const childVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 24 
    }
  }
};

// User Profile Menu Component
const ProfileMenu = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!user || !isAuthenticated()) {
    return null;
  }

  // Create fallback initials safely
  const getInitials = () => {
    if (!user.fullName) return 'U';
    return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative h-9 w-9 rounded-full p-0 overflow-hidden"
        >
          <Avatar className="h-9 w-9 border-2 border-primary-100 ring-2 ring-white">
            <AvatarImage src={user.profileImage} alt={user.fullName || 'User'} />
            <AvatarFallback className="bg-gradient-to-br from-primary-400 to-primary-600 text-white text-sm">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex items-center justify-start gap-2 p-2 pl-4">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-medium">{user.fullName || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user.email || ''}</p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="text-red-600 focus:bg-red-50 focus:text-red-600"
          onClick={() => {
            logout();
            navigate('/');
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Auth Buttons Component
const AuthButtons = () => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated()) {
    return <ProfileMenu />;
  }
  
  return (
    <div className="flex items-center gap-2">
      <Link href="/login">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-600 hover:text-primary-600 bg-transparent"
        >
          Log in
        </Button>
      </Link>
      <Link href="/register">
        <Button 
          size="sm" 
          className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
        >
          Sign up
        </Button>
      </Link>
    </div>
  );
};

// Mobile Menu Item Component
const MobileMenuItem = ({ 
  item, 
  isActive = false,
  isOpen = false,
  onToggle,
  onClose
}: { 
  item: MenuItem, 
  isActive?: boolean,
  isOpen?: boolean,
  onToggle?: () => void,
  onClose: () => void
}) => {
  const IconComponent = menuIconMap[item.title];
  
  if (item.children && item.children.length > 0) {
    return (
      <motion.div 
        variants={childVariant}
        className="mb-1"
      >
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
          <button
            onClick={onToggle}
            className={cn(
              "w-full flex items-center justify-between p-3.5 text-left text-base font-medium transition-colors",
              isActive ? "bg-primary-50 text-primary-700" : "bg-white text-gray-700 hover:bg-gray-50"
            )}
          >
            <span className="flex items-center">
              {IconComponent && (
                <IconComponent className="mr-3 h-5 w-5 text-primary-500" />
              )}
              {item.title}
            </span>
            <ChevronDown 
              className={cn(
                "h-5 w-5 text-gray-500 transition-transform duration-200",
                isOpen && "transform rotate-180"
              )} 
            />
          </button>
          
          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="border-t border-gray-100">
                  {item.children.map(child => (
                    <Link 
                      key={child.id} 
                      href={child.url}
                      onClick={onClose}
                    >
                      <div className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                        {child.title}
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div variants={childVariant} className="mb-1">
      <Link href={item.url} onClick={onClose}>
        <div 
          className={cn(
            "flex items-center px-3.5 py-3.5 rounded-lg transition-colors",
            isActive 
              ? "bg-primary-600 text-white font-medium shadow-sm" 
              : "text-gray-700 hover:bg-gray-50 font-medium border border-gray-200"
          )}
        >
          {IconComponent && (
            <IconComponent 
              className={cn(
                "mr-3 h-5 w-5",
                isActive ? "text-white" : "text-primary-500"
              )} 
            />
          )}
          {item.title}
        </div>
      </Link>
    </motion.div>
  );
};

// Main Navbar Component
const Navbar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<{[key: number]: boolean}>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  
  // Fetch menu data from API
  const { data: menuItems = [] as MenuItem[], isLoading } = useQuery<MenuItem[]>({
    queryKey: ['/api/menu'],
  });

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  // Detect scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = '';
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

  const toggleExpandedItem = (id: number) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-shadow duration-300",
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-md" 
          : "bg-white"
      )}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-2">
                <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gradient-to-tr from-primary-600 to-primary-500 text-white shadow-sm">
                  <Lightbulb className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl text-gray-800">
                  StudyGlobal
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map(item => {
              const isActive = location === item.url || location.startsWith(item.url + '/');
              const IconComponent = menuIconMap[item.title];
              
              if (item.children && item.children.length > 0) {
                return (
                  <DropdownMenu key={item.id}>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant={isActive ? "secondary" : "ghost"} 
                        size="sm" 
                        className={cn(
                          "px-3 py-2 h-9 font-medium",
                          isActive && "bg-primary-50 text-primary-700"
                        )}
                      >
                        {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                        {item.title}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" className="w-48">
                      {item.children.map(child => (
                        <DropdownMenuItem key={child.id} asChild>
                          <Link href={child.url} className="cursor-pointer">
                            <span>{child.title}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn(
                    "px-3 py-2 h-9 font-medium",
                    isActive && "bg-primary-50 text-primary-700"
                  )}
                  asChild
                >
                  <Link href={item.url}>
                    {IconComponent && <IconComponent className="mr-2 h-4 w-4" />}
                    {item.title}
                  </Link>
                </Button>
              );
            })}
          </nav>

          {/* Right Section: Search & Auth */}
          <div className="flex items-center space-x-1">
            {/* Desktop only */}
            <div className="hidden md:block">
              <AuthButtons />
            </div>
            
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-500"
              onClick={toggleSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-9 w-9",
                  isMobileMenuOpen 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-500"
                )}
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMobileMenu}
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              ref={mobileMenuRef}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-white shadow-xl z-50 md:hidden flex flex-col"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              {/* Mobile Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <Link href="/" onClick={closeMobileMenu}>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gradient-to-tr from-primary-600 to-primary-500 text-white">
                      <Lightbulb className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-base text-gray-800">
                      StudyGlobal
                    </span>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500"
                  onClick={closeMobileMenu}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              {/* Mobile Menu Items */}
              <div className="flex-1 overflow-y-auto py-4 px-4">
                <motion.div
                  className="space-y-1"
                  initial="hidden"
                  animate="show"
                  variants={staggerChildren}
                >
                  {menuItems.map(item => (
                    <MobileMenuItem
                      key={item.id}
                      item={item}
                      isActive={location === item.url || location.startsWith(item.url + '/')}
                      isOpen={expandedItems[item.id]}
                      onToggle={() => toggleExpandedItem(item.id)}
                      onClose={closeMobileMenu}
                    />
                  ))}
                </motion.div>
              </div>
              
              {/* Mobile Auth & Footer */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex flex-col space-y-3">
                  <div className="text-sm text-gray-500 mb-2">
                    Account
                  </div>
                  {/* Mobile Auth Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <Link href="/login" onClick={closeMobileMenu}>
                      <Button 
                        variant="outline" 
                        className="w-full justify-center"
                      >
                        Log in
                      </Button>
                    </Link>
                    <Link href="/register" onClick={closeMobileMenu}>
                      <Button 
                        className="w-full justify-center bg-primary-600 hover:bg-primary-700"
                      >
                        Sign up
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 bg-white"
          >
            <div className="container mx-auto py-4 px-4">
              <SearchBar onSearch={() => setIsSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;