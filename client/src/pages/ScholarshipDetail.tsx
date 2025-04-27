import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, CalendarClock, MapPin, ExternalLink, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const ScholarshipDetail = () => {
  const { slug } = useParams();
  
  const { data: scholarship, isLoading, error } = useQuery({
    queryKey: [`/api/scholarships/${slug}`],
  });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Scholarship</h1>
        <p className="text-slate-600 mb-6">We couldn't load this scholarship. Please try again later.</p>
        <Link href="/scholarships">
          <Button variant="outline">Back to Scholarships</Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {scholarship && (
        <Helmet>
          <title>{scholarship.title} | StudyGlobal</title>
          <meta name="description" content={scholarship.description} />
          <meta property="og:title" content={`${scholarship.title} | StudyGlobal`} />
          <meta property="og:description" content={scholarship.description} />
          <meta property="og:type" content="article" />
        </Helmet>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/scholarships">
            <a className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scholarships
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-6 w-56 mb-4" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        ) : scholarship ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{scholarship.title}</h1>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {scholarship.tags.map((tag: string, index: number) => {
                  const tagColorMap: Record<string, string> = {
                    "Fully Funded": "bg-green-100 text-green-800",
                    "Merit-Based": "bg-blue-100 text-blue-800",
                    "Research": "bg-amber-100 text-amber-800",
                    "Partial Aid": "bg-blue-100 text-blue-800",
                    "Undergraduate": "bg-purple-100 text-purple-800",
                    "Need-Based": "bg-indigo-100 text-indigo-800",
                    "Govt Funded": "bg-emerald-100 text-emerald-800",
                  };
                  
                  return (
                    <span 
                      key={index} 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        tagColorMap[tag] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center mb-6 text-slate-600">
                <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                <span className="font-medium">{scholarship.country}</span>
              </div>

              <div className="prose prose-blue max-w-none mb-8">
                <p className="text-slate-700 leading-relaxed">{scholarship.description}</p>
              </div>

              {scholarship.link && (
                <div className="mb-8">
                  <Button asChild>
                    <a 
                      href={scholarship.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center"
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Scholarship Details</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <Clock className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Value</span>
                      </div>
                      <span className="font-semibold text-accent-500">{scholarship.amount}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <CalendarClock className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Deadline</span>
                      </div>
                      <span className="font-semibold">{scholarship.deadline}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Country</span>
                      </div>
                      <span className="font-semibold">{scholarship.country}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">Eligibility Criteria</h3>
                    <ul className="list-disc pl-5 text-slate-600 space-y-1">
                      <li>Academic excellence</li>
                      <li>Meeting country-specific requirements</li>
                      <li>Complete application with all required documents</li>
                      <li>Meeting application deadline</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Scholarship Not Found</h1>
            <p className="text-slate-600 mb-6">We couldn't find the scholarship you're looking for.</p>
            <Link href="/scholarships">
              <Button>Back to Scholarships</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default ScholarshipDetail;
