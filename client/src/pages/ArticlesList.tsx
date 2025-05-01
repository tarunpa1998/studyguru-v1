import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import ArticleCard from "@/components/ArticleCard";

const ArticlesList = () => {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(location.split('?')[1] || '');
  const initialCategory = queryParams.get('category') || '';

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState(initialCategory);

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/articles']
  });

  // Apply filters
  const filteredArticles = articles.filter((article: any) => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory ? article.category === filterCategory : true;

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filters
  const uniqueCategories = Array.from(new Set(articles.map((a: any) => a.category)));

  return (
    <>
      <Helmet>
        <title>Articles | StudyGlobal</title>
        <meta 
          name="description" 
          content="Explore expert advice and real student experiences in our collection of international education articles."
        />
      </Helmet>

      <div className="bg-primary-600 py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-4">Articles & Guides</h1>
          <p className="text-primary-100 max-w-2xl">
            Explore expert advice, tips, and real student experiences to help you navigate your international education journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter Articles</h2>
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
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24 ml-2" />
                  </div>
                  <Skeleton className="h-7 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex items-center">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="ml-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32 mt-1" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600">{filteredArticles.length} articles found</p>
            </div>
            {filteredArticles.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-slate-800 mb-2">No articles found</h3>
                <p className="text-slate-600">Try adjusting your filters to find more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredArticles.map((article: any) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    summary={article.summary}
                    slug={article.slug}
                    publishDate={article.publishDate}
                    author={article.author}
                    authorTitle={article.authorTitle}
                    authorImage={article.authorImage}
                    image={article.image}
                    category={article.category}
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

export default ArticlesList;