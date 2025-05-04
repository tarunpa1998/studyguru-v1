import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  FileText,
  Newspaper,
  BookOpen,
  Globe,
  GraduationCap,
  ArrowRight,
  PlusCircle,
  Users,
  TrendingUp,
  BarChart4
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CountStats {
  articles: number;
  news: number;
  scholarships: number;
  countries: number;
  universities: number;
}

const AdminHome = () => {
  const [, setLocation] = useLocation();
  const [stats, setStats] = useState<CountStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Fetch all content types to count items
        const [articlesRes, newsRes, scholarshipsRes, countriesRes, universitiesRes] = await Promise.all([
          fetch('/api/articles'),
          fetch('/api/news'),
          fetch('/api/scholarships'),
          fetch('/api/countries'),
          fetch('/api/universities'),
        ]);

        const [articles, news, scholarships, countries, universities] = await Promise.all([
          articlesRes.json(),
          newsRes.json(),
          scholarshipsRes.json(),
          countriesRes.json(),
          universitiesRes.json(),
        ]);

        setStats({
          articles: articles.length || 0,
          news: news.length || 0,
          scholarships: scholarships.length || 0,
          countries: countries.length || 0,
          universities: universities.length || 0
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const navigateTo = (section: string) => {
    setLocation(`/admin/${section}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-slate-500 mt-2">
          Welcome to the Study Guru admin dashboard! Manage all your content from here.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Articles"
          icon={<FileText className="h-5 w-5 text-blue-600" />}
          value={stats?.articles}
          loading={loading}
          color="blue"
          onClick={() => navigateTo('articles')}
        />
        <StatsCard
          title="News"
          icon={<Newspaper className="h-5 w-5 text-amber-600" />}
          value={stats?.news}
          loading={loading}
          color="amber"
          onClick={() => navigateTo('news')}
        />
        <StatsCard
          title="Scholarships"
          icon={<BookOpen className="h-5 w-5 text-green-600" />}
          value={stats?.scholarships}
          loading={loading}
          color="green"
          onClick={() => navigateTo('scholarships')}
        />
        <StatsCard
          title="Countries"
          icon={<Globe className="h-5 w-5 text-indigo-600" />}
          value={stats?.countries}
          loading={loading}
          color="indigo"
          onClick={() => navigateTo('countries')}
        />
        <StatsCard
          title="Universities"
          icon={<GraduationCap className="h-5 w-5 text-purple-600" />}
          value={stats?.universities}
          loading={loading}
          color="purple"
          onClick={() => navigateTo('universities')}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks you might want to perform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => navigateTo('articles')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Create New Article
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => navigateTo('scholarships')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Scholarship
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start text-sm"
                onClick={() => navigateTo('universities')}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add University
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Content Overview</CardTitle>
            <CardDescription>Summary of your platform content</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-slate-700">Recently Updated</span>
                <span className="font-medium">{new Date().toLocaleDateString()}</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-700">Total Content Items</span>
                <span className="font-medium">
                  {loading ? (
                    <Skeleton className="h-4 w-10" />
                  ) : (
                    stats ? (
                      stats.articles + stats.news + stats.scholarships + stats.countries + stats.universities
                    ) : 0
                  )}
                </span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-700">Content Types</span>
                <span className="font-medium">5</span>
              </li>
              <li className="pt-2 mt-2 border-t border-slate-100">
                <Button 
                  variant="ghost" 
                  className="p-0 h-auto text-primary-600 text-sm hover:text-primary-700 hover:bg-transparent"
                  onClick={() => setLocation('/')}
                >
                  View Public Site <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Documentation</CardTitle>
            <CardDescription>Learn how to manage your content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="rounded-md border border-slate-200 p-3">
                <h4 className="font-medium mb-1">Content Guidelines</h4>
                <p className="text-sm text-slate-500 mb-2">
                  Best practices for adding content to the platform
                </p>
                <Button size="sm" variant="ghost" className="text-xs text-primary-600 px-0">
                  Read Guide <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              <div className="rounded-md border border-slate-200 p-3">
                <h4 className="font-medium mb-1">Admin Features</h4>
                <p className="text-sm text-slate-500 mb-2">
                  Overview of all administrative capabilities
                </p>
                <Button size="sm" variant="ghost" className="text-xs text-primary-600 px-0">
                  View Documentation <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Overview</CardTitle>
          <CardDescription>Summary of recent platform activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Users</div>
                <div className="text-xl font-semibold">1</div>
                <div className="text-xs text-slate-500">Admin User</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-amber-100 p-3 rounded-full">
                <TrendingUp className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Content Growth</div>
                <div className="text-xl font-semibold">
                  {loading ? <Skeleton className="h-7 w-16" /> : '+5'}
                </div>
                <div className="text-xs text-slate-500">Last 30 days</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-3 rounded-full">
                <BarChart4 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-slate-500">Most Popular</div>
                <div className="text-xl font-semibold truncate max-w-[180px]">
                  {loading ? <Skeleton className="h-7 w-16" /> : 'Scholarships'}
                </div>
                <div className="text-xs text-slate-500">Content type</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  icon: React.ReactNode;
  value: number | undefined;
  loading: boolean;
  color: 'blue' | 'green' | 'amber' | 'indigo' | 'purple';
  onClick?: () => void;
}

const StatsCard = ({ title, icon, value, loading, color, onClick }: StatsCardProps) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-100 hover:bg-blue-100",
    green: "bg-green-50 border-green-100 hover:bg-green-100",
    amber: "bg-amber-50 border-amber-100 hover:bg-amber-100",
    indigo: "bg-indigo-50 border-indigo-100 hover:bg-indigo-100",
    purple: "bg-purple-50 border-purple-100 hover:bg-purple-100",
  };

  return (
    <div 
      className={`rounded-lg border p-3 transition-colors duration-200 cursor-pointer ${colorClasses[color]}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="mr-2">{icon}</div>
          <span className="font-medium">{title}</span>
        </div>
      </div>
      <div className="mt-3">
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <div className="text-2xl font-bold">
            {value !== undefined ? value : 0}
          </div>
        )}
        <div className="mt-1 text-xs text-slate-500">Total entries</div>
      </div>
    </div>
  );
};

export default AdminHome;