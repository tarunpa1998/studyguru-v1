import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  Building2, 
  GraduationCap, 
  BookOpen, 
  Check, 
  MapPin, 
  Globe, 
  DollarSign, 
  Home, 
  Plane,
  Award,
  Landmark,
  Clock
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
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Interface for Country
interface Country {
  id: string | number;
  name: string;
  slug: string;
  overview: string;
  description: string;
  highlights: string[];

  universities: number;
  acceptanceRate: string;
  language: string;
  currency: string;
  averageTuition: string;
  averageLivingCost: string;
  visaRequirement: string;

  popularCities: string[];
  topUniversities: string[];
  educationSystem: string;
  image?: string;
  flag?: string;
}

// Interface for University
interface University {
  id: string | number;
  name: string;
  description: string;
  country: string;
  ranking?: number;
  image?: string;
  slug: string;
  features?: string[];
}

// Interface for Scholarship
interface Scholarship {
  id: string | number;
  title: string;
  slug: string;
  overview: string;
  description: string;
  amount: string;
  deadline: string;
  duration: string;
  level: string;
  country: string;
  tags: string[];
  link?: string;
}

const CountryDetail = () => {
  const { slug } = useParams();
  
  const { data: country, isLoading: countryLoading } = useQuery<Country>({
    queryKey: [`/api/countries/${slug}`],
  });

  const { data: universities = [], isLoading: universitiesLoading } = useQuery<University[]>({
    queryKey: ['/api/universities'],
  });

  const { data: scholarships = [], isLoading: scholarshipsLoading } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships'],
  });

  // Filter universities by country
  const countryUniversities = universities
    .filter(uni => uni.country === country?.name)
    .slice(0, 4);

  // Filter scholarships by country
  const countryScholarships = scholarships
    .filter(scholarship => scholarship.country === country?.name)
    .slice(0, 3);

  const isLoading = countryLoading || universitiesLoading || scholarshipsLoading;

  // Function to get tag color based on tag name
  const getTagColor = (tag: string): string => {
    const tagColorMap: Record<string, string> = {
      "Fully Funded": "bg-green-100 text-green-800",
      "Graduate": "bg-blue-100 text-blue-800",
      "Master's": "bg-blue-100 text-blue-800",
      "PhD": "bg-indigo-100 text-indigo-800",
      "Research": "bg-amber-100 text-amber-800",
      "Partial Aid": "bg-blue-100 text-blue-800",
      "Undergraduate": "bg-purple-100 text-purple-800",
      "Need-Based": "bg-indigo-100 text-indigo-800",
      "Merit-Based": "bg-teal-100 text-teal-800",
      "Govt Funded": "bg-emerald-100 text-emerald-800",
    };
    
    return tagColorMap[tag] || "bg-gray-100 text-gray-800";
  };

  return (
    <>
      {country && (
        <Helmet>
          <title>{country.name} | Study Destinations | StudyGlobal</title>
          <meta name="description" content={country.overview || country.description} />
          <meta property="og:title" content={`${country.name} | Study Destinations | StudyGlobal`} />
          <meta property="og:description" content={country.overview || country.description} />
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
          {/* Hero section with country image */}
          <div className="h-96 relative overflow-hidden">
            <img 
              src={country.image} 
              alt={country.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-end">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="flex items-center gap-4 mb-3">
                  {country.flag && (
                    <img 
                      src={country.flag} 
                      alt={`Flag of ${country.name}`} 
                      className="h-8 w-12 object-cover rounded shadow-sm"
                    />
                  )}
                  <h1 className="text-4xl md:text-5xl font-bold text-white">{country.name}</h1>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white">
                  <div className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    <span>{country.universities.toLocaleString()}+ Universities</span>
                  </div>
                  {country.language && (
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2" />
                      <span>{country.language}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-6">
              <Button 
                variant="ghost" 
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium p-0 h-auto"
                onClick={() => window.location.href = '/countries'}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Countries
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                {/* Overview section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-primary-600" />
                    About {country.name}
                  </h2>
                  <div className="bg-primary-50 border border-primary-100 p-6 rounded-xl mb-6">
                    <p className="text-slate-700 leading-relaxed">{country.overview || country.description}</p>
                  </div>
                </div>
                
                {/* Highlights section */}
                {country.highlights && country.highlights.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                      <Award className="h-6 w-6 mr-2 text-primary-600" />
                      Key Highlights
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {country.highlights.map((highlight, index) => (
                          <motion.li 
                            key={index} 
                            className="flex items-start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Check className="h-5 w-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              
                {/* Education system information */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                    <Landmark className="h-6 w-6 mr-2 text-primary-600" />
                    Education System
                  </h2>
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <p className="text-slate-700 mb-6">
                      {country.educationSystem || `${country.name} has a well-established education system known for its quality and diverse academic offerings.`}
                    </p>
                    
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="entry-requirements">
                        <AccordionTrigger className="text-slate-800 font-medium">
                          Entry Requirements
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-700">
                          <p>Requirements vary by institution, but generally include:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Prior academic qualifications</li>
                            <li>Proof of language proficiency (usually {country.language})</li>
                            <li>Standardized test scores (may vary by university)</li>
                            <li>Letters of recommendation</li>
                            <li>Statement of purpose</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="academic-year">
                        <AccordionTrigger className="text-slate-800 font-medium">
                          Academic Calendar
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-700">
                          <p>The academic year typically consists of:</p>
                          <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Fall/Autumn semester (main intake): September/October</li>
                            <li>Spring semester: January/February</li>
                            <li>Summer sessions (optional): May to August</li>
                          </ul>
                          <p className="mt-2">Application deadlines vary by institution but are usually several months before the semester starts.</p>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="degree-structure">
                        <AccordionTrigger className="text-slate-800 font-medium">
                          Degree Structure
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-700">
                          <ul className="list-disc pl-5 space-y-1">
                            <li><strong>Undergraduate:</strong> Bachelor's degrees typically take 3-4 years to complete</li>
                            <li><strong>Graduate:</strong> Master's programs usually last 1-2 years</li>
                            <li><strong>Doctoral:</strong> PhD programs generally require 3-5 years</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Main content with tabs */}
                <Tabs defaultValue="description" className="mb-8">
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger value="description">About</TabsTrigger>
                    <TabsTrigger value="universities">Universities</TabsTrigger>
                    <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
                  </TabsList>
                  
                  {/* Tab: General description */}
                  <TabsContent value="description" className="space-y-6">
                    <div className="prose prose-blue max-w-none">
                      <h3 className="text-xl font-semibold mb-3">Studying in {country.name}</h3>
                      <div>
                        {country.description.split('\n\n').map((paragraph, index) => (
                          <p key={index} className="text-slate-700 leading-relaxed mb-4">{paragraph}</p>
                        ))}
                      </div>
                      
                      <h3 className="text-xl font-semibold mt-6 mb-3">Popular Cities</h3>
                      {country.popularCities && country.popularCities.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4">
                          {country.popularCities.map((city, index) => (
                            <div key={index} className="bg-slate-50 rounded-lg p-3 flex items-center">
                              <MapPin className="h-4 w-4 text-primary-500 mr-2" />
                              <span className="text-slate-700">{city}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-slate-600">Information on popular cities is currently being updated.</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Tab: Universities */}
                  <TabsContent value="universities">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Top Universities in {country.name}</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = '/universities'}
                        >
                          View All
                        </Button>
                      </div>
                      
                      {country.topUniversities && country.topUniversities.length > 0 && (
                        <div className="mb-6">
                          <h4 className="text-lg font-medium text-slate-800 mb-2">Prominent Institutions</h4>
                          <ul className="list-disc pl-5 space-y-1 mb-6">
                            {country.topUniversities.map((uni, index) => (
                              <li key={index} className="text-slate-700">{uni}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {countryUniversities.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {countryUniversities.map((university) => (
                            <motion.div 
                              key={university.id}
                              className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
                              whileHover={{ y: -5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              onClick={() => window.location.href = `/universities/${university.slug}`}
                            >
                              <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">{university.name}</h3>
                              <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                                {university.description.substring(0, 120)}...
                              </p>
                              <div className="flex items-center text-primary-600 text-sm font-medium">
                                Learn More
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-xl">
                          <p className="text-slate-600">No universities found for this country yet.</p>
                          <p className="text-slate-500 text-sm mt-2">We're working on adding more universities soon!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {/* Tab: Scholarships */}
                  <TabsContent value="scholarships">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold">Available Scholarships for {country.name}</h3>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.location.href = '/scholarships'}
                        >
                          View All
                        </Button>
                      </div>
                      
                      {countryScholarships.length > 0 ? (
                        <div className="space-y-4">
                          {countryScholarships.map((scholarship) => (
                            <motion.div 
                              key={scholarship.id}
                              className="bg-white rounded-xl shadow-sm p-4 border border-slate-200"
                              whileHover={{ y: -5 }}
                              transition={{ type: "spring", stiffness: 300 }}
                              onClick={() => window.location.href = `/scholarships/${scholarship.slug}`}
                            >
                              <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 transition-colors">{scholarship.title}</h3>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {scholarship.tags.slice(0, 3).map((tag, index) => (
                                  <span 
                                    key={index} 
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTagColor(tag)}`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{scholarship.overview || scholarship.description}</p>
                              <div className="flex justify-between items-center">
                                <div className="flex items-center text-slate-600 text-sm">
                                  <Clock className="h-4 w-4 mr-1" />
                                  <span>Deadline: {scholarship.deadline}</span>
                                </div>
                                <span className="text-accent-500 font-medium">{scholarship.amount}</span>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-slate-50 rounded-xl">
                          <p className="text-slate-600">No scholarships found for this country yet.</p>
                          <p className="text-slate-500 text-sm mt-2">We're working on adding more scholarships soon!</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Country details card */}
                <Card className="sticky top-20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary-500" />
                      Study in {country.name}
                    </CardTitle>
                    <CardDescription>Key information for international students</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-5">
                      <div className="flex items-center">
                        <div className="bg-primary-100 p-2 rounded-full mr-3">
                          <Building2 className="h-5 w-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Universities</p>
                          <p className="font-semibold">{country.universities.toLocaleString()}+</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-green-100 p-2 rounded-full mr-3">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Acceptance Rate</p>
                          <p className="font-semibold">{country.acceptanceRate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Globe className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Language</p>
                          <p className="font-semibold">{country.language}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-amber-100 p-2 rounded-full mr-3">
                          <DollarSign className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-slate-500">Currency</p>
                          <p className="font-semibold">{country.currency}</p>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-sm">Average Tuition</h3>
                          <Badge variant="outline">{country.currency}</Badge>
                        </div>
                        <p className="text-slate-700">{country.averageTuition}</p>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-medium text-sm">Living Expenses</h3>
                          <Badge variant="outline">Monthly</Badge>
                        </div>
                        <p className="text-slate-700">{country.averageLivingCost}</p>
                      </div>
                      
                      <div className="pt-4 border-t border-slate-100">
                        <h3 className="font-medium text-sm mb-2">Visa Requirements</h3>
                        <div className="flex items-start gap-2">
                          <Plane className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                          <p className="text-slate-700 text-sm">{country.visaRequirement}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-slate-100">
                      <Button 
                        className="w-full"
                        onClick={() => window.location.href = `/scholarships?country=${encodeURIComponent(country.name)}`}
                      >
                        Find Scholarships
                      </Button>
                    </div>
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
          <Button onClick={() => window.location.href = '/countries'}>
            Back to Countries
          </Button>
        </div>
      )}
    </>
  );
};

export default CountryDetail;
