import { motion } from "framer-motion";
import { GraduationCap, Globe, BookOpen, Search, ArrowRight, MapPin, School } from "lucide-react";
import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-primary-600 bg-gradient-to-br from-primary-700 via-primary-600 to-primary-500 dark:from-primary-800 dark:via-primary-700 dark:to-primary-600 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-0 right-0 w-full h-full opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
        >
          <div className="absolute -top-20 left-10 w-40 h-40 border-4 border-white rounded-full"></div>
          <div className="absolute bottom-10 left-1/4 w-60 h-60 border-4 border-white rounded-full"></div>
          <div className="absolute top-1/4 right-10 w-80 h-80 border-4 border-white rounded-full"></div>
        </motion.div>
        
        <motion.div 
          className="absolute top-10 right-10 w-72 h-72 bg-primary-400 rounded-full opacity-20 filter blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
        
        <motion.div 
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-400 rounded-full opacity-20 filter blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.25, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-3 inline-flex items-center rounded-full border border-white/30 bg-white/10 px-3 py-1 backdrop-blur-sm"
            >
              <span className="text-xs font-semibold uppercase tracking-wider">Education Abroad Magazine</span>
            </motion.div>
            
            <motion.h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Your Journey to Global Education Starts Here
            </motion.h1>
            
            <motion.p 
              className="mt-4 text-lg text-primary-50 max-w-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Discover scholarships, universities, and expert advice for studying abroad. Join thousands of students who found their path with  studyguruindia.com.
            </motion.p>
            
            {/* Search box */}
            <motion.div
              className="mt-8 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="relative max-w-md">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search scholarships, countries, universities..."
                  className="block w-full rounded-2xl border-0 bg-white dark:bg-slate-800 py-3 pl-12 pr-16 text-slate-900 dark:text-slate-200 shadow-lg placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:outline-none"
                />
                <motion.div 
                  className="absolute inset-y-0 right-1 flex items-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button type="button" className="rounded-xl p-2 mr-1 bg-primary-600 text-white hover:bg-primary-700 transition-colors duration-200">
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Popular searches */}
            <motion.div
              className="mt-4 flex flex-wrap gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <span className="text-sm text-primary-100 font-medium">Popular:</span>
              <motion.div
                onClick={() => window.location.href = "/scholarships?tag=Fully+Funded"}
                className="text-sm text-primary-50 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Fully Funded
              </motion.div>
              <motion.div
                onClick={() => window.location.href = "/countries/usa"}
                className="text-sm text-primary-50 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                USA
              </motion.div>
              <motion.div
                onClick={() => window.location.href = "/universities?country=UK"}
                className="text-sm text-primary-50 px-2 py-1 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                UK Universities
              </motion.div>
            </motion.div>
            
            {/* CTA buttons */}
            <motion.div 
              className="mt-8 flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link href="/scholarships">
                <motion.button
                  className="w-full inline-flex justify-center items-center px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700 focus:outline-none shadow-lg transition-colors duration-200"
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <GraduationCap className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Find Scholarships
                </motion.button>
              </Link>
              <Link href="/countries">
                <motion.button
                  className="w-full inline-flex justify-center items-center px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-white/90 dark:hover:bg-slate-700 focus:outline-none shadow-lg transition-colors duration-200"
                  whileHover={{ scale: 1.03, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Globe className="mr-2 h-5 w-5 text-primary-600 dark:text-primary-400" />
                  Explore Countries
                </motion.button>
              </Link>
            </motion.div>
            
            {/* Stats badges - visible on all screens */}
            <motion.div 
              className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center shadow-lg border border-white/20"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <GraduationCap className="h-6 w-6 text-white/90 mr-3" />
                <div>
                  <div className="text-lg font-bold">5000+</div>
                  <div className="text-xs text-primary-100">Scholarships</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center shadow-lg border border-white/20"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <MapPin className="h-6 w-6 text-white/90 mr-3" />
                <div>
                  <div className="text-lg font-bold">150+</div>
                  <div className="text-xs text-primary-100">Countries</div>
                </div>
              </motion.div>
              
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center shadow-lg border border-white/20 col-span-2 sm:col-span-1"
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                <School className="h-6 w-6 text-white/90 mr-3" />
                <div>
                  <div className="text-lg font-bold">1200+</div>
                  <div className="text-xs text-primary-100">Universities</div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          {/* Hero image section - shown on larger screens */}
          <motion.div 
            className="hidden lg:block relative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/20">
              <motion.img
                src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=700&q=80"
                alt="Students studying abroad"
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1 }}
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-primary-900/50 to-transparent"></div>
            </div>
            
            {/* Floating cards */}
            <motion.div
              className="absolute -bottom-6 -left-6 bg-card p-4 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-800"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-50 dark:bg-green-950/30 p-2 rounded-full">
                  <GraduationCap className="h-8 w-8 text-green-600 dark:text-green-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">5000+ Scholarships</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Updated weekly</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -top-6 -right-6 bg-card p-4 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-full">
                  <Globe className="h-7 w-7 text-blue-600 dark:text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">150+ Countries</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Across 6 continents</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-card p-4 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-800"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-50 dark:bg-purple-950/30 p-2 rounded-full">
                  <School className="h-7 w-7 text-purple-600 dark:text-purple-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-200">1200+ Universities</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Top ranked institutions</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;












