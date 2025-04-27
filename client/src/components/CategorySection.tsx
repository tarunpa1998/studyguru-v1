import { 
  GraduationCap, 
  Globe, 
  Building2, 
  FileText 
} from "lucide-react";
import CategoryCard from "./CategoryCard";

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
    <section className="py-10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              description={category.description}
              icon={category.icon}
              href={category.href}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
