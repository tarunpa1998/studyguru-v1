import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Newspaper, 
  BookOpen, 
  Globe, 
  GraduationCap, 
  LogOut, 
  Menu, 
  X, 
  Home,
  LayoutDashboard
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import ArticlesAdmin from '@/components/admin/ArticlesAdmin';
import NewsAdmin from '@/components/admin/NewsAdmin';
import ScholarshipsAdmin from '@/components/admin/ScholarshipsAdmin';
import CountriesAdmin from '@/components/admin/CountriesAdmin';
import UniversitiesAdmin from '@/components/admin/UniversitiesAdmin';
import AdminHome from '@/components/admin/AdminHome';

type NavItem = {
  title: string;
  icon: React.ReactNode;
  section: string;
};

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    section: "dashboard",
  },
  {
    title: "Articles",
    icon: <FileText className="h-5 w-5" />,
    section: "articles",
  },
  {
    title: "News",
    icon: <Newspaper className="h-5 w-5" />,
    section: "news",
  },
  {
    title: "Scholarships",
    icon: <BookOpen className="h-5 w-5" />,
    section: "scholarships",
  },
  {
    title: "Countries",
    icon: <Globe className="h-5 w-5" />,
    section: "countries",
  },
  {
    title: "Universities",
    icon: <GraduationCap className="h-5 w-5" />,
    section: "universities",
  },
];

const Dashboard = () => {
  const [, setLocation] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
      // Redirect to login page if not authenticated
      setLocation('/admin/login');
      return;
    }
    
    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/admin/auth/auth', {
          headers: {
            'x-auth-token': token
          }
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const userData = await response.json();
        setUsername(userData.username);
      } catch (error) {
        console.error('Auth error:', error);
        // Clear token and redirect to login on failure
        localStorage.removeItem('adminToken');
        setLocation('/admin/login');
      }
    };
    
    fetchUserData();
  }, [setLocation]);

  const handleLogout = () => {
    // Clear token and redirect to login
    localStorage.removeItem('adminToken');
    setLocation('/admin/login');
  };

  // Render active section content
  const renderContent = () => {
    switch (activeSection) {
      case "articles":
        return <ArticlesAdmin />;
      case "news":
        return <NewsAdmin />;
      case "scholarships":
        return <ScholarshipsAdmin />;
      case "countries":
        return <CountriesAdmin />;
      case "universities":
        return <UniversitiesAdmin />;
      default:
        return <AdminHome />;
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | Study Guru</title>
      </Helmet>
      <div className="flex h-screen overflow-hidden bg-slate-100">
        {/* Desktop Sidebar */}
        <aside 
          className={`hidden md:flex md:flex-col h-full bg-white shadow-md transition-all duration-300 ${
            isSidebarOpen ? 'w-64' : 'w-20'
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-slate-200">
            <div className={`flex items-center overflow-hidden ${isSidebarOpen ? 'justify-start space-x-3' : 'justify-center px-1'}`}>
              <GraduationCap className="h-6 w-6 text-primary-600 flex-shrink-0" />
              {isSidebarOpen && <span className="font-semibold text-lg">StudyGlobal</span>}
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-500 hover:text-slate-700"
            >
              {isSidebarOpen ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
            </Button>
          </div>
          
          <ScrollArea className="flex-1 py-4">
            <nav className="flex flex-col gap-1 px-2">
              {navItems.map((item) => (
                <Button
                  key={item.section}
                  variant={activeSection === item.section ? "secondary" : "ghost"}
                  className={`justify-start h-10 px-3 ${
                    isSidebarOpen ? '' : 'justify-center px-0'
                  }`}
                  onClick={() => setActiveSection(item.section)}
                >
                  <span className="flex items-center">
                    {item.icon}
                    {isSidebarOpen && <span className="ml-3">{item.title}</span>}
                  </span>
                </Button>
              ))}
            </nav>
          </ScrollArea>
          
          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost" 
              className={`justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50 ${
                isSidebarOpen ? '' : 'justify-center px-0'
              }`}
              onClick={handleLogout}
            >
              <span className="flex items-center">
                <LogOut className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Logout</span>}
              </span>
            </Button>
            
            {isSidebarOpen && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <div className="text-xs text-slate-500">Logged in as</div>
                <div className="font-medium truncate">{username || 'Admin'}</div>
              </div>
            )}
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <div className="flex justify-between items-center p-4 border-b border-slate-200">
                    <div className="flex items-center space-x-3">
                      <GraduationCap className="h-6 w-6 text-primary-600" />
                      <span className="font-semibold text-lg">StudyGlobal</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setMobileOpen(false)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  
                  <ScrollArea className="flex-1 py-4 h-[calc(100vh-8rem)]">
                    <nav className="flex flex-col gap-1 px-2">
                      {navItems.map((item) => (
                        <Button
                          key={item.section}
                          variant={activeSection === item.section ? "secondary" : "ghost"}
                          className="justify-start h-10"
                          onClick={() => {
                            setActiveSection(item.section);
                            setMobileOpen(false);
                          }}
                        >
                          <span className="flex items-center">
                            {item.icon}
                            <span className="ml-3">{item.title}</span>
                          </span>
                        </Button>
                      ))}
                    </nav>
                  </ScrollArea>
                  
                  <div className="p-4 border-t border-slate-200">
                    <Button
                      variant="ghost" 
                      className="justify-start w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <span className="flex items-center">
                        <LogOut className="h-5 w-5" />
                        <span className="ml-3">Logout</span>
                      </span>
                    </Button>
                    
                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <div className="text-xs text-slate-500">Logged in as</div>
                      <div className="font-medium truncate">{username || 'Admin'}</div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <h1 className="text-xl font-semibold mx-4">
                {navItems.find(item => item.section === activeSection)?.title || "Dashboard"}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm" 
                onClick={() => setLocation('/')}
              >
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </div>
          </header>
          
          {/* Content Area */}
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;