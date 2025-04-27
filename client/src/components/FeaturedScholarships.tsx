import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight } from "lucide-react";
import ScholarshipCard from "./ScholarshipCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedScholarships = () => {
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['/api/scholarships']
  });

  return (
    <section className="py-12 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800">Featured Scholarships</h2>
          <Link href="/scholarships">
            <a className="text-primary-600 hover:text-primary-700 font-medium flex items-center">
              View all
              <ChevronRight className="h-5 w-5 ml-1" />
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden">
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
                <div className="border-t border-slate-100 px-6 py-3">
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.slice(0, 3).map((scholarship: any) => (
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
        )}
      </div>
    </section>
  );
};

export default FeaturedScholarships;
