import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import FeaturedNewsItem from "./FeaturedNewsItem";
import NewsCard from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

interface NewsItem {
  id: string | number;
  title: string;
  summary: string;
  slug: string;
  publishDate: string;
  image: string;
  category: string;
  isFeatured: boolean;
}

const EducationNews = () => {
  const { data: newsItems = [], isLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });
  
  const featuredNews = newsItems.find((news) => news.isFeatured);
  const regularNews = newsItems.filter((news) => !news.isFeatured).slice(0, 2);

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Education News</h2>
            <Link href="/news">
              <motion.div 
                className="text-primary hover:text-primary/90 font-medium flex items-center cursor-pointer"
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                View all
                <ChevronRight className="h-5 w-5 ml-1" />
              </motion.div>
            </Link>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
                <Skeleton className="h-64 md:h-80 w-full" />
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-4 w-32 ml-2" />
                  </div>
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-5 w-full mb-1" />
                  <Skeleton className="h-5 w-3/4" />
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
                  <div className="flex flex-col sm:flex-row lg:flex-col">
                    <Skeleton className="h-48 sm:w-1/3 lg:w-full lg:h-40" />
                    <div className="p-4 sm:w-2/3 lg:w-full">
                      <div className="flex items-center mb-2">
                        <Skeleton className="h-5 w-24 rounded-full" />
                        <Skeleton className="h-4 w-28 ml-2" />
                      </div>
                      <Skeleton className="h-6 w-full mb-1" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {featuredNews && (
              <div className="lg:col-span-2">
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
            <div className="space-y-6">
              {regularNews.map((news) => (
                <NewsCard
                  key={news.id}
                  title={news.title}
                  summary={news.summary}
                  slug={news.slug}
                  publishDate={news.publishDate}
                  image={news.image}
                  category={news.category}
                  layout="horizontal"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default EducationNews;

