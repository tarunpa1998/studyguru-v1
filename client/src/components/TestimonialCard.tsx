import { motion } from "framer-motion";

interface TestimonialCardProps {
  quote: string;
  studentName: string;
  studentImage: string;
  studentInfo: string;
}

const TestimonialCard = ({
  quote,
  studentName,
  studentImage,
  studentInfo
}: TestimonialCardProps) => {
  return (
    <motion.div 
      className="bg-card rounded-xl shadow-sm p-6 border border-border"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="flex items-center mb-4">
        <div className="text-amber-500 flex">
          {[...Array(5)].map((_, i) => (
            <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
      </div>
      <blockquote className="mb-4">
        <p className="text-foreground italic">{quote}</p>
      </blockquote>
      <div className="flex items-center">
        <img 
          className="h-10 w-10 rounded-full border border-border" 
          src={studentImage} 
          alt={studentName} 
        />
        <div className="ml-3">
          <p className="text-sm font-medium text-foreground">{studentName}</p>
          <div className="flex items-center">
            <p className="text-xs text-muted-foreground">{studentInfo}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;

