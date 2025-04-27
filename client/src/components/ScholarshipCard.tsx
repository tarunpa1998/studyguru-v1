import { Link } from "wouter";
import { CalendarClock, MapPin, ChevronRight } from "lucide-react";
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
  return (
    <motion.div 
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4 flex-wrap gap-2">
          {tags.map((tag, index) => {
            const tagColorMap: Record<string, string> = {
              "Fully Funded": "bg-green-100 text-green-800",
              "Merit-Based": "bg-blue-100 text-blue-800",
              "Research": "bg-amber-100 text-amber-800",
              "Partial Aid": "bg-blue-100 text-blue-800",
              "Undergraduate": "bg-purple-100 text-purple-800",
              "Need-Based": "bg-indigo-100 text-indigo-800",
              "Govt Funded": "bg-emerald-100 text-emerald-800",
            };
            
            return (
              <span 
                key={index} 
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                  tagColorMap[tag] || "bg-gray-100 text-gray-800"
                )}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm mb-4">{description}</p>
        <div className="flex items-center text-sm text-slate-500 mb-4">
          <MapPin className="h-5 w-5 mr-1 text-slate-400" />
          {country}
        </div>
        <div className="flex justify-between text-sm">
          <div className="flex items-center text-slate-500">
            <CalendarClock className="h-5 w-5 mr-1 text-slate-400" />
            Deadline: {deadline}
          </div>
          <div className="text-accent-500 font-medium">{amount}</div>
        </div>
      </div>
      <div className="border-t border-slate-100 px-6 py-3 mt-auto">
        <Link href={`/scholarships/${slug}`}>
          <a className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Link>
      </div>
    </motion.div>
  );
};

export default ScholarshipCard;
