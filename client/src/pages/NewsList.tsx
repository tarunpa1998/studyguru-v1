import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import NewsCard from "@/components/NewsCard";
import FeaturedNewsItem from "@/components/FeaturedNewsItem";

const NewsList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const { data: newsItems = [], isLoading } = useQuery({
    queryKey: ['/api/news']
  });

  // Apply filters
  const filteredNews = newsItems.filter((news: any) => {
    const matchesSearch = news.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         news.summary.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = filterCategory ? news.category === filterCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filters
  const uniqueCategories = Array.from(new Set(newsItems.map((n: any) => n.category)));

  // Find featured news item
  const featuredNews = newsItems.find((news: any) => news.isFeatured);
  const regularNews = filteredNews.filter((news: any) => !news.isFeatured);

  return (
    <>
      <Helmet>
        <title>News | StudyGlobal</title>
        <meta 
          name="description" 
          content="Stay updated with the latest education news, scholarship announcements, and updates for international students."
        />
      </Helmet>

      <div className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Education News</h1>
          <p className="text-primary-100 max-w-2xl">
            Stay updated with the latest education news, scholarship announcements, visa changes, and other important updates for international students.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter News</h2>
            <Filter className="h-5 w-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <Input 
                id="search"
                placeholder="Search by keyword..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="category" className="mb-2 block">Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <>
            <Skeleton className="h-80 w-full rounded-lg mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <Skeleton className="h-5 w-20 rounded-full" />
                      <Skeleton className="h-4 w-24 ml-2" />
                    </div>
                    <Skeleton className="h-7 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {featuredNews && !filterCategory && !searchQuery && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Featured News</h2>
                <FeaturedNewsItem 
                  title={featuredNews.title}
                  summary={featuredNews.summary}
                  slug={featuredNews.slug}
                  publishDate={featuredNews.publishDate}
                  image={featuredNews.image}
                  category={featuredNews.category}
                />
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Latest News</h2>
              <p className="text-slate-600">{regularNews.length} articles found</p>
            </div>
            
            {regularNews.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-slate-800 mb-2">No news articles found</h3>
                <p className="text-slate-600">Try adjusting your filters to find more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularNews.map((news: any) => (
                  <NewsCard
                    key={news.id}
                    title={news.title}
                    summary={news.summary}
                    slug={news.slug}
                    publishDate={news.publishDate}
                    image={news.image}
                    category={news.category}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default NewsList;
