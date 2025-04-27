import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  FileText,
  Globe,
  GraduationCap,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  Newspaper,
  X,
  User
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const [location, navigate] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  // Navigation items for sidebar
  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Articles', href: '/admin/articles', icon: FileText },
    { name: 'Scholarships', href: '/admin/scholarships', icon: GraduationCap },
    { name: 'Countries', href: '/admin/countries', icon: Globe },
    { name: 'Universities', href: '/admin/universities', icon: GraduationCap },
    { name: 'News', href: '/admin/news', icon: Newspaper },
    { name: 'Menu', href: '/admin/menu', icon: Menu },
    { name: 'Users', href: '/admin/users', icon: User },
    { name: 'View Site', href: '/', icon: Home },
  ];

  // Check if user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token && !location.startsWith('/admin/login')) {
      navigate('/admin/login');
    }
  }, [location, navigate]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-40 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          className="m-2"
          onClick={toggleSidebar}
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b px-4">
            <h1 className="text-xl font-bold text-gray-800">StudyGlobal Admin</h1>
          </div>
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const ItemIcon = item.icon;
                return (
                  <li key={item.name}>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      className={`w-full justify-start ${
                        isActive ? 'bg-primary text-primary-foreground' : ''
                      }`}
                      onClick={() => {
                        navigate(item.href);
                        if (isMobile) setSidebarOpen(false);
                      }}
                    >
                      <ItemIcon className="mr-2 h-5 w-5" />
                      {item.name}
                    </Button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="border-t p-4">
            <Button
              variant="outline"
              className="w-full justify-start text-red-500 hover:bg-red-50 hover:text-red-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-5 w-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}