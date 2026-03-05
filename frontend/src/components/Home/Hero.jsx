import { Users, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import bgImage from "../../assets/Hero-final.jpeg";
import { useNavigate } from "react-router-dom";

/* Parent container animation */
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

/* Fast items */
const itemFast = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.55,
      ease: "easeOut", 
    },
  },
};

/* Normal items */
const itemNormal = {
  hidden: { opacity: 0, y: 25 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: "easeOut",
    },
  },
};

/* Slow items (towards the end) */
const itemSlow = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

// Form slide animation from right
const formVariants = {
  hidden: { 
    x: 100,
    opacity: 0,
  },
  visible: { 
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 100,
      delay: 0.3,
    },
  },
  exit: { 
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

// Fun pop-out animation variants
const popOutAnimation = {
  initial: { scale: 1 },
  pop: {
    scale: [1, 1.2, 0.95, 1.05, 0.98, 1],
    transition: {
      duration: 0.8,
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
      ease: "easeInOut",
    },
  },
};

const Hero = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [popButton, setPopButton] = useState(false);
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
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show form after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowForm(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Make button pop out every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPopButton(true);
      
      // Reset after animation completes
      setTimeout(() => {
        setPopButton(false);
      }, 800);
    }, 10000);

    return () => clearInterval(interval);
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
      
      // Reset success message after 3 seconds and close form
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
        // Reset form
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
    <div className="relative min-h-[100vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Modern Luxury Apartment Building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/85 via-gray-900/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 via-transparent to-transparent" />
      </div>

      {/* Left Content */}
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-xl"
        >
          {/* Subtitle */}
          <motion.div
            variants={itemFast}
            className="flex items-center gap-3 mb-3"
          >
            <div className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
            
            <span className="text-[15px] font-semibold text-white uppercase tracking-[0.2em]">
              Premium Real Estate
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemNormal}
            className="text-4xl sm:text-4xl md:text-4xl font-bold text-white mb-4 leading-normal"
          >
            Step Into a World of
          </motion.h1>

          <motion.span
            variants={itemNormal}
            className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 text-4xl sm:text-3xl md:text-4xl font-bold mb-4"
          >
            Premium Real Estate
          </motion.span>

          {/* Description */}
          <motion.p
            variants={itemNormal}
            className="text-gray-200 mt-6 text-base sm:text-base mb-12 leading-relaxed max-w-lg"
          >
            Discover luxury villas and modern apartments carefully selected to
            match your lifestyle and long-term investment goals.
          </motion.p>

          {/* Stats */}
          <motion.div
            variants={itemSlow}
            className="flex items-center gap-4 mb-7"
          >
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-lg border border-white/20">
              <Users className="text-white w-4 h-4" />
              <div>
                <p className="text-[11px] text-gray-300 font-medium">
                  Trusted by
                </p>
                <p className="text-base font-semibold text-white">
                  120k+ People
                </p>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemSlow}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button 
              onClick={()=> navigate("/property")}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-md hover:shadow-lg transition-all duration-300"
            >
              Explore Properties
            </button>
            
            <button
              onClick={()=> navigate("/contact")}
              className="bg-transparent text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-md border border-white/40 hover:bg-white/10 transition-all duration-300"
            >
              Get Free Consult
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Slide-in Form from Right - With Fun Pop-out Button */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-8 top-1/2 -translate-y-1/2 w-96 z-40 hidden lg:block"
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute -top-3 -right-3 p-2 bg-white/70 backdrop-blur-md rounded-full text-gray-700 hover:text-gray-900 transition z-10 shadow-lg border border-white/60"
            >
              <X size={16} />
            </button>

            {/* Form Card - Glassy Look */}
            <div className="bg-white/-10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-white/30">
              {/* Header */}
              <div className="px-6 py-4 border-b border-white/30">
                <h3 className="text-xl font-bold text-white">
                  Contact Us
                </h3>
                <p className="text-sm text-white/80 mt-1">Best deals are waiting for you !</p>
              </div>

              {/* Form Content */}
              <div className="p-6">
                {submitSuccess ? (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center py-6"
                  >
                    <div className="w-16 h-16 bg-green-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 border border-green-400/30">
                      <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                      Thank You!
                    </h4>
                    <p className="text-sm text-white/80">We'll contact you soon</p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* First Name and Last Name - Side by Side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 text-sm"
                          placeholder="John"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-white/80 mb-1">
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 text-sm"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 text-sm"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-white/50 text-sm"
                        placeholder="john@example.com"
                      />
                    </div>

                    {/* Submit Button - Fun Pop-out Animation */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      variants={popOutAnimation}
                      initial="initial"
                      animate={popButton ? "pop" : "initial"}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        'Contact Us'
                      )}
                    </motion.button>
                  </form>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-3 border-t border-white/30 bg-white/5">
                <p className="text-xs text-white/60 text-center">
                  We'll never share your information
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4"
          >
            <div className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      Contact Us
                    </h3>
                    <p className="text-xs text-white/80">Best deals are waiting</p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="p-1.5 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30"
                  >
                    <X size={14} />
                  </button>
                </div>
                
                {submitSuccess ? (
                  <div className="text-center py-4">
                    <p className="text-sm bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-medium">
                      Thank you! We'll contact you soon.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="col-span-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 text-sm"
                    />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="col-span-1 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 text-sm"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="col-span-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 text-sm"
                    />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="col-span-2 px-3 py-2 bg-white/10 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-white/50 text-sm"
                    />
                    <motion.button
                      onClick={handleSubmit}
                      variants={popOutAnimation}
                      initial="initial"
                      animate={popButton ? "pop" : "initial"}
                      className="col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg text-sm font-semibold mt-2"
                    >
                      Contact Us
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll indicator */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-xs text-white/70 font-medium">
                Scroll to explore
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronDown className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hero;