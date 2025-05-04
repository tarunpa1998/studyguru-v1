import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import ArticleCard from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState, useRef } from "react";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { useInView } from "framer-motion";

// Define the Article type
interface Article {
  id: string | number;
  title: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle?: string;
  authorImage?: string;
  image?: string;
  category: string;
}

const LatestArticles = () => {
  const { data, isLoading } = useQuery<Article[]>({
    queryKey: ['/api/articles']
  });
  
  const articles: Article[] = data || [];
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { once: false, amount: 0.3 });
  const intervalRef = useRef<number | null>(null);
  
  // Setup auto-scrolling when carousel is in view
  useEffect(() => {
    if (!api || !isInView) {
      // Clear interval if carousel is not in view
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    // Start auto-scrolling when in view
    intervalRef.current = window.setInterval(() => {
      api.scrollNext();
    }, 2000);
    
    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (intervalRef.current !== null) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [api, isInView]);

  const handleViewAll = () => {
    window.location.href = '/articles';
  };

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Separator className="mb-8" />
          <div className="flex justify-between items-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Latest Articles</h2>
            <motion.div 
              className="text-primary hover:text-primary/90 font-medium flex items-center cursor-pointer"
              onClick={handleViewAll}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.95 }}
            >
              View all
              <ChevronRight className="h-5 w-5 ml-1" />
            </motion.div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden border border-border">
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
          <div className="relative" ref={carouselRef}>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                }}
                setApi={setApi}
                className="w-full"
              >
                <CarouselContent>
                  {articles.map((article) => (
                    <CarouselItem key={article.id} className="md:basis-1/2 lg:basis-1/3 pl-4">
                      <ArticleCard
                        key={article.id}
                        title={article.title}
                        summary={article.summary}
                        slug={article.slug}
                        publishDate={article.publishDate}
                        author={article.author}
                        authorTitle={article.authorTitle || ''}
                        authorImage={article.authorImage || ''}
                        image={article.image || ''}
                        category={article.category}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <div className="flex justify-center gap-2 mt-8">
                  <CarouselPrevious className="static transform-none h-9 w-9 mr-2" />
                  <CarouselNext className="static transform-none h-9 w-9" />
                </div>
              </Carousel>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestArticles;




