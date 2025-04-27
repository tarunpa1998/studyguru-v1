import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, MapPin, Award, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ScholarshipCard from "@/components/ScholarshipCard";

const UniversityDetail = () => {
  const { slug } = useParams();
  
  const { data: university, isLoading: universityLoading } = useQuery({
    queryKey: [`/api/universities/${slug}`],
  });

  const { data: scholarships = [], isLoading: scholarshipsLoading } = useQuery({
    queryKey: ['/api/scholarships'],
  });

  // Filter scholarships by university's country
  const relevantScholarships = scholarships
    .filter((scholarship: any) => scholarship.country === university?.country)
    .slice(0, 3);

  const isLoading = universityLoading || scholarshipsLoading;

  return (
    <>
      {university && (
        <Helmet>
          <title>{university.name} | StudyGlobal</title>
          <meta name="description" content={university.description} />
          <meta property="og:title" content={`${university.name} | StudyGlobal`} />
          <meta property="og:description" content={university.description} />
          <meta property="og:type" content="article" />
          {university.image && <meta property="og:image" content={university.image} />}
        </Helmet>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-6">
          <Link href="/universities">
            <a className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Universities
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-start gap-6 mb-8">
                <Skeleton className="h-32 w-32 rounded-lg" />
                <div className="flex-grow">
                  <Skeleton className="h-10 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
              <div className="space-y-3 mb-8">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-80 w-full rounded-lg" />
            </div>
          </div>
        ) : university ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                {university.image ? (
                  <img 
                    src={university.image} 
                    alt={university.name} 
                    className="h-32 w-32 object-cover rounded-lg" 
                  />
                ) : (
                  <div className="h-32 w-32 bg-slate-100 rounded-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-400">{university.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-slate-800 mb-2">{university.name}</h1>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-slate-600">{university.country}</span>
                    {university.ranking && (
                      <>
                        <div className="w-1 h-1 bg-slate-300 rounded-full mx-2"></div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-amber-500 mr-1" />
                          <span className="text-slate-600">Ranked #{university.ranking} Globally</span>
                        </div>
                      </>
                    )}
                  </div>
                  {university.features && university.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {university.features.map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-slate-50">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="prose prose-blue max-w-none mb-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Overview</h2>
                <p className="text-slate-700 leading-relaxed">{university.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-primary-50 rounded-lg border border-primary-100 p-6">
                  <h3 className="text-lg font-semibold text-primary-800 mb-4">Key Features</h3>
                  <ul className="space-y-2">
                    {university.features && university.features.length > 0 ? (
                      university.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                          <span>World-class education</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                          <span>Research opportunities</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                          <span>International student support</span>
                        </li>
                        <li className="flex items-start">
                          <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                          <span>Career counseling</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div className="bg-slate-50 rounded-lg border border-slate-100 p-6">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">Admission Requirements</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Academic transcripts</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>English proficiency (IELTS/TOEFL)</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Letters of recommendation</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <span>Statement of purpose</span>
                    </li>
                  </ul>
                </div>
              </div>

              {relevantScholarships.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800">Available Scholarships</h2>
                    <Link href="/scholarships">
                      <a className="text-primary-600 hover:text-primary-700 font-medium">View All</a>
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relevantScholarships.map((scholarship: any) => (
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
                </div>
              )}
            </div>

            <div>
              <Card className="sticky top-20">
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Website</h3>
                      <p className="text-primary-600">www.{university.name.toLowerCase().replace(/\s+/g, '')}.edu</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Admissions Email</h3>
                      <p>admissions@{university.name.toLowerCase().replace(/\s+/g, '')}.edu</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">International Office</h3>
                      <p>international@{university.name.toLowerCase().replace(/\s+/g, '')}.edu</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-slate-500 mb-1">Location</h3>
                      <p>{university.country}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full">Visit Official Website</Button>
                    <Button variant="outline" className="w-full">Request Information</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-slate-800 mb-4">University Not Found</h1>
            <p className="text-slate-600 mb-6">We couldn't find the university you're looking for.</p>
            <Link href="/universities">
              <Button>Back to Universities</Button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default UniversityDetail;
