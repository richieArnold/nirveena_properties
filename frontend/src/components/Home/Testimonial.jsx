import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rohit Sharma",
    position: "CEO, TechCorp",
    message:
      "Premier Properties helped me find the perfect investment property. The team is extremely professional and responsive! Their attention to detail and market expertise made the entire process seamless.",
    avatar: "https://i.pravatar.cc/150?img=32",
    rating: 5,
  },
  {
    id: 2,
    name: "Sneha Reddy",
    position: "Entrepreneur",
    message:
      "Amazing experience! They made property hunting so easy and stress-free. Highly recommended for anyone looking for a transparent and reliable real estate partner.",
    avatar: "https://i.pravatar.cc/150?img=44",
    rating: 5,
  },
  {
    id: 3,
    name: "Anil Kumar",
    position: "Investor",
    message:
      "I love how Premier Properties explained everything in detail and helped me make the right choice. Their market insights were invaluable for my investment decisions.",
    avatar: "https://i.pravatar.cc/150?img=12",
    rating: 5,
  },
  {
    id: 4,
    name: "Priya Patel",
    position: "Architect",
    message:
      "Exceptional service from start to finish. The team understood exactly what I was looking for and delivered beyond expectations.",
    avatar: "https://i.pravatar.cc/150?img=8",
    rating: 5,
  },
];

const TestimonialCard = ({ testimonial, isActive }) => {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`bg-white p-6 rounded-2xl shadow-xl h-full ${
        isActive ? "ring-2 ring-blue-500 ring-opacity-20" : ""
      }`}
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut",
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
    >
      {/* Quote Icon */}
      <div className="mb-4">
        <Quote className="w-8 h-8 text-blue-600 opacity-20" />
      </div>

      {/* Message */}
      <p className="text-gray-700 text-base leading-relaxed mb-4 italic">
        "{testimonial.message}"
      </p>

      {/* Rating Stars */}
      <div className="flex items-center gap-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
        />
        <div>
          <h4 className="font-bold text-gray-900 text-base">{testimonial.name}</h4>
          <p className="text-gray-600 text-xs">{testimonial.position}</p>
        </div>
      </div>
    </motion.div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const sectionRef = useRef(null);
  const [sectionInView, setSectionInView] = useState(false);

  // Scroll animation for entire section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: "-50px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || !sectionInView) return;
    
    const interval = setInterval(() => {
      nextTestimonial();
    }, 4000);
    
    return () => clearInterval(interval);
  }, [autoPlay, currentIndex, sectionInView]);

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  // Reduced fixed height
  const cardHeight = "320px";

  return (
    <section ref={sectionRef} className="py-8 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with scroll animation */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={sectionInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={sectionInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-6"
          >
            <span className="text-sm font-bold uppercase tracking-widest">
              Client Stories
            </span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={sectionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-3"
          >
            What Our Clients Say
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Hear directly from our satisfied clients who found their dream properties with us.
          </motion.p>
        </motion.div>

        {/* Testimonial Slider Container */}
        <div 
          className="relative max-w-3xl mx-auto pb-16"
          onMouseEnter={() => setAutoPlay(false)}
          onMouseLeave={() => setAutoPlay(true)}
        >
          {/* Main Card Container with Reduced Fixed Height */}
          <div 
            className="relative mb-10"
            style={{ height: cardHeight, minHeight: cardHeight }}
          >
            <AnimatePresence mode="wait" custom={direction}>
              <TestimonialCard
                key={currentIndex}
                testimonial={testimonials[currentIndex]}
                isActive={true}
              />
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center gap-6">
              <motion.button
                onClick={prevTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </motion.button>
              
              {/* Gradient Indicators */}
              <div className="flex items-center gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonial(index)}
                    className="focus:outline-none"
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "bg-linear-to-r from-blue-600 to-purple-600"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      animate={{
                        width: index === currentIndex ? 24 : 8,
                        height: index === currentIndex ? 8 : 8
                      }}
                      transition={{ duration: 0.3, type: "spring" }}
                    />
                  </button>
                ))}
              </div>

              <motion.button
                onClick={nextTestimonial}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;