import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

// Define University interface
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

const UniversitiesList = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");

  const { data: universities = [], isLoading } = useQuery<University[]>({
    queryKey: ['/api/universities']
  });

  // Apply filters
  const filteredUniversities = universities.filter((university) => {
    const matchesSearch = university.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          university.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = filterCountry === "all" ? true : university.country === filterCountry;
    
    return matchesSearch && matchesCountry;
  });

  // Extract unique countries for filters
  const uniqueCountries = Array.from(new Set(universities.map((u) => u.country)));

  return (
    <>
      <Helmet>
        <title>Universities | Study Guru</title>
        <meta 
          name="description" 
          content="Explore top universities and colleges worldwide for international students. Find rankings, programs, and admission information."
        />
      </Helmet>

      <div className="bg-primary-600 py-16 pt-6 pb-0">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-4">Universities</h1>
          <p className="text-primary-100 max-w-2xl">
            Discover top universities and colleges around the world. Compare rankings, programs, and find the perfect institution for your educational journey.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card shadow-sm rounded-lg p-6 mb-8 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter Universities</h2>
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <div className="relative">
                <Input 
                  id="search"
                  placeholder="Search universities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="country" className="mb-2 block">Country</Label>
              <Select value={filterCountry} onValueChange={setFilterCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="All Countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {uniqueCountries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <Skeleton className="h-32 w-32 rounded-lg flex-shrink-0" />
                    <div className="flex-grow space-y-3">
                      <Skeleton className="h-8 w-3/4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">{filteredUniversities.length} universities found</p>
            </div>
            {filteredUniversities.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No universities found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to find more results.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredUniversities.map((university) => (
                  <motion.div 
                    key={university.id}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {university.image ? (
                            <img 
                              src={university.image} 
                              alt={university.name} 
                              className="h-32 w-32 object-cover rounded-lg flex-shrink-0" 
                            />
                          ) : (
                            <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                              <span className="text-xl font-bold text-muted-foreground">{university.name.charAt(0)}</span>
                            </div>
                          )}
                          <div className="flex-grow">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                              <h3 className="text-xl font-bold">{university.name}</h3>
                              {university.ranking && (
                                <Badge variant="outline" className="ml-0 md:ml-2">
                                  Ranking: #{university.ranking}
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center mb-3">
                              <Badge variant="secondary" className="mr-2">
                                {university.country}
                              </Badge>
                              {university.features && university.features.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {university.features.slice(0, 2).map((feature, index) => (
                                    <Badge key={index} variant="outline" className="bg-muted">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-4">{university.description.substring(0, 150)}...</p>
                            <Link href={`/universities/${university.slug}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UniversitiesList;



