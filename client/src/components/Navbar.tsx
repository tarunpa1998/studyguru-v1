import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  Menu, 
  X, 
  Search, 
  ChevronDown, 
  GraduationCap, 
  Globe, 
  Building, 
  FileText, 
  Newspaper,
  UserCircle,
  LogIn,
  Moon,
  Sun
} from "lucide-react";
import { cn } from "@/lib/utils";
import SearchBar from "./SearchBar";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";

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
  "Scholarships": GraduationCap,
  "Countries": Globe,
  "Universities": Building,
  "Articles": FileText,
  "News": Newspaper
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
            <AvatarFallback className="text-sm bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-foreground">{user.fullName || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user.email || ''}</p>
          </div>
        </div>
        <div className="flex space-x-2 mt-1">
          <Link href="/profile" className="flex-1" onClick={closeMobileMenu}>
            <button className="w-full py-2 px-3 bg-accent text-accent-foreground rounded-md shadow-sm text-sm font-medium flex items-center justify-center hover:bg-accent/80 transition-colors duration-200">
              <UserCircle className="h-4 w-4 mr-2" />
              Profile
            </button>
          </Link>
          <button 
            className="flex-1 py-2 px-3 bg-destructive/10 text-destructive rounded-md shadow-sm text-sm font-medium flex items-center justify-center hover:bg-destructive/20 transition-colors duration-200"
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
        <button className="w-full py-2 px-3 bg-accent text-accent-foreground rounded-md shadow-sm text-sm font-medium hover:bg-accent/80 transition-colors duration-200">
          Login
        </button>
      </Link>
      <Link href="/register" className="flex-1" onClick={closeMobileMenu}>
        <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded-md shadow-sm text-sm font-medium hover:bg-primary/90 transition-colors duration-200">
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
  
  // Helper function to handle subcategory navigation
  const handleSubcategoryClick = (url: string) => {
    // Check if this is a subcategory URL pattern
    const parts = url.split('/');
    if (parts.length === 3 && ['scholarships', 'articles', 'universities'].includes(parts[1])) {
      // Convert to filter URL instead of detail page
      navigate(`/${parts[1]}?tag=${encodeURIComponent(parts[2])}`);
      return true;
    }
    return false;
  };
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
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center space-x-2 px-3 py-1.5 rounded-md bg-accent/50 text-foreground hover:bg-accent transition-colors duration-200"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={user.profileImage} alt={user.fullName || 'User'} />
            <AvatarFallback className="text-xs bg-primary/10 text-primary">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium hidden sm:inline-block max-w-[100px] truncate">
            {user.fullName || 'User'}
          </span>
          <ChevronDown className="h-4 w-4" />
        </button>

        {showDropdown && (
          <div
            className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg overflow-hidden z-50"
          >
            <div className="py-2">
              <Link href="/profile">
                <div className="flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground">
                  <UserCircle className="h-4 w-4 mr-2" />
                  Profile
                </div>
              </Link>
              <button
                className="w-full text-left flex items-center px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
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
          </div>
        )}
      </div>
    );
  }

  // Not logged in
  return (
    <div className="flex items-center space-x-2">
      <Link href="/login">
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          Login
        </button>
      </Link>
      <Link href="/register">
        <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
          Sign Up
        </button>
      </Link>
    </div>
  );
};

const Navbar = () => {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState<{[key: number]: boolean}>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();
  
  // Helper function to handle subcategory navigation
  const handleSubcategoryClick = (url: string) => {
    // Check if this is a subcategory URL pattern
    const parts = url.split('/');
    if (parts.length === 3 && ['scholarships', 'articles', 'universities', 'news'].includes(parts[1])) {
      // Get the category name from the URL
      const category = parts[2];
      // Convert to filter URL instead of detail page
      navigate(`/${parts[1]}?category=${encodeURIComponent(category)}`);
      return true;
    }
    return false;
  };
  
  // Function to close mobile menu
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  
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
        "sticky top-0 bg-background z-50 transition-shadow duration-300 w-full",
        isScrolled || isMobileMenuOpen || isSearchOpen ? "shadow-md" : "shadow-sm"
      )}
    >
      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <img 
                  src="/logo.svg" 
                  alt="Study Guru Logo" 
                  className="h-8 w-8 mr-2"
                />
                <span className="text-xl font-bold text-foreground">STUDY GURU</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex md:flex-1 items-center justify-end space-x-4">
              {/* Menu Items */}
              <div className="flex items-center space-x-1 lg:space-x-2 mr-4">
                {menuItems.map((item: MenuItem) => (
                  item.children && item.children.length > 0 ? (
                    <div key={item.id} className="relative group px-1">
                      <button 
                        className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md px-2 lg:px-3 py-2 text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                          location.startsWith(item.url) 
                            ? "bg-accent/50 text-primary" 
                            : "text-foreground"
                        )}
                      >
                        {getMenuIcon(item.title)}
                        <span className="mx-1">{item.title}</span>
                        <ChevronDown className="h-3 w-3 transition duration-200 group-hover:rotate-180" aria-hidden="true" />
                      </button>
                      <div className="absolute left-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top scale-95 group-hover:scale-100 z-50">
                        <div className="py-2">
                          {item.children.map((child) => (
                            <Link 
                              key={child.id} 
                              href={child.url}
                              onClick={(e) => {
                                if (handleSubcategoryClick(child.url)) {
                                  e.preventDefault();
                                }
                              }}
                            >
                              <div className="block px-4 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200">
                                {child.title}
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div key={item.id} className="px-1">
                      <Link href={item.url}>
                        <div className={cn(
                          "inline-flex h-10 items-center justify-center rounded-md px-2 lg:px-3 py-2 text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none",
                          location === item.url 
                            ? "bg-accent/50 text-primary" 
                            : "text-foreground"
                        )}>
                          {getMenuIcon(item.title)}
                          <span className="mx-1">{item.title}</span>
                        </div>
                      </Link>
                    </div>
                  )
                ))}
              </div>

              {/* Authentication buttons */}
              <div className="flex items-center">
                <AuthButtons />
                
                {/* Theme Toggle - Desktop */}
                <div className="ml-2">
                  <ThemeToggle />
                </div>

                {/* Search Button - Desktop */}
                <button 
                  className="ml-2 p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none transition-colors duration-200" 
                  aria-label="Search"
                  onClick={toggleSearch}
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden items-center space-x-2">
              {/* Theme Toggle - Mobile */}
              <ThemeToggle />
              
              {/* Search button */}
              <button 
                className="p-2 rounded-md text-foreground hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                onClick={toggleSearch}
              >
                <Search className="h-5 w-5" />
              </button>
              
              {/* Hamburger/Close button */}
              <button 
                onClick={toggleMobileMenu}
                className="p-2 rounded-md flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation - Fixed to prevent stretching */}
          {isMobileMenuOpen && (
            <>
              {/* Backdrop */}
              <div
                className="md:hidden fixed inset-0 top-16 bg-black/30 backdrop-blur-sm z-30"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <div 
                ref={menuRef}
                className="md:hidden fixed inset-x-0 top-16 bg-background shadow-lg z-40 max-h-[80vh] overflow-y-auto"
              >
                <div className="container mx-auto px-4 pt-4 pb-6">
                  <div className="space-y-3">
                    {menuItems.map((item: MenuItem) => (
                      <div key={item.id} className="touch-manipulation">
                        {item.children && item.children.length > 0 ? (
                          <div className="mobile-dropdown overflow-hidden rounded-md shadow-sm mb-3 border border-border">
                            <button 
                              className={cn(
                                "w-full text-left flex justify-between items-center px-4 py-3 text-sm font-medium transition-colors duration-200",
                                location.startsWith(item.url)
                                  ? "bg-accent/50 text-primary"
                                  : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                              )}
                              onClick={() => toggleMobileDropdown(item.id)}
                              aria-expanded={mobileDropdownOpen[item.id] ? "true" : "false"}
                            >
                              <span className="flex items-center">
                                {getMenuIcon(item.title)}
                                <span className="ml-2">{item.title}</span>
                              </span>
                              <div className={cn("transition-transform duration-200", mobileDropdownOpen[item.id] && "transform rotate-180")}>
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </button>
                            
                            {mobileDropdownOpen[item.id] && (
                              <div className="bg-background border-t border-border">
                                {item.children.map((child) => (
                                  <Link 
                                    key={child.id} 
                                    href={child.url}
                                    onClick={(e) => {
                                      if (handleSubcategoryClick(child.url)) {
                                        e.preventDefault();
                                      }
                                      closeMobileMenu();
                                    }}
                                  >
                                    <div className={cn(
                                      "block px-4 py-3 text-sm font-medium transition-colors duration-200 border-b border-border last:border-b-0",
                                      location === child.url
                                        ? "bg-accent/30 text-primary"
                                        : "text-foreground hover:bg-accent/20 hover:text-accent-foreground"
                                    )}>
                                      <span className="ml-6">{child.title}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <Link href={item.url}>
                            <div className={cn(
                              "block px-4 py-3 mb-3 rounded-md text-sm font-medium transition-colors duration-200 flex items-center border border-border",
                              location === item.url 
                                ? "bg-accent/50 text-primary" 
                                : "bg-background text-foreground hover:bg-accent hover:text-accent-foreground"
                            )}>
                              {getMenuIcon(item.title)}
                              <span className="ml-2">{item.title}</span>
                            </div>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Mobile Auth Buttons */} 
                  <div className="mt-6 pt-6 border-t border-border">
                    <div className="p-3 bg-card rounded-md shadow-sm">
                      <MobileAuthArea 
                        closeMobileMenu={() => setIsMobileMenuOpen(false)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-background border-t border-border py-4 px-4 shadow-inner">
          <div className="container mx-auto">
            <SearchBar onSearch={() => setIsSearchOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;











