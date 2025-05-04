import { 
  GraduationCap, 
  Globe, 
  Building2, 
  FileText 
} from "lucide-react";
import { motion } from "framer-motion";
import CategoryCard from "./CategoryCard";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const CategorySection = () => {
  const categories = [
    {
      title: "Scholarships",
      description: "Find opportunities that match your profile",
      icon: GraduationCap,
      href: "/scholarships"
    },
    {
      title: "Countries",
      description: "Explore top study destinations worldwide",
      icon: Globe,
      href: "/countries"
    },
    {
      title: "Universities",
      description: "Compare institutions and find your fit",
      icon: Building2,
      href: "/universities"
    },
    {
      title: "Articles",
      description: "Expert advice and student experiences",
      icon: FileText,
      href: "/articles"
    }
  ];

  return (
    <section className="py-10 md:py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Explore Study Guru</h2>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">Your comprehensive guide to international education opportunities</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category, index) => (
            <div key={index} className="h-full">
              <CategoryCard
                title={category.title}
                description={category.description}
                icon={category.icon}
                href={category.href}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;

