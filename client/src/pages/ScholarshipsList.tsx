import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Search, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ScholarshipCard from "@/components/ScholarshipCard";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";

// Define Scholarship interface
interface Scholarship {
  id: string | number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  country: string;
  tags: string[];
  slug: string;
}

const ScholarshipsList = () => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterTag, setFilterTag] = useState("all");

  const { data: scholarships = [], isLoading } = useQuery<Scholarship[]>({
    queryKey: ['/api/scholarships']
  });

  // Apply filters
  const filteredScholarships = scholarships.filter((scholarship) => {
    const matchesSearch = scholarship.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          scholarship.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCountry = filterCountry === "all" ? true : scholarship.country === filterCountry;
    
    const matchesTags = filterTag === "all" ? true : scholarship.tags.includes(filterTag);
    
    return matchesSearch && matchesCountry && matchesTags;
  });

  // Extract unique countries and tags for filters
  const uniqueCountries = Array.from(new Set(scholarships.map((s) => s.country)));
  const uniqueTags = Array.from(new Set(scholarships.flatMap((s) => s.tags)));

  return (
    <>
      <Helmet>
        <title>Scholarships | Study Guru</title>
        <meta 
          name="description" 
          content="Browse and find scholarships for international students. Filter by country, scholarship type, and more."
        />
      </Helmet>

      <div className="bg-primary-600 py-16 pb-0 pt-6">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-dark dark:text-white mb-4">Scholarships</h1>
          <p className="text-primary-100 max-w-2xl">
            Discover scholarships that match your profile. Filter by country, scholarship type, and more to find the perfect funding opportunity for your international education.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-card shadow-sm rounded-lg p-6 mb-8 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Filter Scholarships</h2>
            <Filter className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="search" className="mb-2 block">Search</Label>
              <div className="relative">
                <Input 
                  id="search"
                  placeholder="Search by keyword..." 
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
            <div>
              <Label htmlFor="tag" className="mb-2 block">Scholarship Type</Label>
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger id="tag">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {uniqueTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card rounded-xl shadow-sm overflow-hidden border">
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-7 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <Skeleton className="h-5 w-40 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-36" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
                <div className="border-t px-6 py-3">
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-muted-foreground">{filteredScholarships.length} scholarships found</p>
            </div>
            {filteredScholarships.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No scholarships found</h3>
                <p className="text-muted-foreground">Try adjusting your filters to find more results.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScholarships.map((scholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    id={typeof scholarship.id === 'string' ? parseInt(scholarship.id) : scholarship.id}
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
          </>
        )}
      </div>
    </>
  );
};

export default ScholarshipsList;













