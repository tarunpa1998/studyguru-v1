import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  CalendarClock, 
  MapPin, 
  ExternalLink, 
  Clock, 
  GraduationCap, 
  CheckCircle2, 
  BookOpen, 
  BadgeCheck,
  Lightbulb, 
  Award,
  ListChecks,
  BarChart2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

// Interface for Scholarship
interface Scholarship {
  id: string | number;
  title: string;
  slug: string;
  overview: string;
  description: string;
  highlights: string[];
  
  amount: string;
  deadline: string;
  duration: string;
  level: string;
  fieldsCovered: string[];
  eligibility: string;
  isRenewable: boolean;
  
  benefits: string[];
  applicationProcedure: string;
  country: string;
  tags: string[];
  link?: string;
}

const HighlightItem = ({ text }: { text: string }) => (
  <motion.div 
    className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="mt-0.5">
      <CheckCircle2 className="h-5 w-5 text-primary-500" />
    </div>
    <p className="text-slate-700">{text}</p>
  </motion.div>
);

const ScholarshipDetail = () => {
  const { slug } = useParams();
  
  const { data: scholarship, isLoading, error } = useQuery<Scholarship>({
    queryKey: [`/api/scholarships/${slug}`],
  });

  // Function to get tag color based on tag name
  const getTagColor = (tag: string): string => {
    const tagColorMap: Record<string, string> = {
      "Fully Funded": "bg-green-100 text-green-800",
      "Graduate": "bg-blue-100 text-blue-800",
      "Master's": "bg-blue-100 text-blue-800",
      "PhD": "bg-indigo-100 text-indigo-800",
      "Research": "bg-amber-100 text-amber-800",
      "Research-Based": "bg-amber-100 text-amber-800",
      "Partial Aid": "bg-blue-100 text-blue-800",
      "Undergraduate": "bg-purple-100 text-purple-800",
      "Need-Based": "bg-indigo-100 text-indigo-800",
      "Merit-Based": "bg-teal-100 text-teal-800",
      "Govt Funded": "bg-emerald-100 text-emerald-800",
      "Prestigious": "bg-purple-100 text-purple-800",
    };
    
    return tagColorMap[tag] || "bg-gray-100 text-gray-800";
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Scholarship</h1>
        <p className="text-slate-600 mb-6">We couldn't load this scholarship. Please try again later.</p>
        <Button 
          variant="outline" 
          onClick={() => window.location.href = '/scholarships'}
        >
          Back to Scholarships
        </Button>
      </div>
    );
  }

  return (
    <>
      {scholarship && (
        <Helmet>
          <title>{scholarship.title} | StudyGlobal</title>
          <meta name="description" content={scholarship.overview || scholarship.description} />
          <meta property="og:title" content={`${scholarship.title} | StudyGlobal`} />
          <meta property="og:description" content={scholarship.overview || scholarship.description} />
          <meta property="og:type" content="article" />
          <meta name="keywords" content={scholarship.tags.join(', ')} />
        </Helmet>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium p-0 h-auto"
            onClick={() => window.location.href = '/scholarships'}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scholarships
          </Button>
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
              {/* Header section */}
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{scholarship.title}</h1>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {scholarship.tags.map((tag: string, index: number) => (
                    <span 
                      key={index} 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center text-slate-600">
                  <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                  <span className="font-medium">{scholarship.country}</span>
                </div>
              </div>

              {/* Overview section */}
              <div className="bg-primary-50 border border-primary-100 p-6 rounded-xl mb-8">
                <h2 className="text-xl font-semibold text-primary-900 mb-3 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-primary-600" />
                  Overview
                </h2>
                <p className="text-slate-700 leading-relaxed">{scholarship.overview || scholarship.description}</p>
              </div>
              
              {/* Highlights section */}
              {scholarship.highlights && scholarship.highlights.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                    <Award className="h-5 w-5 mr-2 text-primary-600" />
                    Key Highlights
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {scholarship.highlights.map((highlight, index) => (
                      <HighlightItem key={index} text={highlight} />
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits section */}
              {scholarship.benefits && scholarship.benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                    <BarChart2 className="h-5 w-5 mr-2 text-primary-600" />
                    Benefits
                  </h2>
                  <ul className="space-y-2">
                    {scholarship.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <BadgeCheck className="h-5 w-5 mr-2 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Description section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary-600" />
                  Description
                </h2>
                <div className="prose prose-blue max-w-none">
                  {scholarship.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-slate-700 leading-relaxed mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* Application procedure section */}
              {scholarship.applicationProcedure && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
                    <ListChecks className="h-5 w-5 mr-2 text-primary-600" />
                    How to Apply
                  </h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                    <p className="text-slate-700">{scholarship.applicationProcedure}</p>
                  </div>
                </div>
              )}

              {/* Apply button */}
              {scholarship.link && (
                <div className="mb-8">
                  <Button asChild size="lg" className="w-full sm:w-auto">
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Scholarship details card */}
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle>Scholarship Details</CardTitle>
                  <CardDescription>Key information about this scholarship</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
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
                        <Clock className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Duration</span>
                      </div>
                      <span className="font-semibold">{scholarship.duration}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <GraduationCap className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Level</span>
                      </div>
                      <span className="font-semibold">{scholarship.level}</span>
                    </div>

                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <MapPin className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Country</span>
                      </div>
                      <span className="font-semibold">{scholarship.country}</span>
                    </div>
                    
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                      <div className="flex items-center text-slate-600">
                        <BadgeCheck className="h-5 w-5 mr-2 text-primary-500" />
                        <span>Renewable</span>
                      </div>
                      <span className="font-semibold">{scholarship.isRenewable ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                  
                  {/* Field of study */}
                  {scholarship.fieldsCovered && scholarship.fieldsCovered.length > 0 && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2 text-slate-800">Fields Covered</h3>
                      <div className="flex flex-wrap gap-2">
                        {scholarship.fieldsCovered.map((field, index) => (
                          <Badge key={index} variant="outline" className="bg-slate-50">
                            {field}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Eligibility criteria */}
                  <div className="mt-6">
                    <h3 className="font-medium mb-2 text-slate-800">Eligibility Criteria</h3>
                    <p className="text-slate-600 text-sm">{scholarship.eligibility}</p>
                  </div>
                  
                  {/* Apply button */}
                  {scholarship.link && (
                    <div className="mt-6">
                      <Button asChild className="w-full">
                        <a 
                          href={scholarship.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          Apply Now
                        </a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">Scholarship Not Found</h1>
            <p className="text-slate-600 mb-6">We couldn't find the scholarship you're looking for.</p>
            <Button onClick={() => window.location.href = '/scholarships'}>
              Back to Scholarships
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ScholarshipDetail;
