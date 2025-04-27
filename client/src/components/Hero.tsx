import { Link } from "wouter";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="bg-primary-600 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Your Journey to Global Education Starts Here
            </h1>
            <p className="mt-4 text-lg text-primary-100 max-w-lg">
              Discover scholarships, universities, and expert advice for studying abroad. Join thousands of students who found their path with StudyGlobal.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/scholarships">
                <a className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-sm">
                  Find Scholarships
                </a>
              </Link>
              <Link href="/countries">
                <a className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Explore Countries
                </a>
              </Link>
            </div>
          </motion.div>
          <div className="hidden lg:block relative">
            <motion.img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
              alt="Students studying abroad"
              className="rounded-lg shadow-xl"
              width="600"
              height="400"
              initial={{ rotate: -2, scale: 0.95 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ duration: 0.6 }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg"
              initial={{ rotate: 3, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-900">5000+ Scholarships</p>
                  <p className="text-xs text-slate-500">Updated weekly</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
