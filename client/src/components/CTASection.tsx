import { Link } from "wouter";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="bg-primary-700 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to Begin Your Global Education Journey?</h2>
          <p className="text-primary-100 mb-8">Join thousands of students who have found their path to international education with StudyGlobal. Get personalized scholarship recommendations and expert advice.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scholarships">
              <a className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm">
                Create Free Account
              </a>
            </Link>
            <Link href="/scholarships">
              <a className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                Browse Scholarships
              </a>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
