import TestimonialCard from "./TestimonialCard";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const Testimonials = () => {
  const testimonials = [
    {
      quote: "\"Study Guru helped me find and secure a fully-funded scholarship to study Computer Science at MIT. Their resources and guidance made the complex application process so much easier!\"",
      studentName: "Raj Patel",
      studentImage: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      studentInfo: "From India, studying at MIT"
    },
    {
      quote: "\"After struggling with visa applications twice, the guides on Study Guru helped me understand exactly what I needed to do. Now I'm studying Media Arts at University of Melbourne and loving it!\"",
      studentName: "Maria Silva",
      studentImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      studentInfo: "From Brazil, studying in Australia"
    },
    {
      quote: "\"The country comparison tool on Study Guru helped me choose Germany for my Engineering degree. The cost breakdown and scholarship finder saved me thousands in tuition!\"",
      studentName: "Ahmed Hassan",
      studentImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
      studentInfo: "From Egypt, studying in Germany"
    }
  ];

  return (
    <section className="py-12 bg-gradient-to-b from-background to-secondary/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <Separator className="mb-8" />
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Student Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Hear from students who found their path to international education with Study Guru</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TestimonialCard
                quote={testimonial.quote}
                studentName={testimonial.studentName}
                studentImage={testimonial.studentImage}
                studentInfo={testimonial.studentInfo}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;


