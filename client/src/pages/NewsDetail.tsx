import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Share2,
  List,
  ChevronRight,
  MessageCircle,
  BookOpen,
  BookmarkPlus,
  Search,
  X
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "@/contexts/ThemeContext";

// Define the News type
interface NewsItem {
  id: string | number;
  title: string;
  content: string;
  summary: string;
  slug: string;
  publishDate: string;
  image?: string;
  category: string;
  isFeatured: boolean;
  relatedArticles?: string[];
  seo?: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  views?: number;
  readingTime?: string;
  helpful?: {
    yes: number;
    no: number;
  };
  tableOfContents?: {
    id: string;
    title: string;
    level: number;
  }[];
  faqs?: {
    question: string;
    answer: string;
  }[];
}

// Related news card component
const RelatedNewsCard = ({ newsItem }: { newsItem: NewsItem }) => {
  const { theme } = useTheme();
  const handleClick = () => {
    window.location.href = `/news/${newsItem.slug}`;
  };

  return (
    <motion.div
      className="bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {newsItem.image && (
        <div className="h-40 overflow-hidden">
          <img 
            src={newsItem.image} 
            alt={newsItem.title} 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{newsItem.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{newsItem.summary}</p>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>{formatDate(newsItem.publishDate)}</span>
          </div>
          {newsItem.readingTime && (
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{newsItem.readingTime}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NewsDetail = () => {
  const { theme } = useTheme();
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const [helpfulVote, setHelpfulVote] = useState<'yes' | 'no' | null>(null);
  const [relatedNewsData, setRelatedNewsData] = useState<NewsItem[]>([]);
  
  const { data: newsItem, isLoading: newsLoading } = useQuery<NewsItem>({
    queryKey: [`/api/news/${slug}`],
  });

  const { data: allNews = [], isLoading: allNewsLoading } = useQuery<NewsItem[]>({
    queryKey: ['/api/news'],
  });

  // Fetch related news items when news is loaded
  useEffect(() => {
    if (newsItem?.relatedArticles && newsItem.relatedArticles.length > 0) {
      const fetchRelatedNews = async () => {
        try {
          const slugs = newsItem.relatedArticles || [];
          const promises = slugs.map(async (relatedSlug) => {
            const response = await fetch(`/api/news/${relatedSlug}`);
            if (response.ok) {
              return await response.json();
            }
            return null;
          });
          
          const results = await Promise.all(promises);
          setRelatedNewsData(results.filter(Boolean));
        } catch (error) {
          console.error("Error fetching related news:", error);
        }
      };
      
      fetchRelatedNews();
    } else {
      // Fallback to filtering all news by category
      const related = allNews
        .filter(item => item.category === newsItem?.category && item.slug !== slug)
        .slice(0, 3);
      setRelatedNewsData(related);
    }
  }, [newsItem, allNews, slug]);

  // Handle scroll to section when clicking on table of contents
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const yOffset = -80; // Adjust for header height
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(sectionId);
      
      // On mobile, close the table of contents after clicking
      if (window.innerWidth < 768) {
        setShowTableOfContents(false);
      }
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    if (!newsItem?.tableOfContents) return;
    
    const handleScroll = () => {
      // Safely access tableOfContents
      const tocItems = newsItem.tableOfContents || [];
      const sections = tocItems.map(item => document.getElementById(item.id));
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [newsItem]);

  // Handle helpful votes
  const handleHelpfulVote = (vote: 'yes' | 'no') => {
    if (helpfulVote === vote) {
      setHelpfulVote(null);
    } else {
      setHelpfulVote(vote);
    }
    
    // In a real app, you would send this to the server
    console.log(`User voted ${vote} for news ${slug}`);
  };

  // Handle share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: newsItem?.title,
        text: newsItem?.summary,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const isLoading = newsLoading || allNewsLoading;

  return (
    <>
      {newsItem && (
        <Helmet>
          <title>{newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`}</title>
          <meta name="description" content={newsItem.seo?.metaDescription || newsItem.summary} />
          <meta property="og:title" content={newsItem.seo?.metaTitle || `${newsItem.title} | Study Guru News`} />
          <meta property="og:description" content={newsItem.seo?.metaDescription || newsItem.summary} />
          <meta property="og:type" content="article" />
          {newsItem.image && <meta property="og:image" content={newsItem.image} />}
          {newsItem.seo?.keywords && <meta name="keywords" content={newsItem.seo.keywords.join(', ')} />}
        </Helmet>
      )}

      {/* Mobile Table of Contents Overlay */}
      <AnimatePresence>
        {showTableOfContents && newsItem?.tableOfContents && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTableOfContents(false)}
          >
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[70vh] overflow-y-auto"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Table of Contents</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowTableOfContents(false)}
                  className="p-1 h-auto"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="space-y-1">
                {newsItem.tableOfContents.map((item) => (
                  <div
                    key={item.id}
                    className={`pl-${(item.level - 1) * 4} py-2 border-l-2 ${
                      activeSection === item.id 
                        ? 'border-primary-600 text-primary-600 font-medium' 
                        : 'border-transparent hover:border-slate-300 text-slate-700'
                    } cursor-pointer transition-colors duration-200`}
                    onClick={() => scrollToSection(item.id)}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium p-0 h-auto"
            onClick={() => window.location.href = '/news'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Button>
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main content */}
            <div className="lg:col-span-8">
              {/* Hero section */}
              <div className="mb-8">
                {newsItem.image && (
                  <div className="mb-6">
                    <img 
                      src={newsItem.image} 
                      alt={newsItem.title} 
                      className="w-full h-auto rounded-xl shadow-md object-cover max-h-[500px]" 
                    />
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                      {newsItem.category}
                    </span>
                    {newsItem.isFeatured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                        Featured
                      </span>
                    )}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">{newsItem.title}</h1>

                  {/* Article meta */}
                  <div className="flex flex-wrap items-center text-muted-foreground gap-y-2 gap-x-4">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{formatDate(newsItem.publishDate)}</span>
                    </div>
                    
                    {newsItem.readingTime && (
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2" />
                        <span>{newsItem.readingTime}</span>
                      </div>
                    )}
                    
                    {newsItem.views !== undefined && (
                      <div className="flex items-center">
                        <Eye className="h-5 w-5 mr-2" />
                        <span>{newsItem.views.toLocaleString()} views</span>
                      </div>
                    )}
                  </div>

                  {/* Table of contents toggle for mobile */}
                  {newsItem.tableOfContents && newsItem.tableOfContents.length > 0 && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="md:hidden flex items-center"
                      onClick={() => setShowTableOfContents(true)}
                    >
                      <List className="h-4 w-4 mr-2" />
                      Table of Contents
                    </Button>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="mb-8">
                <div className="bg-muted dark:bg-muted/30 border border-border rounded-xl p-5">
                  <h2 className="text-lg font-semibold mb-2 text-foreground">Summary</h2>
                  <p className="text-foreground">{newsItem.summary}</p>
                </div>
              </div>

              {/* Main news content */}
              <div className="article-content prose prose-blue dark:prose-invert max-w-none mb-8">
                {newsItem.tableOfContents && newsItem.tableOfContents.length > 0 ? (
                  // Content with headers from table of contents
                  newsItem.content.split('\n\n').map((paragraph, index) => {
                    // Check if this paragraph matches a header from table of contents
                    const headerMatch = newsItem.tableOfContents?.find(
                      toc => paragraph.includes(toc.title)
                    );
                    
                    if (headerMatch) {
                      // Render as heading with proper ID for scrolling
                      return (
                        <h2 
                          key={index} 
                          id={headerMatch.id}
                          className="text-xl font-bold text-foreground mt-8 mb-4 scroll-mt-24"
                        >
                          {headerMatch.title}
                        </h2>
                      );
                    } else {
                      // Regular paragraph
                      return (
                        <p key={index} className="mb-4 text-foreground leading-relaxed">
                          {paragraph}
                        </p>
                      );
                    }
                  })
                ) : (
                  // Regular content without table of contents
                  newsItem.content.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-foreground leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>

              {/* Interaction section: Helpful + Share */}
              <div className="border-t border-b border-border py-6 my-8">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="flex items-center">
                    <span className="mr-3 text-foreground">Was this article helpful?</span>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={helpfulVote === 'yes' ? 'default' : 'outline'}
                              size="sm"
                              className={`py-1 px-2 h-auto ${
                                helpfulVote === 'yes' ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-600' : ''
                              }`}
                              onClick={() => handleHelpfulVote('yes')}
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{newsItem.helpful?.yes || 0}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This was helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant={helpfulVote === 'no' ? 'default' : 'outline'}
                              size="sm"
                              className={`py-1 px-2 h-auto ${
                                helpfulVote === 'no' ? 'bg-red-600 dark:bg-red-700 hover:bg-red-700 dark:hover:bg-red-600' : ''
                              }`}
                              onClick={() => handleHelpfulVote('no')}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              <span>{newsItem.helpful?.no || 0}</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This wasn't helpful</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="py-1 px-2 h-auto"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      className="py-1 px-2 h-auto"
                      onClick={() => window.print()}
                    >
                      <BookmarkPlus className="h-4 w-4 mr-1" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              {newsItem.faqs && newsItem.faqs.length > 0 && (
                <div className="my-10">
                  <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                  <Accordion type="single" collapsible className="bg-muted dark:bg-muted/30 border border-border rounded-xl px-4">
                    {newsItem.faqs.map((faq, index) => (
                      <AccordionItem value={`faq-${index}`} key={index} className="border-b border-border last:border-0">
                        <AccordionTrigger className="hover:text-primary-600 dark:hover:text-primary-400 text-foreground">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Related News */}
              {relatedNewsData.length > 0 && (
                <div className="my-10">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Related News</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary-600 dark:text-primary-400"
                      onClick={() => window.location.href = `/news?category=${encodeURIComponent(newsItem.category)}`}
                    >
                      View All
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {relatedNewsData.map((relatedNews) => (
                      <RelatedNewsCard
                        key={relatedNews.id}
                        newsItem={relatedNews}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-20 space-y-6">
                {/* Table of Contents - Desktop */}
                {newsItem.tableOfContents && newsItem.tableOfContents.length > 0 && (
                  <Card className="hidden md:block">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <List className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                        Table of Contents
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-1">
                        {newsItem.tableOfContents.map((item) => (
                          <motion.div
                            key={item.id}
                            className={`pl-${(item.level - 1) * 4} py-2 border-l-2 ${
                              activeSection === item.id 
                                ? 'border-primary-600 dark:border-primary-400 text-primary-600 dark:text-primary-400 font-medium' 
                                : 'border-transparent hover:border-border text-foreground'
                            } cursor-pointer transition-colors duration-200`}
                            onClick={() => scrollToSection(item.id)}
                            whileHover={{ x: 3 }}
                          >
                            {item.title}
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Keywords Card */}
                {newsItem.seo?.keywords && newsItem.seo.keywords.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Search className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                        Keywords
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {newsItem.seo.keywords.map((keyword, index) => (
                          <div 
                            key={index}
                            className="bg-muted dark:bg-muted/50 text-foreground px-3 py-1 rounded-full text-xs hover:bg-primary-100 dark:hover:bg-primary-900 hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200 cursor-pointer"
                            onClick={() => window.location.href = `/search?q=${encodeURIComponent(keyword)}`}
                          >
                            {keyword}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Search news card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Search News</CardTitle>
                    <CardDescription>Find the latest educational news</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search news..." 
                        className="w-full pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-background text-foreground"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const value = (e.target as HTMLInputElement).value;
                            window.location.href = `/search?q=${encodeURIComponent(value)}`;
                          }
                        }}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="pb-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = '/news'}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse All News
                    </Button>
                  </CardFooter>
                </Card>

                {/* Latest News Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-foreground">Latest News</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allNews.slice(0, 3).map((news) => (
                      <div 
                        key={news.id} 
                        className="flex gap-3 cursor-pointer hover:bg-muted/80 dark:hover:bg-muted/20 p-2 rounded-lg transition-colors duration-200"
                        onClick={() => window.location.href = `/news/${news.slug}`}
                      >
                        {news.image && (
                          <img 
                            src={news.image} 
                            alt={news.title} 
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
                          />
                        )}
                        <div>
                          <h4 className="font-medium text-sm line-clamp-2 text-foreground">{news.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>{formatDate(news.publishDate)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-4">News Article Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find the news article you're looking for.</p>
            <Button onClick={() => window.location.href = '/news'}>
              Back to News
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsDetail;









