
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Helmet } from "react-helmet";
import { 
  ArrowLeft, 
  MapPin, 
  Award, 
  Check, 
  Calendar, 
  GraduationCap, 
  Globe, 
  DollarSign, 
  Clock, 
  Users, 
  BookOpen,
  Building,
  Star,
  Link as LinkIcon,
  Share2,
  School,
  HomeIcon,
  Briefcase
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import ScholarshipCard from "@/components/ScholarshipCard";
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
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

// Interface for University
interface University {
  id: string | number;
  name: string;
  description: string;
  overview: string;
  country: string;
  location: string;
  foundedYear: number;
  ranking?: number;
  acceptanceRate?: string;
  studentPopulation?: number;
  internationalStudents?: string;
  academicCalendar?: string;
  programsOffered: string[];
  tuitionFees: string;
  admissionRequirements: string[];
  applicationDeadlines: string;
  scholarshipsAvailable: boolean;
  campusLife: string;
  notableAlumni: string[];
  facilities: string[];
  image?: string;
  logo?: string;
  website?: string;
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
  country: string;
  tags: string[];
  link?: string;
}

const UniversityDetail = () => {
  const { theme } = useTheme();
  const { slug } = useParams();
  
  const { data: university, isLoading: universityLoading } = useQuery<University>({
    queryKey: [`/api/universities/${slug}`],
  });

  const { data: scholarships = [], isLoading: scholarshipsLoading } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships'],
  });

  // Filter scholarships by university's country
  const relevantScholarships = scholarships
    .filter(scholarship => scholarship.country === university?.country)
    .slice(0, 3);

  const isLoading = universityLoading || scholarshipsLoading;

  return (
    <>
      {university && (
        <Helmet>
          <title>{university.name} | Study Guru</title>
          <meta name="description" content={university.overview || university.description} />
          <meta property="og:title" content={`${university.name} | Study Guru`} />
          <meta property="og:description" content={university.overview || university.description} />
          <meta property="og:type" content="article" />
          {university.image && <meta property="og:image" content={university.image} />}
        </Helmet>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
        <div className="mb-4 md:mb-6">
          <Button 
            variant="ghost" 
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium p-0 h-auto"
            onClick={() => window.location.href = '/universities'}
          >
            <ArrowLeft className="h-4 w-4 mr-2 mt-0" />
            Back to Universities
          </Button>
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
              {/* University Header */}
              <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
                {university.logo ? (
                  <img 
                    src={university.logo} 
                    alt={university.name + " logo"} 
                    className="h-32 w-auto object-contain rounded-lg bg-white p-2 border border-border" 
                  />
                ) : university.image ? (
                  <img 
                    src={university.image} 
                    alt={university.name} 
                    className="h-32 w-32 object-cover rounded-lg" 
                  />
                ) : (
                  <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-3xl font-bold text-muted-foreground">{university.name.charAt(0)}</span>
                  </div>
                )}
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{university.name}</h1>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-muted-foreground mr-1" />
                      <span className="text-muted-foreground">{university.location || university.country}</span>
                    </div>
                    {university.foundedYear > 0 && (
                      <>
                        <div className="w-1 h-1 bg-border rounded-full mx-1"></div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-1" />
                          <span className="text-muted-foreground">Est. {university.foundedYear}</span>
                        </div>
                      </>
                    )}
                    {university.ranking && (
                      <>
                        <div className="w-1 h-1 bg-border rounded-full mx-1"></div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1" />
                          <span className="text-muted-foreground">#{university.ranking} Globally</span>
                        </div>
                      </>
                    )}
                  </div>
                  {university.features && university.features.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {university.features.slice(0, 4).map((feature: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-background dark:bg-card">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  )}
                  {university.website && (
                    <a 
                      href={university.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium mt-2"
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Official Website
                    </a>
                  )}
                </div>
              </div>

              {/* Overview section */}
              <div className="bg-primary-50 dark:bg-primary-950/30 border border-primary-100 dark:border-primary-900 rounded-xl p-6 mb-8">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-primary-100 mb-3 flex items-center">
                  <School className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  About {university.name}
                </h2>
                <p className="text-foreground leading-relaxed">
                  {university.overview || university.description}
                </p>
              </div>

              {/* Tabbed Content */}
              <Tabs defaultValue="details" className="mb-8">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="academics">Academics</TabsTrigger>
                  <TabsTrigger value="admissions">Admissions</TabsTrigger>
                  <TabsTrigger value="campus">Campus Life</TabsTrigger>
                </TabsList>
                
                {/* Tab: University Details */}
                <TabsContent value="details" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Key Stats */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Key Statistics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between border-b border-border pb-2">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                            <span className="text-muted-foreground">Student Population</span>
                          </div>
                          <span className="font-medium text-foreground">
                            {university.studentPopulation ? university.studentPopulation.toLocaleString() : 'N/A'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between border-b border-border pb-2">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                            <span className="text-muted-foreground">International Students</span>
                          </div>
                          <span className="font-medium text-foreground">{university.internationalStudents || 'N/A'}</span>
                        </div>
                        
                        <div className="flex justify-between border-b border-border pb-2">
                          <div className="flex items-center">
                            <GraduationCap className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                            <span className="text-muted-foreground">Acceptance Rate</span>
                          </div>
                          <span className="font-medium text-foreground">{university.acceptanceRate || 'N/A'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                            <span className="text-muted-foreground">Academic Calendar</span>
                          </div>
                          <span className="font-medium text-foreground">{university.academicCalendar || 'N/A'}</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Facilities */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Facilities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {university.facilities && university.facilities.length > 0 ? (
                            university.facilities.slice(0, 5).map((facility: string, index: number) => (
                              <motion.li 
                                key={index} 
                                className="flex items-start"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-foreground">{facility}</span>
                              </motion.li>
                            ))
                          ) : (
                            <>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                                <span className="text-foreground">Modern research facilities</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                                <span className="text-foreground">Extensive library resources</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                                <span className="text-foreground">Student accommodation</span>
                              </li>
                              <li className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mr-2 mt-0.5" />
                                <span className="text-foreground">Sports and recreational facilities</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Notable Alumni */}
                  {university.notableAlumni && university.notableAlumni.length > 0 && (
                    <div className="bg-muted dark:bg-muted/30 rounded-xl border border-border p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-muted-foreground" />
                        Notable Alumni
                      </h3>
                      <ul className="space-y-2">
                        {university.notableAlumni.map((alumnus: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <Star className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-foreground">{alumnus}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </TabsContent>
                
                {/* Tab: Academics */}
                <TabsContent value="academics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Programs Offered</CardTitle>
                      <CardDescription>Academic fields and programs available at {university.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {university.programsOffered && university.programsOffered.length > 0 ? (
                          university.programsOffered.map((program: string, index: number) => (
                            <div 
                              key={index} 
                              className="bg-muted dark:bg-muted/30 rounded-lg p-3 flex items-center"
                            >
                              <BookOpen className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2 flex-shrink-0" />
                              <span className="text-foreground">{program}</span>
                            </div>
                          ))
                        ) : (
                          <>
                            <div className="bg-muted dark:bg-muted/30 rounded-lg p-3 flex items-center">
                              <BookOpen className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                              <span className="text-foreground">Undergraduate Programs</span>
                            </div>
                            <div className="bg-muted dark:bg-muted/30 rounded-lg p-3 flex items-center">
                              <BookOpen className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                              <span className="text-foreground">Graduate Programs</span>
                            </div>
                            <div className="bg-muted dark:bg-muted/30 rounded-lg p-3 flex items-center">
                              <BookOpen className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                              <span className="text-foreground">Doctoral Programs</span>
                            </div>
                            <div className="bg-muted dark:bg-muted/30 rounded-lg p-3 flex items-center">
                              <BookOpen className="h-4 w-4 text-primary-500 dark:text-primary-400 mr-2" />
                              <span className="text-foreground">Professional Certification</span>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Description section */}
                  <div className="prose prose-blue max-w-none mb-8">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">About the University</h3>
                    <p className="text-slate-700 leading-relaxed">
                      {university.description.split('\n\n').map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </p>
                  </div>
                </TabsContent>
                
                {/* Tab: Admissions */}
                <TabsContent value="admissions" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Admission Requirements</CardTitle>
                      <CardDescription>What you need to apply to {university.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {university.admissionRequirements && university.admissionRequirements.length > 0 ? (
                          university.admissionRequirements.map((requirement: string, index: number) => (
                            <li key={index} className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-foreground">{requirement}</span>
                            </li>
                          ))
                        ) : (
                          <>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <span className="text-foreground">Academic transcripts</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <span className="text-foreground">English proficiency (IELTS/TOEFL)</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <span className="text-foreground">Letters of recommendation</span>
                            </li>
                            <li className="flex items-start">
                              <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2 mt-0.5" />
                              <span className="text-foreground">Statement of purpose</span>
                            </li>
                          </>
                        )}
                      </ul>
                      
                      <div className="mt-6 pt-4 border-t border-border">
                        <h4 className="font-medium mb-2 text-foreground">Application Deadlines</h4>
                        <p className="text-muted-foreground">{university.applicationDeadlines || "Please check the university website for current application deadlines."}</p>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" />
                          <h4 className="font-medium text-foreground">Tuition Fees</h4>
                        </div>
                        <span className="font-semibold text-foreground">{university.tuitionFees || "Varies by program"}</span>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center">
                          <GraduationCap className="h-5 w-5 text-primary-500 mr-2" />
                          <h4 className="font-medium text-foreground">Scholarships Available</h4>
                        </div>
                        <Badge variant={university.scholarshipsAvailable ? "default" : "outline"}>
                          {university.scholarshipsAvailable ? "Yes" : "Limited"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Tab: Campus Life */}
                <TabsContent value="campus" className="space-y-6">
                  {university.image && (
                    <div className="mb-6">
                      <img 
                        src={university.image} 
                        alt={`${university.name} campus`} 
                        className="w-full h-64 object-cover rounded-xl mb-4" 
                      />
                    </div>
                  )}
                  
                  <div className="bg-card rounded-xl shadow-sm border border-border p-6">
                    <h3 className="text-xl font-semibold mb-4 flex items-center text-foreground">
                      <HomeIcon className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                      Campus Life
                    </h3>
                    <p className="text-foreground leading-relaxed mb-6">
                      {university.campusLife || "The university offers a vibrant campus environment with various facilities and opportunities for students to engage in extracurricular activities, clubs, and social events."}
                    </p>
                    
                    <Accordion type="single" collapsible>
                      <AccordionItem value="facilities">
                        <AccordionTrigger className="text-foreground">Campus Facilities</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                            {university.facilities && university.facilities.length > 0 ? (
                              university.facilities.map((facility: string, index: number) => (
                                <li key={index}>{facility}</li>
                              ))
                            ) : (
                              <>
                                <li>Libraries and study spaces</li>
                                <li>Sports and recreation centers</li>
                                <li>Student accommodation</li>
                                <li>Dining facilities</li>
                                <li>Student union and social spaces</li>
                              </>
                            )}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="student-life">
                        <AccordionTrigger className="text-foreground">Student Life</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            Students at {university.name} can participate in a wide range of extracurricular activities, including:
                          </p>
                          <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                            <li>Student clubs and organizations</li>
                            <li>Cultural events and festivals</li>
                            <li>Sports teams and competitions</li>
                            <li>Volunteer and community service opportunities</li>
                            <li>International student associations</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      
                      <AccordionItem value="support">
                        <AccordionTrigger className="text-foreground">Student Support Services</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground mb-2">
                            {university.name} offers comprehensive support services for all students, including:
                          </p>
                          <ul className="space-y-2 pl-6 list-disc text-muted-foreground">
                            <li>Academic advising</li>
                            <li>Career counseling and job placement</li>
                            <li>Health and wellness services</li>
                            <li>International student support</li>
                            <li>Disability support services</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Scholarships section */}
              {relevantScholarships.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-foreground">Available Scholarships</h2>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = '/scholarships'}
                    >
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {relevantScholarships.map((scholarship: any) => (
                      <ScholarshipCard
                        key={scholarship.id}
                        id={scholarship.id}
                        title={scholarship.title}
                        description={scholarship.overview || scholarship.description}
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

            {/* Sidebar */}
            <div>
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <School className="h-5 w-5 text-primary-500 dark:text-primary-400" />
                    Key Information
                  </CardTitle>
                  <CardDescription>Fast facts about {university.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center">
                    <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-full mr-3">
                      <Award className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Global Ranking</p>
                      <p className="font-semibold text-foreground">
                        {university.ranking 
                          ? `#${university.ranking}` 
                          : "Not ranked"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-full mr-3">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Founded</p>
                      <p className="font-semibold text-foreground">{university.foundedYear || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full mr-3">
                      <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Student Population</p>
                      <p className="font-semibold text-foreground">
                        {university.studentPopulation 
                          ? university.studentPopulation.toLocaleString()
                          : "N/A"
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
                      <GraduationCap className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Acceptance Rate</p>
                      <p className="font-semibold text-foreground">{university.acceptanceRate || "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-medium text-sm text-foreground">Tuition Fees</h3>
                      <Badge variant="outline">USD</Badge>
                    </div>
                    <p className="text-muted-foreground dark:text-gray-400">{university.tuitionFees || "Varies by program"}</p>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h3 className="font-medium text-sm mb-2 text-foreground">Website</h3>
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                      <a 
                        href={university.website || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-muted-foreground dark:text-gray-400 hover:underline truncate"
                      >
                        {university.website || `www.${university.name.toLowerCase().replace(/\s+/g, '')}.edu`}
                      </a>
                    </div>
                  </div>
                  
                  <div className="space-y-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <Button 
                      className="w-full"
                      onClick={() => window.location.href = `/scholarships?country=${encodeURIComponent(university.country)}`}
                    >
                      Find Scholarships
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.location.href = university.website || '#'}
                    >
                      Visit Official Website
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="text-center py-6">
            <h1 className="text-2xl font-bold text-foreground mb-4">University Not Found</h1>
            <p className="text-muted-foreground mb-6">We couldn't find the university you're looking for.</p>
            <Button onClick={() => window.location.href = '/universities'}>
              Back to Universities
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default UniversityDetail;


