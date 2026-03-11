import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";
import axiosInstance from "../../utils/Instance";
import { useNavigate } from "react-router-dom";

const tabs = [
  { id: "Apartments", label: "Apartments", category: "apartment" },
  { id: "Villas", label: "Villas", category: "villa" },
  { id: "Commercials", label: "Commercials", category: "commercial" },
  { id: "Villa Plots", label: "Villa Plots", category: "villa plots" },
];

const PropertyTabs = () => {
  const [activeTab, setActiveTab] = useState("Apartments");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosInstance.get(
          "/api/projects/getAllPropertiesUnfiltered",
        );
        if (!isMounted) return;

        const normalized = response.data.data.map((p) => ({
          id: p.id,
          slug: p.slug,
          title: p.project_name,
          developer: "Nirveena Properties",
          location: {
            area: p.project_location,
            city: "Bangalore",
          },
          price: {
            display: p.price,
          },
          configuration: p.typology ? [p.typology] : [],
          images: p.image_url ? [p.image_url] : [],
          status: p.project_status?.toLowerCase(),
          category: p.project_type?.toLowerCase(),
        }));

        const currentTab = tabs.find((tab) => tab.id === activeTab);

        let filtered = normalized;

        if (currentTab.category === "villa") {
          filtered = normalized.filter(
            (p) => p.category === "villa" || p.category === "villas",
          );
        } else {
          filtered = normalized.filter(
            (p) => p.category === currentTab.category,
          );
        }

        setProperties(filtered.slice(0, 6));
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch properties:", err);
        setError("Failed to load properties");
        setProperties([]);
        setLoading(false);
      }
    };

    fetchProperties();

    return () => {
      isMounted = false;
    };
  }, [activeTab]);

  // Update max scroll for progress line
  useEffect(() => {
    const container = document.getElementById('properties-scroll-container');
    if (container) {
      setMaxScroll(container.scrollWidth - container.clientWidth);
      
      const handleScroll = () => {
        setScrollPosition(container.scrollLeft);
      };
      
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [properties]);

  const handleScroll = (direction) => {
    const container = document.getElementById('properties-scroll-container');
    if (container) {
      const scrollAmount = 400;
      const newPosition = direction === 'left' 
        ? container.scrollLeft - scrollAmount 
        : container.scrollLeft + scrollAmount;
      
      container.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  // Calculate progress percentage
  const progressPercentage = maxScroll > 0 ? (scrollPosition / maxScroll) * 100 : 0;

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
  };

  const tabsContainerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2, delayChildren: 0.3 } },
  };

  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <section className="container mx-auto px-4 py-16 md:py-24">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full mb-4">
          <Sparkles size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">
            Featured Properties
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4 font-serif">
          Explore Properties
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg font-sans">
          Browse by category to find the property that fits your lifestyle.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={tabsContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-14 "
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variants={tabVariants}
            whileHover="hover"
            whileTap="tap"
            className={`px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 cursor-pointer ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Properties Grid with Progress Line */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600 mb-4"></div>
            <p className="text-gray-500 font-medium">
              Loading {activeTab.toLowerCase()}...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z "
                />
              </svg>
            </div>
            <p className="text-red-500 font-medium mb-4">{error}</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Try Again
            </motion.button>
          </motion.div>
        ) : properties.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-20"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400 "
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">
              No {activeTab.toLowerCase()} found at the moment.
            </p>
          </motion.div>
        ) : (
          <div className="relative">
            {/* Scroll Controls - Removed gradient overlays */}
            <div className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.1, x: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleScroll('left')}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors border border-gray-100"
                disabled={scrollPosition <= 0}
              >
                <ChevronLeft size={20} />
              </motion.button>
            </div>
            
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.1, x: 2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleScroll('right')}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors border border-gray-100"
                disabled={scrollPosition >= maxScroll}
              >
                <ChevronRight size={20} />
              </motion.button>
            </div>

            {/* Properties Container - No gradient overlays */}
            <motion.div
              key={activeTab}
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              exit={{ opacity: 0 }}
              id="properties-scroll-container"
              className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide scroll-smooth"
            >
              {properties.map((property) => (
                <motion.div
                  key={property.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}
                  className="group min-w-[320px] md:min-w-[380px] flex-shrink-0"
                >
                  <PropertyCard property={property} />
                </motion.div>
              ))}
            </motion.div>

            {/* Elegant Progress Line */}
            <div className="mt-6 flex items-center gap-4">
              {/* Progress track */}
              <div className="flex-1 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.1, ease: "linear" }}
                />
              </div>
              
              {/* Minimal percentage indicator */}
              <div className="text-xs font-mono text-gray-400 font-medium tabular-nums">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8 }}
        className="text-center mt-12 md:mt-16"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            const currentTab = tabs.find((tab) => tab.id === activeTab);
            navigate(`/property?type=${currentTab.category}`);
          }}
          className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition duration-300 cursor-pointer font-semibold shadow-md hover:shadow-lg inline-flex items-center gap-3"
        >
          View All {activeTab}
          <motion.span
            className="inline-flex"
            whileHover={{ x: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.span>
        </motion.button>
      </motion.div>
    </section>
  );
};

export default PropertyTabs;