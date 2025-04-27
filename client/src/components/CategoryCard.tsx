import { Link } from "wouter";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const CategoryCard = ({ title, description, icon: Icon, href }: CategoryCardProps) => {
  return (
    <Link href={href}>
      <a className="group">
        <motion.div 
          className="bg-slate-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col items-center text-center h-full"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors duration-300">
            <Icon className="h-8 w-8 text-primary-600" />
          </div>
          <h3 className="font-semibold text-lg text-slate-800 group-hover:text-primary-600 transition-colors duration-300">
            {title}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{description}</p>
        </motion.div>
      </a>
    </Link>
  );
};

export default CategoryCard;
