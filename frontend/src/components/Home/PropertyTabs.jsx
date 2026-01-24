import { useState, useEffect } from "react";
import PropertyCard from "./PropertyCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import axiosInstance from "../../utils/Instance";

const tabs = [
  { id: "Apartments", label: "Apartments", category: "flat" },
  { id: "Villas", label: "Villas", category: "villa" },
  { id: "Plots", label: "Plots", category: "plot" },
  { id: "Upcoming Projects", label: "Upcoming Projects", category: "upcoming" },
  { id: "Resale Projects", label: "Resale Projects", category: "resale" },
];

const PropertyTabs = () => {
  const [activeTab, setActiveTab] = useState("Apartments");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProperties = async () => {
      if (!isMounted) return;

      setLoading(true);
      setError(null);

      try {
        const currentTab = tabs.find(tab => tab.id === activeTab);
        let apiUrl = `/properties?_limit=3`;
        
        // For Apartments, Villas, Plots - filter by category
        if (currentTab.category === "flat" || 
            currentTab.category === "villa" || 
            currentTab.category === "plot") {
          apiUrl = `/properties?category=${encodeURIComponent(currentTab.category)}&_limit=3`;
        }
        // For Upcoming Projects - filter by status
        else if (currentTab.category === "upcoming") {
          apiUrl = `/properties?status=${encodeURIComponent("upcoming")}&_limit=3`;
        }
        // For Resale Projects - filter by status
        else if (currentTab.category === "resale") {
          apiUrl = `/properties?status=${encodeURIComponent("resale")}&_limit=3`;
        }

        const response = await axiosInstance.get(apiUrl);

        if (isMounted) {
          setProperties(response.data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Failed to fetch properties:", err);
          setError("Failed to load properties");
          setProperties([]);
          setLoading(false);
        }
      }
    };

    const timer = setTimeout(fetchProperties, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [activeTab]);

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
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.2 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.3, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
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
          <span className="text-xs font-bold uppercase tracking-widest">
            Featured Properties
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          Explore Properties
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
          Browse by category to find the property that fits your lifestyle.
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={tabsContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="flex flex-wrap justify-center gap-4 mb-14"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            variants={tabVariants}
            whileHover="hover"
            whileTap="tap"
            className={`px-6 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
              activeTab === tab.id
                ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </motion.div>

      {/* Properties Grid */}
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
                className="w-8 h-8 text-gray-400"
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
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {properties.map((property) => (
              <motion.div
                key={property.id}
                variants={itemVariants}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}
                className="group"
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
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
          className="bg-blue-600 text-white px-8 py-3.5 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold shadow-md hover:shadow-lg inline-flex items-center gap-3"
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