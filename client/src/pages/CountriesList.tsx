import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import CountryCard from "@/components/CountryCard";
import { useTheme } from "@/contexts/ThemeContext";

const CountriesList = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  // Define Country interface
  interface Country {
    id: string | number;
    name: string;
    description: string;
    universities: number;
    acceptanceRate: string;
    image: string;
    slug: string;
  }

  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/countries']
  });

  // Apply filters
  const filteredCountries = countries.filter((country) => {
    return country.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <>
      <Helmet>
        <title>Study Destinations | Study Guru</title>
        <meta 
          name="description" 
          content="Explore popular study abroad destinations for international students. Find information about universities, scholarships, and education systems."
        />
      </Helmet>

      <div className="bg-primary-600 py-16 pb-0 pt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-dark dark:text-white mb-4">Study Destinations</h1>
          <p className="text-primary-100 max-w-2xl">
            Explore popular countries for international education, compare key factors, and find detailed information about each destination.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card shadow-sm rounded-lg p-6 mb-8 border">
          <div className="relative">
            <Input 
              placeholder="Search countries..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden border">
                <Skeleton className="h-48 w-full" />
                <div className="p-5">
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-5 w-full mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">{filteredCountries.length} destinations found</p>
            </div>
            {filteredCountries.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No countries found</h3>
                <p className="text-muted-foreground">Try adjusting your search to find more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCountries.map((country) => (
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
          </>
        )}
      </div>
    </>
  );
};

export default CountriesList;



