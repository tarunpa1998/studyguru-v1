import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import ArticleCard from "./ArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

const LatestArticles = () => {
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/articles']
  });

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Latest Articles</h2>
          <Link href="/articles">
            <a className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View all
              <ChevronRight className="h-5 w-5 ml-1" />
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((article: any) => (
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
      </div>
    </section>
  );
};

export default LatestArticles;
