import { Users, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import bgImage from "../../assets/Hero.jpg";
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
      ease: [0.16, 1, 0.3, 1], // smooth cinematic easing
    },
  },
};

const Hero = () => {
  const [showScrollHint, setShowScrollHint] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollHint(window.scrollY < 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const navigate = useNavigate();

  return (
    <div className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt="Modern Luxury Apartment Building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-gray-900/85 via-gray-900/70 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900/20 via-transparent to-transparent" />
      </div>

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
            <div className="w-1 h-5 bg-linear-to-b from-blue-500 to-purple-500 rounded-full" />
            
            <span className="text-[15px] font-semibold text-white uppercase tracking-[0.2em]">
              Premium Real Estate
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemNormal}
            className="text-4xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight"
          >
            Step Into a World of
          </motion.h1>

          <motion.span
            variants={itemNormal}
            className="block text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400 text-3xl sm:text-4xl md:text-5xl font-bold mb-4"
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

          {/* CTA */}
          <motion.div
            variants={itemSlow}
            className="flex flex-col sm:flex-row gap-3"
          >
            <button 
            onClick={()=> navigate("/property")}
            className="bg-linear-to-r from-blue-600 to-purple-600 text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-md hover:shadow-lg transition-all duration-300 ">
              Explore Properties
            </button>
            <button
            onClick={()=> navigate("/contact")}
            className="bg-transparent text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-md border border-white/40 hover:bg-white/10 transition-all duration-300">
              Get Free Consult
            </button>
          </motion.div>
        </motion.div>
      </div>
      

      {/* Scroll indicator */}
      <AnimatePresence>
        {showScrollHint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-5 left-1/2 -translate-x-1/2"
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
