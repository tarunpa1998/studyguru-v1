import { Building, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CountryCardProps {
  name: string;
  image: string;
  universities: number;
  acceptanceRate: string;
  slug: string;
}

const CountryCard = ({ name, image, universities, acceptanceRate, slug }: CountryCardProps) => {
  const handleClick = () => {
    window.location.href = `/countries/${slug}`;
  };

  return (
    <motion.div
      className="bg-slate-50 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full cursor-pointer group"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleClick}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{name}</h3>
        <div className="flex items-center text-sm text-slate-600 mb-3">
          <Building className="h-5 w-5 mr-1 text-primary-500" />
          {universities.toLocaleString()}+ Universities
        </div>
        <div className="flex justify-between items-center">
          <div className="flex">
            <span className={`inline-block h-2 w-2 rounded-full ${
              acceptanceRate.includes("High") ? "bg-green-500" : "bg-amber-500"
            } mr-1`}></span>
            <span className="text-xs text-slate-500">{acceptanceRate}</span>
          </div>
          <span className="text-primary-600 group-hover:text-primary-700 font-medium text-sm flex items-center">
            Explore
            <ChevronRight className="h-4 w-4 ml-1" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default CountryCard;
