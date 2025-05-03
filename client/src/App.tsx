import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ProtectedRoute } from "./lib/ProtectedRoute";
import { AdminProtectedRoute } from "./lib/AdminProtectedRoute";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import ScholarshipsList from "@/pages/ScholarshipsList";
import ScholarshipDetail from "@/pages/ScholarshipDetail";
import ArticlesList from "@/pages/ArticlesList";
import ArticleDetail from "@/pages/ArticleDetail";
import CountriesList from "@/pages/CountriesList";
import CountryDetail from "@/pages/CountryDetail";
import UniversitiesList from "@/pages/UniversitiesList";
import UniversityDetail from "@/pages/UniversityDetail";
import NewsList from "@/pages/NewsList";
import NewsDetail from "@/pages/NewsDetail";
import SearchResults from "@/pages/SearchResults";
import NotFound from "@/pages/not-found";

// Auth pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";

// Admin pages
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";

import { useEffect } from "react";

function Router() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Home} />
      
      <Route path="/scholarships" component={ScholarshipsList} />
      <Route path="/scholarships/:slug" component={ScholarshipDetail} />
      
      <Route path="/articles" component={ArticlesList} />
      <Route path="/articles/:slug" component={ArticleDetail} />
      
      <Route path="/countries" component={CountriesList} />
      <Route path="/countries/:slug" component={CountryDetail} />
      
      <Route path="/universities" component={UniversitiesList} />
      <Route path="/universities/:slug" component={UniversityDetail} />
      
      <Route path="/news" component={NewsList} />
      <Route path="/news/:slug" component={NewsDetail} />
      
      <Route path="/search" component={SearchResults} />
      
      {/* Auth routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <ProtectedRoute path="/profile" component={Profile} />
      
      {/* Admin routes - completely separate from the regular auth system */}
      <Route path="/admin/login" component={AdminLogin} />
      {/* Simple root admin route handler */}
      <Route path="/admin">
        {() => {
          // This root admin route will just redirect to dashboard
          const [, navigate] = useLocation();
          const token = localStorage.getItem('adminToken');
          
          // Use effect to handle navigation
          useEffect(() => {
            if (!token) {
              navigate('/admin/login');
            } else {
              navigate('/admin/dashboard');
            }
          }, [navigate, token]);
          
          // Return loading spinner while redirecting
          return (
            <div className="flex items-center justify-center min-h-screen">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent"></div>
            </div>
          );
        }}
      </Route>
      <AdminProtectedRoute path="/admin/dashboard" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/articles" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/news" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/scholarships" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/countries" component={AdminDashboard} />
      <AdminProtectedRoute path="/admin/universities" component={AdminDashboard} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith('/admin');

  // Seed initial data on first app load
  useEffect(() => {
    const seedData = async () => {
      try {
        await fetch('/api/seed', { method: 'POST' });
        console.log('Initial data seeded successfully');
      } catch (error) {
        console.error('Error seeding initial data:', error);
      }
    };
    
    seedData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <div className="flex flex-col min-h-screen">
              {!isAdminRoute && <Navbar />}
              <div className="flex-grow">
                <Router />
              </div>
              {!isAdminRoute && <Footer />}
            </div>
          </TooltipProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
