import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import AdminLayout from '@/components/admin/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  GraduationCap,
  BookOpen,
  Globe,
  Building,
  Newspaper,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

export default function AdminDashboard() {
  const [_, navigate] = useLocation();

  // Fetch summary data
  const { data: articles, isLoading: articlesLoading } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: scholarships, isLoading: scholarshipsLoading } = useQuery({
    queryKey: ['/api/scholarships'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: countries, isLoading: countriesLoading } = useQuery({
    queryKey: ['/api/countries'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: universities, isLoading: universitiesLoading } = useQuery({
    queryKey: ['/api/universities'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ['/api/news'],
    queryFn: getQueryFn({ on401: 'throw' }),
  });

  // Dashboard stats
  const stats = [
    {
      title: 'Articles',
      value: Array.isArray(articles) ? articles.length : 0,
      icon: BookOpen,
      link: '/admin/articles',
      color: 'bg-blue-500',
    },
    {
      title: 'Scholarships',
      value: Array.isArray(scholarships) ? scholarships.length : 0,
      icon: GraduationCap,
      link: '/admin/scholarships',
      color: 'bg-green-500',
    },
    {
      title: 'Countries',
      value: Array.isArray(countries) ? countries.length : 0,
      icon: Globe,
      link: '/admin/countries',
      color: 'bg-yellow-500',
    },
    {
      title: 'Universities',
      value: Array.isArray(universities) ? universities.length : 0,
      icon: Building,
      link: '/admin/universities',
      color: 'bg-purple-500',
    },
    {
      title: 'News',
      value: Array.isArray(news) ? news.length : 0,
      icon: Newspaper,
      link: '/admin/news',
      color: 'bg-red-500',
    },
  ];

  const isLoading = articlesLoading || scholarshipsLoading || countriesLoading || universitiesLoading || newsLoading;

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          // Loading state
          [...Array(5)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          // Stats cards
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => navigate(stat.link)}
              >
                <CardHeader className={`${stat.color} text-white p-4 pb-8 relative`}>
                  <CardTitle className="flex justify-between items-center text-lg font-medium">
                    {stat.title}
                    <Icon className="h-5 w-5" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="-mt-4">
                  <div className="bg-white rounded-full h-12 w-12 flex items-center justify-center text-2xl font-bold shadow-md">
                    {stat.value}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Total {stat.title.toLowerCase()}</p>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {/* Recent activity card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="mr-2 h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Welcome to the StudyGlobal admin dashboard! Here you can manage all aspects of your education platform.
              </p>
              <p className="text-sm text-gray-500">
                Use the navigation menu on the left to access different sections of the admin panel.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick actions card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => navigate('/admin/articles/create')}
                className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md text-sm font-medium transition-colors"
              >
                New Article
              </button>
              <button 
                onClick={() => navigate('/admin/scholarships/create')}
                className="px-4 py-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-sm font-medium transition-colors"
              >
                New Scholarship
              </button>
              <button 
                onClick={() => navigate('/admin/universities/create')}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md text-sm font-medium transition-colors"
              >
                New University
              </button>
              <button 
                onClick={() => navigate('/admin/news/create')}
                className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm font-medium transition-colors"
              >
                New News
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}