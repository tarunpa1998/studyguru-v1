import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";

interface ArticleCardProps {
  title: string;
  summary: string;
  slug: string;
  publishDate: string;
  author: string;
  authorTitle: string;
  authorImage: string;
  image: string;
  category: string;
}



const ArticleCard = ({
  title,
  summary,
  slug,
  publishDate,
  author,
  authorTitle,
  authorImage,
  image,
  category
}: ArticleCardProps) => {
  const handleNavigate = () => {
    window.location.href = `/articles/${slug}`;
  };

  return (
    <motion.div 
      className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden h-full flex flex-col cursor-pointer group border border-border"
      whileHover={{ y: -5 }}
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
      <div className="p-6 flex-grow">
        <div className="flex items-center mb-4">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {category}
          </span>
          <span className="text-muted-foreground text-xs ml-2">{formatDate(publishDate)}</span>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
          {title}
        </h3>
        <p className="text-muted-foreground text-sm mb-4">{summary}</p>
        <div className="flex items-center mt-auto">
          {authorImage && (
            <img 
              className="h-8 w-8 rounded-full border border-border" 
              src={authorImage} 
              alt={author} 
            />
          )}
          <div className="ml-2">
            <p className="text-xs font-medium text-foreground">{author}</p>
            {authorTitle && <p className="text-xs text-muted-foreground">{authorTitle}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArticleCard;

