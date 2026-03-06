import { Users, ChevronDown, X, ArrowRight, Sparkles, Shield, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import bgImage from "../../assets/Hero-final.jpeg";
import { useNavigate } from "react-router-dom";

/* Professional font setup */
// @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap');

/* Elegant animations */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Form slide animation
const formVariants = {
  hidden: { 
    x: 50,
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 200,
      delay: 0.2,
    },
  },
  exit: { 
    x: 50,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

const Hero = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollHint(window.scrollY < 50);
    };
    
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Show form after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
        setFormData({
          firstName: '',
          lastName: '',
          phone: '',
          email: ''
        });
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    setShowForm(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Subtle Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-pink-600/5" />
      
      {/* Very Subtle Animated Gradient */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 30% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 50%)',
          ]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Background Image with Soft Overlay */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Luxury Property"
          className="w-full h-full object-cover"
        />
        {/* Soft gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/50 to-transparent" />
      </div>

      {/* Main Content - Mobile Optimized */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6 sm:space-y-8"
          >
            {/* Pre-heading - Mobile Optimized */}
            <motion.div variants={fadeUp}>
              <span className="inline-block px-3 py-1 text-[10px] sm:text-xs font-medium tracking-[0.2em] sm:tracking-[0.3em] uppercase text-white/80 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm">
                Since 2005
              </span>
            </motion.div>

            {/* Main Heading - Mobile Optimized */}
            <motion.h1
              variants={fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white px-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Step Into a World of{' '}
              <span className="block mt-1 sm:mt-2 font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Premium Real Estate
              </span>
            </motion.h1>

            {/* Description - Mobile Optimized */}
            <motion.p
              variants={fadeUp}
              className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Discover an exclusive collection of luxury residences, meticulously curated 
              for discerning individuals who appreciate the finest in architectural excellence.
            </motion.p>

            {/* Stats - Mobile Optimized */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 pt-2 sm:pt-4"
            >
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">120k+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mt-0.5 sm:mt-1">Happy Clients</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">500+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mt-0.5 sm:mt-1">Luxury Properties</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-white/20" />
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">15+</div>
                <div className="text-[10px] sm:text-xs md:text-sm text-white/60 mt-0.5 sm:mt-1">Years Experience</div>
              </div>
            </motion.div>

            {/* CTA Buttons - Mobile Optimized */}
            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 px-4 sm:px-0"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/property")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm sm:text-base font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                Explore Properties
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/contact")}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/5 backdrop-blur-sm border border-white/20 text-white text-sm sm:text-base font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
              >
                Schedule Consultation
              </motion.button>
            </motion.div>

            {/* Trust Badges - Mobile Optimized */}
            <motion.div
              variants={fadeUp}
              className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-4 sm:pt-6 text-[10px] sm:text-xs text-white/30"
            >
              <span className="flex items-center gap-1">
                <Shield size={10} className="sm:w-3 sm:h-3" /> Certified
              </span>
              <span className="flex items-center gap-1">
                <Star size={10} className="sm:w-3 sm:h-3" /> 5 Star Rated
              </span>
              <span className="flex items-center gap-1">
                <Users size={10} className="sm:w-3 sm:h-3" /> 120k+ Trusted
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Form - Hidden on mobile */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 hidden lg:block"
            />
            
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 right-8 -translate-y-1/2 w-96 z-50 hidden lg:block"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                <div className="px-6 py-5 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Get in Touch
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Our team will respond within 24 hours
                  </p>
                </div>

                <div className="p-6">
                  {submitSuccess ? (
                    <motion.div
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center py-6"
                    >
                      <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Thank You!</h4>
                      <p className="text-sm text-gray-500">We'll contact you within 24 hours</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          placeholder="First name"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          placeholder="Last name"
                          className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                        />
                      </div>

                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="Phone number"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                      />

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Email address"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition text-sm"
                      />

                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </span>
                        ) : (
                          'Request Consultation'
                        )}
                      </motion.button>

                      <p className="text-xs text-center text-gray-400">
                        By submitting, you agree to our privacy policy
                      </p>
                    </form>
                  )}
                </div>
              </div>

              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 w-9 h-9 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-100"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Form - Optimized for touch */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden fixed inset-x-4 bottom-4 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
              <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-base font-semibold text-gray-900">Get in Touch</h3>
                <button 
                  onClick={handleClose} 
                  className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>
              
              <div className="p-4">
                {submitSuccess ? (
                  <div className="text-center py-4">
                    <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm text-green-600 font-medium">Thank you!</p>
                    <p className="text-xs text-gray-500 mt-1">We'll contact you soon.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-sm font-medium shadow-md active:scale-[0.98] transition-transform disabled:opacity-50"
                    >
                      {isSubmitting ? 'Sending...' : 'Submit'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll Indicator - Mobile Optimized */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex flex-col items-center gap-1 sm:gap-2 text-white/30">
              <span className="text-[8px] sm:text-xs tracking-widest uppercase">Scroll</span>
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                <ChevronDown size={12} className="sm:w-4 sm:h-4" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;