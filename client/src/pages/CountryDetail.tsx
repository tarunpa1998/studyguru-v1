import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ArrowLeft, Building2, GraduationCap, BookOpen, Check } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const CountryDetail = () => {
  const { slug } = useParams();
  
  const { data: country, isLoading: countryLoading } = useQuery({
    queryKey: [`/api/countries/${slug}`],
  });

  const { data: universities = [], isLoading: universitiesLoading } = useQuery({
    queryKey: ['/api/universities'],
  });

  const { data: scholarships = [], isLoading: scholarshipsLoading } = useQuery({
    queryKey: ['/api/scholarships'],
  });

  // Filter universities by country
  const countryUniversities = universities.filter((uni: any) => {
    return uni.country === country?.name;
  }).slice(0, 3);

  // Filter scholarships by country
  const countryScholarships = scholarships.filter((scholarship: any) => {
    return scholarship.country === country?.name;
  }).slice(0, 3);

  const isLoading = countryLoading || universitiesLoading || scholarshipsLoading;

  return (
    <>
      {country && (
        <Helmet>
          <title>{country.name} | Study Destinations | StudyGlobal</title>
          <meta name="description" content={country.description} />
          <meta property="og:title" content={`${country.name} | Study Destinations | StudyGlobal`} />
          <meta property="og:description" content={country.description} />
          <meta property="og:type" content="article" />
          {country.image && <meta property="og:image" content={country.image} />}
        </Helmet>
      )}

      {countryLoading ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="mb-6">
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-80 w-full rounded-lg mb-6" />
              <div className="space-y-3">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-4/5" />
              </div>
            </div>
            <div>
              <Skeleton className="h-64 w-full rounded-lg" />
            </div>
          </div>
        </div>
      ) : country ? (
        <>
          <div className="h-96 relative overflow-hidden">
            <img 
              src={country.image} 
              alt={country.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-white">{country.name}</h1>
                <div className="flex items-center text-white mt-2">
                  <Building2 className="h-5 w-5 mr-2" />
                  <span>{country.universities.toLocaleString()}+ Universities</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-6">
              <Link href="/countries">
                <a className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Countries
                </a>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose prose-blue max-w-none mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">About Studying in {country.name}</h2>
                  <p className="text-slate-700 leading-relaxed mb-6">{country.description}</p>
                  
                  <div className="bg-primary-50 p-6 rounded-lg border border-primary-100 mb-6">
                    <h3 className="text-lg font-semibold text-primary-800 mb-3">Key Facts About Studying in {country.name}</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                        <span>Home to {country.universities.toLocaleString()}+ universities and colleges</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                        <span>{country.acceptanceRate}</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                        <span>Diverse range of academic programs available</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5" />
                        <span>Strong international student support services</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {countryUniversities.length > 0 && (
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-slate-800">Top Universities</h2>
                      <Link href="/universities">
                        <a className="text-primary-600 hover:text-primary-700 font-medium">View All</a>
                      </Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {countryUniversities.map((university: any) => (
                        <motion.div 
                          key={university.id}
                          className="bg-white rounded-xl shadow-sm p-4 border border-slate-100"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link href={`/universities/${university.slug}`}>
                            <a className="block">
                              <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">{university.name}</h3>
                              <p className="text-sm text-slate-600 mb-2">{university.description.substring(0, 100)}...</p>
                              <div className="flex items-center text-primary-600 text-sm font-medium">
                                Learn More
                              </div>
                            </a>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {countryScholarships.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl font-bold text-slate-800">Available Scholarships</h2>
                      <Link href="/scholarships">
                        <a className="text-primary-600 hover:text-primary-700 font-medium">View All</a>
                      </Link>
                    </div>
                    <div className="space-y-4">
                      {countryScholarships.map((scholarship: any) => (
                        <motion.div 
                          key={scholarship.id}
                          className="bg-white rounded-xl shadow-sm p-4 border border-slate-100"
                          whileHover={{ y: -5 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Link href={`/scholarships/${scholarship.slug}`}>
                            <a className="block">
                              <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">{scholarship.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {scholarship.tags.slice(0, 2).map((tag: string, index: number) => (
                                  <span 
                                    key={index} 
                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">Deadline: {scholarship.deadline}</span>
                                <span className="text-accent-500 font-medium">{scholarship.amount}</span>
                              </div>
                            </a>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Card className="sticky top-20">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Study in {country.name}</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-full mr-3">
                          <Building2 className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Universities</p>
                          <p className="font-semibold">{country.universities.toLocaleString()}+</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Acceptance Rate</p>
                          <p className="font-semibold">{country.acceptanceRate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                          <BookOpen className="h-6 w-6 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Language</p>
                          <p className="font-semibold">
                            {country.name === "United States" || country.name === "United Kingdom" || country.name === "Australia" || country.name === "Canada" 
                              ? "English" 
                              : country.name === "Germany" 
                                ? "German" 
                                : country.name === "France" 
                                  ? "French" 
                                  : "Various"}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <Link href="/scholarships">
                      <Button className="w-full">Find Scholarships</Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Country Not Found</h1>
          <p className="text-slate-600 mb-6">We couldn't find the country you're looking for.</p>
          <Link href="/countries">
            <Button>Back to Countries</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default CountryDetail;
