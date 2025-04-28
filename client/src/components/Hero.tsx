import { Link } from "wouter";
import { motion } from "framer-motion";
import { GraduationCap, Globe, BookOpen } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 text-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="z-10"
          >
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Your Journey to Global Education Starts Here
            </motion.h1>
            <motion.p 
              className="mt-4 text-lg text-primary-100 max-w-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Discover scholarships, universities, and expert advice for studying abroad. Join thousands of students who found their path with StudyGlobal.
            </motion.p>
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/scholarships">
                <motion.a 
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-primary-50 focus:outline-none shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <GraduationCap className="mr-2 h-5 w-5" />
                  Find Scholarships
                </motion.a>
              </Link>
              <Link href="/countries">
                <motion.a 
                  className="inline-flex justify-center items-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-700 focus:outline-none"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Globe className="mr-2 h-5 w-5" />
                  Explore Countries
                </motion.a>
              </Link>
            </motion.div>
            
            {/* Mobile stats badges */}
            <motion.div 
              className="mt-8 flex flex-wrap gap-3 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-4 py-2 flex items-center">
                <GraduationCap className="h-5 w-5 text-white mr-2" />
                <span className="text-sm font-medium">5000+ Scholarships</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-4 py-2 flex items-center">
                <Globe className="h-5 w-5 text-white mr-2" />
                <span className="text-sm font-medium">150+ Countries</span>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-lg rounded-lg px-4 py-2 flex items-center">
                <BookOpen className="h-5 w-5 text-white mr-2" />
                <span className="text-sm font-medium">Expert Guidance</span>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Desktop image */}
          <div className="hidden lg:block relative">
            <motion.div 
              className="absolute -top-20 -right-20 w-64 h-64 bg-primary-400 rounded-full opacity-20 filter blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
            
            <motion.img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
              alt="Students studying abroad"
              className="rounded-lg shadow-xl relative z-10"
              width="600"
              height="400"
              initial={{ rotate: -2, scale: 0.95, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            />
            
            <motion.div
              className="absolute -bottom-4 -left-4 bg-white p-4 rounded-lg shadow-lg z-20"
              initial={{ rotate: 3, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
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
            
            <motion.div
              className="absolute -top-4 right-20 bg-white p-3 rounded-lg shadow-lg z-20"
              initial={{ rotate: -3, opacity: 0, scale: 0.8 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Globe className="h-6 w-6 text-primary-500" />
                </div>
                <div className="ml-2">
                  <p className="text-sm font-medium text-slate-900">150+ Countries</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-20 left-10 w-20 h-20 border-4 border-white rounded-full"></div>
        <div className="absolute bottom-40 left-40 w-32 h-32 border-4 border-white rounded-full"></div>
        <div className="absolute top-40 right-10 w-40 h-40 border-4 border-white rounded-full"></div>
      </motion.div>
    </section>
  );
};

export default Hero;
