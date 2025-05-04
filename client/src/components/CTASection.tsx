import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="bg-gradient-to-r from-primary/95 via-primary to-primary/95 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-6">Ready to Begin Your Global Education Journey?</h2>
          <p className="text-primary-foreground/80 mb-8">Join thousands of students who have found their path to international education with studyguruindia.com Get personalized scholarship recommendations and expert advice.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button 
                size="lg" 
                variant="secondary" 
                className="font-medium"
              >
                Create Free Account
              </Button>
            </Link>
            <Link href="/scholarships">
              <Button 
                size="lg" 
                variant="outline" 
                className="font-medium border-primary-foreground/70 text-primary-foreground bg-transparent hover:bg-primary-foreground/10"
              >
                Browse Scholarships
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;





