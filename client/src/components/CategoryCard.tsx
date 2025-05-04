import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

const cardVariants = {
  initial: { 
    scale: 0.95, 
    opacity: 0,
    y: 20 
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    y: 0 
  },
  hover: { 
    y: -5,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
  },
  tap: { 
    scale: 0.98 
  }
};

const iconVariants = {
  initial: { 
    scale: 0.8,
    rotate: -5
  },
  animate: { 
    scale: 1,
    rotate: 0
  },
  hover: { 
    scale: 1.1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 300
    }
  }
};

const CategoryCard = ({ title, description, icon: Icon, href }: CategoryCardProps) => {
  const handleNavigate = () => {
    window.location.href = href;
  };

  return (
    <motion.div 
      className="block group select-none cursor-pointer"
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.3 }}
      onClick={handleNavigate}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} category`}
    >
      <motion.div 
        className="bg-card p-6 rounded-xl shadow border border-border flex flex-col items-center text-center h-full"
        variants={cardVariants}
      >
        <motion.div 
          className="w-16 h-16 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-all duration-300"
          variants={iconVariants}
        >
          <Icon className="h-8 w-8 text-primary" />
        </motion.div>
        
        <motion.h3 
          className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300"
          variants={{
            hover: { scale: 1.05 }
          }}
        >
          {title}
        </motion.h3>
        
        <motion.p 
          className="mt-2 text-sm text-muted-foreground"
          variants={{
            initial: { opacity: 0 },
            animate: { opacity: 1, transition: { delay: 0.2 } }
          }}
        >
          {description}
        </motion.p>
        
        <motion.div 
          className="mt-4 w-0 h-0.5 bg-primary group-hover:w-1/2 transition-all duration-300"
          variants={{
            hover: { width: "50%" }
          }}
        />
      </motion.div>
    </motion.div>
  );
};

export default CategoryCard;

