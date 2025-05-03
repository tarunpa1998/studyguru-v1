import { CalendarClock, MapPin, ChevronRight, GraduationCap, Award, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ScholarshipCardProps {
  id: number;
  title: string;
  description: string;
  amount: string;
  deadline: string;
  country: string;
  tags: string[];
  slug: string;
}

const ScholarshipCard = ({
  title,
  description,
  amount,
  deadline,
  country,
  tags,
  slug
}: ScholarshipCardProps) => {
  const goToDetails = () => {
    window.location.href = `/scholarships/${slug}`;
  };
  
  return (
    <motion.div 
      className="group bg-card rounded-2xl shadow-md hover:shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden h-full flex flex-col transition-all duration-300"
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.1)" }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={goToDetails}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${title}`}
    >
      {/* Card header with colored tag */}
      <div className="px-6 pt-6 pb-1 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag, index) => {
              const tagColorMap: Record<string, string> = {
                "Fully Funded": "bg-green-100 text-green-800 border-green-200 group-hover:bg-green-200",
                "Merit-Based": "bg-blue-100 text-blue-800 border-blue-200 group-hover:bg-blue-200",
                "Research": "bg-amber-100 text-amber-800 border-amber-200 group-hover:bg-amber-200",
                "Partial Aid": "bg-sky-100 text-sky-800 border-sky-200 group-hover:bg-sky-200",
                "Undergraduate": "bg-purple-100 text-purple-800 border-purple-200 group-hover:bg-purple-200",
                "Need-Based": "bg-indigo-100 text-indigo-800 border-indigo-200 group-hover:bg-indigo-200",
                "Govt Funded": "bg-emerald-100 text-emerald-800 border-emerald-200 group-hover:bg-emerald-200",
              };
              
              return (
                <motion.span 
                  key={index} 
                  className={cn(
                    "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
                    tagColorMap[tag] || "bg-slate-100 text-slate-800 border-slate-200 group-hover:bg-slate-200"
                  )}
                  whileHover={{ scale: 1.05 }}
                >
                  {tag === "Fully Funded" && <Award className="mr-1 h-3.5 w-3.5" />}
                  {tag === "Merit-Based" && <GraduationCap className="mr-1 h-3.5 w-3.5" />}
                  {tag}
                </motion.span>
              );
            })}
            
            {tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                +{tags.length - 2}
              </span>
            )}
          </div>
          <div className="text-primary-600 font-bold">
            {amount}
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2.5 line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
          {title}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 mb-5">
          {description}
        </p>

        {/* Info section */}
        <div className="flex flex-col space-y-2.5 mb-4">
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-blue-50 dark:bg-blue-900/30 p-1.5 mr-2">
                <MapPin className="h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>
              <span className="font-medium">{country}</span>
            </div>
          </div>
          
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center">
              <div className="flex-shrink-0 rounded-full bg-amber-50 dark:bg-amber-900/30 p-1.5 mr-2">
                <CalendarClock className="h-4 w-4 text-amber-500 dark:text-amber-400" />
              </div>
              <span>Deadline: <span className="font-medium">{deadline}</span></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Card footer */}
      <div className="mt-auto">
        <div className="border-t border-slate-100 dark:border-slate-800 px-6 py-3 flex justify-between items-center">
          <motion.div 
            className="text-primary-600 font-medium text-sm flex items-center"
            initial={{ x: 0 }}
            whileHover={{ x: 5 }}
            animate={{
              opacity: 1,
            }}
          >
            View Details
            <motion.div
              animate={{
                x: [0, 4, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <ArrowRight className="h-4 w-4 ml-1" />
            </motion.div>
          </motion.div>
          
          <div className="text-xs text-slate-400 dark:text-slate-500 flex items-center">
            <GraduationCap className="h-3.5 w-3.5 mr-1" />
            Scholarship
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ScholarshipCard;
