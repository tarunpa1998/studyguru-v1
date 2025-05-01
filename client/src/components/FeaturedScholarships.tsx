import { useQuery } from "@tanstack/react-query";
import { ArrowRight, GraduationCap, Filter } from "lucide-react";
import { motion } from "framer-motion";
import ScholarshipCard from "./ScholarshipCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedScholarships = () => {
  const { data: scholarships = [], isLoading } = useQuery({
    queryKey: ['/api/scholarships']
  });

  const handleViewAll = () => {
    window.location.href = "/scholarships";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <motion.div 
            className="inline-flex items-center mb-3 px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-600 border border-primary-100"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <GraduationCap className="h-4 w-4 mr-2" />
            Financial Aid Opportunities
          </motion.div>
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-slate-800 mb-4"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Featured Scholarships
          </motion.h2>
          <motion.p 
            className="text-lg text-slate-600"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Discover top scholarships from around the world to fund your education abroad
          </motion.p>
        </div>

        {/* Filter tags */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 mb-10"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.button 
            className="rounded-full px-4 py-2 text-sm font-medium bg-primary-600 text-white focus:outline-none flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            All Scholarships
          </motion.button>
          <motion.button 
            className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Fully Funded
          </motion.button>
          <motion.button 
            className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Undergraduate
          </motion.button>
          <motion.button 
            className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Postgraduate
          </motion.button>
          <motion.button 
            className="rounded-full px-4 py-2 text-sm font-medium bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 focus:outline-none flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter className="h-4 w-4 mr-1.5" />
            More Filters
          </motion.button>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden border border-slate-100">
                <div className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-7 w-24 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                  <Skeleton className="h-8 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3 mb-5" />
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="flex items-center">
                      <Skeleton className="h-8 w-8 rounded-full mr-2" />
                      <Skeleton className="h-5 w-36" />
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 px-6 py-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {scholarships.slice(0, 3).map((scholarship: any, index: number) => (
              <motion.div key={scholarship.id} variants={itemVariants}>
                <ScholarshipCard
                  id={scholarship.id}
                  title={scholarship.title}
                  description={scholarship.description}
                  amount={scholarship.amount}
                  deadline={scholarship.deadline}
                  country={scholarship.country}
                  tags={scholarship.tags}
                  slug={scholarship.slug}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.button
            onClick={handleViewAll}
            className="inline-flex items-center px-6 py-3 rounded-full bg-white border border-slate-200 text-primary-600 font-medium hover:bg-slate-50 focus:outline-none shadow-sm transition-colors duration-200"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
            whileTap={{ scale: 0.98 }}
          >
            View All Scholarships
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop" }}
            >
              <ArrowRight className="ml-2 h-5 w-5" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedScholarships;
