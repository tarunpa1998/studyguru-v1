import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import CountryCard from "./CountryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Define the Country type
interface Country {
  id: string | number;
  name: string;
  image: string;
  universities: number;
  acceptanceRate: string;
  slug: string;
}

const PopularDestinations = () => {
  const { data: countries = [], isLoading } = useQuery<Country[]>({
    queryKey: ['/api/countries']
  });

  const handleViewAll = () => {
    window.location.href = '/countries';
  };

  return (
    <section className="py-12 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Popular Study Destinations</h2>
          <motion.div 
            className="text-primary hover:text-primary/90 font-medium flex items-center cursor-pointer"
            onClick={handleViewAll}
            whileHover={{ x: 3 }}
            whileTap={{ scale: 0.98 }}
          >
            View all
            <ChevronRight className="h-5 w-5 ml-1" />
          </motion.div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {countries.map((country) => (
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
      </div>
    </section>
  );
};

export default PopularDestinations;

