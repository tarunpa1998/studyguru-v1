import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Globe, GraduationCap, Newspaper, User } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';

interface CountData {
  scholarships: number;
  articles: number;
  countries: number;
  universities: number;
  news: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<CountData>({
    scholarships: 0,
    articles: 0,
    countries: 0,
    universities: 0,
    news: 0,
  });

  // Fetch database stats
  const { data: scholarships } = useQuery({
    queryKey: ['/api/scholarships'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const { data: articles } = useQuery({
    queryKey: ['/api/articles'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const { data: countries } = useQuery({
    queryKey: ['/api/countries'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const { data: universities } = useQuery({
    queryKey: ['/api/universities'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  const { data: news } = useQuery({
    queryKey: ['/api/news'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
  });

  // Update stats when data is loaded
  useEffect(() => {
    setStats({
      scholarships: scholarships?.length || 0,
      articles: articles?.length || 0,
      countries: countries?.length || 0,
      universities: universities?.length || 0,
      news: news?.length || 0,
    });
  }, [scholarships, articles, countries, universities, news]);

  // Stat cards data
  const statCards = [
    {
      title: 'Articles',
      value: stats.articles,
      icon: FileText,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Scholarships',
      value: stats.scholarships,
      icon: GraduationCap,
      color: 'bg-green-100 text-green-700',
    },
    {
      title: 'Countries',
      value: stats.countries,
      icon: Globe,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: 'Universities',
      value: stats.universities,
      icon: GraduationCap,
      color: 'bg-orange-100 text-orange-700',
    },
    {
      title: 'News',
      value: stats.news,
      icon: Newspaper,
      color: 'bg-red-100 text-red-700',
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <div className={`rounded-full p-2 ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground">
                  Total {card.title.toLowerCase()}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">MongoDB Status</h3>
              <p className="text-sm text-muted-foreground">
                The MongoDB connection is currently 
                <span className="ml-1 font-medium text-red-500">disconnected</span>.
                Contact your administrator to set up MongoDB for production use.
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 font-semibold">Data Management</h3>
              <p className="text-sm text-muted-foreground">
                You can manage content using the sidebar navigation. 
                Add, edit, or delete content as needed.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className={`rounded-full p-2 bg-blue-100 text-blue-700`}>
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">Admin logged in</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}