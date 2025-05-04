import { motion } from "framer-motion";
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Mail, 
  Phone, 
  Clock, 
  ArrowRight, 
  GraduationCap,
  Globe,
  School,
  BookOpen,
  FileText
} from "lucide-react";

const Footer = () => {
  const linkHoverVariants = {
    initial: { x: 0 },
    hover: { x: 5 }
  };
  
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 text-white relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full opacity-10 filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-600 rounded-full opacity-5 filter blur-3xl"></div>
      </div>
      
      {/* Main content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        {/* Footer header with CTA */}
        <div className="mb-16 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Start Your Global Education Journey Today
          </motion.h2>
          <motion.p 
            className="text-slate-300 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Join thousands of students who've found their path to success with Study Guru's comprehensive resources and expert guidance.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <button 
              onClick={() => handleNavigate('/scholarships')}
              className="inline-flex items-center bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-full transition-colors duration-200 shadow-lg"
            >
              <GraduationCap className="mr-2 h-5 w-5" />
              Explore Scholarships
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>
        </div>
        
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Logo & social section */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-4 text-white">Study Guru</h3>
              <p className="text-slate-300 mb-6 text-sm">
                Your comprehensive resource for international education opportunities, scholarships, and expert advice for the next generation of global leaders.
              </p>
              
              {/* Social links */}
              <div className="flex space-x-4">
                <motion.a 
                  href="#" 
                  className="bg-white/10 p-2.5 rounded-full text-white hover:bg-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Facebook</span>
                  <Facebook className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-white/10 p-2.5 rounded-full text-white hover:bg-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Twitter</span>
                  <Twitter className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-white/10 p-2.5 rounded-full text-white hover:bg-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">Instagram</span>
                  <Instagram className="h-5 w-5" />
                </motion.a>
                <motion.a 
                  href="#" 
                  className="bg-white/10 p-2.5 rounded-full text-white hover:bg-primary-600 transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="sr-only">LinkedIn</span>
                  <Linkedin className="h-5 w-5" />
                </motion.a>
              </div>
            </motion.div>
          </div>
          
          {/* Quick Links */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                <GraduationCap className="h-5 w-5 mr-2 text-primary-400" />
                Explore
              </h4>
              <ul className="space-y-3">
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('/scholarships')}
                  >
                    <span>Scholarships</span>
                  </motion.div>
                </li>
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('/countries')}
                  >
                    <span>Study Destinations</span>
                  </motion.div>
                </li>
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('/universities')}
                  >
                    <span>Universities</span>
                  </motion.div>
                </li>
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('/news')}
                  >
                    <span>Latest News</span>
                  </motion.div>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Resources */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary-400" />
                Resources
              </h4>
              <ul className="space-y-3">
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('/articles')}
                  >
                    <span>Articles & Guides</span>
                  </motion.div>
                </li>
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('#')}
                  >
                    <span>Visa Information</span>
                  </motion.div>
                </li>
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('#')}
                  >
                    <span>Housing Resources</span>
                  </motion.div>
                </li>
                <li>
                  <motion.div 
                    className="text-slate-300 hover:text-white cursor-pointer flex items-center"
                    variants={linkHoverVariants}
                    initial="initial"
                    whileHover="hover"
                    onClick={() => handleNavigate('#')}
                  >
                    <span>FAQ</span>
                  </motion.div>
                </li>
              </ul>
            </motion.div>
          </div>
          
          {/* Contact Info */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-white">Subscribe to Our Newsletter</h4>
              <p className="text-slate-300 mb-4 text-sm">
                Stay updated with the latest scholarships, educational resources, and expert tips.
              </p>
              
              <form className="mb-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-grow">
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full px-4 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                  <motion.button 
                    type="submit" 
                    className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200 whitespace-nowrap"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Subscribe
                  </motion.button>
                </div>
              </form>
              
              <h4 className="text-lg font-semibold mb-3 text-white">Contact Us</h4>
              <ul className="space-y-3 text-slate-300">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-primary-400" />
                  <span>contact@studyguruindia.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-primary-400" />
                  <span>+1 (555) 123-4567</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 mr-3 text-primary-400" />
                  <span>Mon-Fri 9am-5pm EST</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Study Guru. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 mt-4 md:mt-0">
            <motion.div 
              className="text-slate-400 hover:text-white text-sm cursor-pointer"
              variants={linkHoverVariants}
              initial="initial"
              whileHover="hover"
              onClick={() => handleNavigate('#')}
            >
              Privacy Policy
            </motion.div>
            <motion.div 
              className="text-slate-400 hover:text-white text-sm cursor-pointer"
              variants={linkHoverVariants}
              initial="initial"
              whileHover="hover"
              onClick={() => handleNavigate('#')}
            >
              Terms of Service
            </motion.div>
            <motion.div 
              className="text-slate-400 hover:text-white text-sm cursor-pointer"
              variants={linkHoverVariants}
              initial="initial"
              whileHover="hover"
              onClick={() => handleNavigate('#')}
            >
              Cookie Policy
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
