import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import NewsCard from "@/components/NewsCard";
import { formatDate } from "@/lib/utils";

const NewsDetail = () => {
  const { slug } = useParams();
  
  const { data: newsItem, isLoading: newsLoading } = useQuery({
    queryKey: [`/api/news/${slug}`],
  });

  const { data: allNews = [], isLoading: allNewsLoading } = useQuery({
    queryKey: ['/api/news'],
  });

  // Get related news (same category, excluding current news)
  const relatedNews = allNews
    .filter((item: any) => item.category === newsItem?.category && item.slug !== slug)
    .slice(0, 3);

  const isLoading = newsLoading || allNewsLoading;

  return (
    <>
      {newsItem && (
        <Helmet>
          <title>{newsItem.title} | StudyGlobal</title>
          <meta name="description" content={newsItem.summary} />
          <meta property="og:title" content={`${newsItem.title} | StudyGlobal`} />
          <meta property="og:description" content={newsItem.summary} />
          <meta property="og:type" content="article" />
          {newsItem.image && <meta property="og:image" content={newsItem.image} />}
        </Helmet>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/news">
            <a className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div>
            <Skeleton className="h-60 md:h-80 w-full mb-6 rounded-lg" />
            <Skeleton className="h-10 w-3/4 mb-2" />
            <div className="flex items-center mb-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-32 ml-4" />
            </div>
            <div className="space-y-3 mb-8">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
            <Skeleton className="h-8 w-56 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : newsItem ? (
          <div>
            {newsItem.image && (
              <div className="mb-6">
                <img 
                  src={newsItem.image} 
                  alt={newsItem.title} 
                  className="w-full h-auto rounded-lg shadow-md object-cover max-h-[500px]" 
                />
              </div>
            )}

            <div className="mb-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {newsItem.category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{newsItem.title}</h1>

            <div className="flex items-center text-slate-500 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(newsItem.publishDate)}</span>
              </div>
            </div>

            <div className="prose prose-blue max-w-none mb-12">
              {/* Split content by paragraphs and render */}
              {newsItem.content.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {relatedNews.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Related News</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedNews.map((news: any) => (
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
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">News Article Not Found</h1>
            <p className="text-slate-600 mb-6">We couldn't find the news article you're looking for.</p>
            <Link href="/news">
              <Button>Back to News</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsDetail;
