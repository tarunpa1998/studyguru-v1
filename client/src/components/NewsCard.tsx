import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface NewsCardProps {
  title: string;
  summary: string;
  slug: string;
  publishDate: string;
  image: string;
  category: string;
  layout?: "vertical" | "horizontal";
}

const NewsCard = ({
  title,
  summary,
  slug,
  publishDate,
  image,
  category,
  layout = "vertical"
}: NewsCardProps) => {
  const handleNavigate = () => {
    window.location.href = `/news/${slug}`;
  };

  if (layout === "horizontal") {
    return (
      <motion.div 
        className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden cursor-pointer group border border-border"
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={handleNavigate}
      >
        <div className="flex flex-col sm:flex-row lg:flex-col">
          <div className="h-48 sm:w-1/3 lg:w-full lg:h-40 overflow-hidden">
            <img 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
          </div>
          <div className="p-4 sm:w-2/3 lg:w-full">
            <div className="flex items-center mb-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {category}
              </span>
              <span className="text-muted-foreground text-xs ml-2">{formatDate(publishDate)}</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">{summary}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full cursor-pointer group border border-border"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleNavigate}
    >
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {category}
          </span>
          <span className="text-muted-foreground text-xs ml-2">{formatDate(publishDate)}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm">{summary}</p>
      </div>
    </motion.div>
  );
};

export default NewsCard;

