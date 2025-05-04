import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ScholarshipCard from "@/components/ScholarshipCard";
import ArticleCard from "@/components/ArticleCard";
import CountryCard from "@/components/CountryCard";
import NewsCard from "@/components/NewsCard";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

const SearchResults = () => {
  const [location] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  
  // Extract query parameter
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const query = searchParams.get('query') || '';
  
  // Fetch search results
  const { data: results, isLoading } = useQuery({
    queryKey: [`/api/search?query=${encodeURIComponent(query)}`],
    enabled: !!query,
  });

  // Count total results
  const totalResults = results ? 
    results.scholarships.length + 
    results.articles.length + 
    results.countries.length + 
    results.universities.length + 
    results.news.length : 0;

  return (
    <>
      <Helmet>
        <title>Search Results for "{query}" | Study Guru</title>
        <meta 
          name="description" 
          content={`Search results for "${query}" - find scholarships, universities, countries, articles and news.`}
        />
      </Helmet>

      <div className="bg-primary-600 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Search Results</h1>
          <div className="flex items-center text-white">
            <Search className="h-5 w-5 mr-2 text-primary-200" />
            <p className="text-primary-100">
              Showing results for: <span className="font-medium text-white">"{query}"</span>
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="space-y-8">
            <Skeleton className="h-12 w-full max-w-md mx-auto rounded-lg" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))}
            </div>
          </div>
        ) : results ? (
          <>
            <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-6 max-w-2xl mx-auto">
                <TabsTrigger value="all">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="scholarships">
                  Scholarships ({results.scholarships.length})
                </TabsTrigger>
                <TabsTrigger value="articles">
                  Articles ({results.articles.length})
                </TabsTrigger>
                <TabsTrigger value="countries">
                  Countries ({results.countries.length})
                </TabsTrigger>
                <TabsTrigger value="universities">
                  Universities ({results.universities.length})
                </TabsTrigger>
                <TabsTrigger value="news">
                  News ({results.news.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-6">
                {totalResults === 0 ? (
                  <NoResults query={query} />
                ) : (
                  <div className="space-y-10">
                    {results.scholarships.length > 0 && (
                      <SearchSection 
                        title="Scholarships" 
                        count={results.scholarships.length}
                        showViewAll={results.scholarships.length > 3}
                        link="/scholarships"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {results.scholarships.slice(0, 3).map((scholarship: any) => (
                            <ScholarshipCard
                              key={scholarship.id}
                              id={scholarship.id}
                              title={scholarship.title}
                              description={scholarship.description}
                              amount={scholarship.amount}
                              deadline={scholarship.deadline}
                              country={scholarship.country}
                              tags={scholarship.tags}
                              slug={scholarship.slug}
                            />
                          ))}
                        </div>
                      </SearchSection>
                    )}

                    {results.articles.length > 0 && (
                      <SearchSection 
                        title="Articles" 
                        count={results.articles.length}
                        showViewAll={results.articles.length > 3}
                        link="/articles"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {results.articles.slice(0, 3).map((article: any) => (
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
                      </SearchSection>
                    )}

                    {results.countries.length > 0 && (
                      <SearchSection 
                        title="Countries" 
                        count={results.countries.length}
                        showViewAll={results.countries.length > 4}
                        link="/countries"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {results.countries.slice(0, 4).map((country: any) => (
                            <CountryCard
                              key={country.id}
                              name={country.name}
                              image={country.image}
                              universities={country.universities}
                              acceptanceRate={country.acceptanceRate}
                              slug={country.slug}
                            />
                          ))}
                        </div>
                      </SearchSection>
                    )}

                    {results.universities.length > 0 && (
                      <SearchSection 
                        title="Universities" 
                        count={results.universities.length}
                        showViewAll={results.universities.length > 2}
                        link="/universities"
                      >
                        <div className="space-y-4">
                          {results.universities.slice(0, 2).map((university: any) => (
                            <Card key={university.id}>
                              <CardContent className="p-6">
                                <Link href={`/universities/${university.slug}`}>
                                  <a className="block">
                                    <h3 className="text-xl font-bold text-slate-800 hover:text-primary-600 transition-colors mb-2">
                                      {university.name}
                                    </h3>
                                    <div className="flex items-center mb-3">
                                      <span className="text-slate-600 text-sm">{university.country}</span>
                                      {university.ranking && (
                                        <span className="ml-3 text-sm bg-slate-100 px-2 py-0.5 rounded-full">
                                          Ranked #{university.ranking}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-slate-600">{university.description.substring(0, 150)}...</p>
                                  </a>
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </SearchSection>
                    )}

                    {results.news.length > 0 && (
                      <SearchSection 
                        title="News" 
                        count={results.news.length}
                        showViewAll={results.news.length > 3}
                        link="/news"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {results.news.slice(0, 3).map((news: any) => (
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
                      </SearchSection>
                    )}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="scholarships" className="mt-6">
                {results.scholarships.length === 0 ? (
                  <NoResults query={query} category="scholarships" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.scholarships.map((scholarship: any) => (
                      <ScholarshipCard
                        key={scholarship.id}
                        id={scholarship.id}
                        title={scholarship.title}
                        description={scholarship.description}
                        amount={scholarship.amount}
                        deadline={scholarship.deadline}
                        country={scholarship.country}
                        tags={scholarship.tags}
                        slug={scholarship.slug}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="articles" className="mt-6">
                {results.articles.length === 0 ? (
                  <NoResults query={query} category="articles" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.articles.map((article: any) => (
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
              </TabsContent>

              <TabsContent value="countries" className="mt-6">
                {results.countries.length === 0 ? (
                  <NoResults query={query} category="countries" />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.countries.map((country: any) => (
                      <CountryCard
                        key={country.id}
                        name={country.name}
                        image={country.image}
                        universities={country.universities}
                        acceptanceRate={country.acceptanceRate}
                        slug={country.slug}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="universities" className="mt-6">
                {results.universities.length === 0 ? (
                  <NoResults query={query} category="universities" />
                ) : (
                  <div className="space-y-4">
                    {results.universities.map((university: any) => (
                      <Card key={university.id}>
                        <CardContent className="p-6">
                          <Link href={`/universities/${university.slug}`}>
                            <a className="block">
                              <h3 className="text-xl font-bold text-slate-800 hover:text-primary-600 transition-colors mb-2">
                                {university.name}
                              </h3>
                              <div className="flex items-center mb-3">
                                <span className="text-slate-600 text-sm">{university.country}</span>
                                {university.ranking && (
                                  <span className="ml-3 text-sm bg-slate-100 px-2 py-0.5 rounded-full">
                                    Ranked #{university.ranking}
                                  </span>
                                )}
                              </div>
                              <p className="text-slate-600">{university.description}</p>
                            </a>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                {results.news.length === 0 ? (
                  <NoResults query={query} category="news" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.news.map((news: any) => (
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
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">No Results Found</h2>
            <p className="text-slate-600 mb-6">
              We couldn't find any results for "{query}". Please try another search term.
            </p>
            <Link href="/">
              <a className="text-primary-600 hover:text-primary-700 font-medium">
                Return to Home
              </a>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

// No results component
const NoResults = ({ query, category }: { query: string; category?: string }) => (
  <div className="text-center py-12">
    <h2 className="text-2xl font-bold text-slate-800 mb-4">No {category || "Results"} Found</h2>
    <p className="text-slate-600 mb-6">
      We couldn't find any {category || "results"} matching "{query}".
      {category ? " Please try another search term or check other categories." : " Please try another search term."}
    </p>
    <Link href="/">
      <a className="text-primary-600 hover:text-primary-700 font-medium">
        Return to Home
      </a>
    </Link>
  </div>
);

// Search section component
const SearchSection = ({ 
  title, 
  count, 
  children, 
  showViewAll,
  link
}: { 
  title: string; 
  count: number;
  children: React.ReactNode;
  showViewAll: boolean;
  link: string;
}) => (
  <div>
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold text-slate-800">
        {title} <span className="text-slate-500 text-base font-normal">({count})</span>
      </h2>
      {showViewAll && (
        <Link href={link}>
          <a className="text-primary-600 hover:text-primary-700 font-medium">
            View All
          </a>
        </Link>
      )}
    </div>
    {children}
  </div>
);

export default SearchResults;
