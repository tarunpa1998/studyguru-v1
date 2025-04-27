import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const ArticleDetail = () => {
  const { slug } = useParams();
  
  const { data: article, isLoading, error } = useQuery({
    queryKey: [`/api/articles/${slug}`],
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Article</h1>
        <p className="text-slate-600 mb-6">We couldn't load this article. Please try again later.</p>
        <Link href="/articles">
          <Button variant="outline">Back to Articles</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {article && (
        <Helmet>
          <title>{article.title} | StudyGlobal</title>
          <meta name="description" content={article.summary} />
          <meta property="og:title" content={`${article.title} | StudyGlobal`} />
          <meta property="og:description" content={article.summary} />
          <meta property="og:type" content="article" />
          {article.image && <meta property="og:image" content={article.image} />}
        </Helmet>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/articles">
            <a className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Articles
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div>
            <Skeleton className="h-48 md:h-64 w-full mb-6 rounded-lg" />
            <Skeleton className="h-10 w-3/4 mb-4" />
            <div className="flex items-center mb-6 gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
            </div>
          </div>
        ) : article ? (
          <div>
            {article.image && (
              <div className="mb-6">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-auto rounded-lg shadow-md object-cover max-h-[400px]" 
                />
              </div>
            )}

            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
              {article.category}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{article.title}</h1>

            <div className="flex flex-wrap items-center text-slate-500 mb-8 gap-4">
              <div className="flex items-center">
                {article.authorImage ? (
                  <img 
                    src={article.authorImage} 
                    alt={article.author} 
                    className="h-8 w-8 rounded-full mr-2" 
                  />
                ) : (
                  <User className="h-5 w-5 mr-2" />
                )}
                <span>{article.author}</span>
                {article.authorTitle && (
                  <span className="text-slate-400 ml-1">- {article.authorTitle}</span>
                )}
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(article.publishDate)}</span>
              </div>
            </div>

            <div className="prose prose-blue max-w-none mb-8">
              {/* Split content by paragraphs and render */}
              {article.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 text-slate-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="border-t border-slate-200 pt-8 mt-8">
              <h2 className="text-xl font-semibold mb-4">Related Articles</h2>
              <p className="text-slate-600">Check out our other articles on {article.category}</p>
              <Link href={`/articles?category=${encodeURIComponent(article.category)}`}>
                <a className="inline-block mt-4 text-primary-600 hover:text-primary-700 font-medium">
                  View More Articles in {article.category}
                </a>
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">We couldn't find the article you're looking for.</p>
            <Link href="/articles">
              <Button>Back to Articles</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ArticleDetail;
