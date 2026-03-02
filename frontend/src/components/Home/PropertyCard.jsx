import { useState } from "react";
import { Building, MapPin, Home, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const PropertyCard = ({ property, className = "" }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  // Get configuration types
  const getConfigTypes = () => {
    if (property.configuration && property.configuration.length > 0) {
      return property.configuration.join(", ");
    }
    
    // Fallback based on BHK types in title or description
    const title = property.title || "";
    if (title.includes("2 BHK") && title.includes("3 BHK")) return "2, 3 BHK Apartments";
    if (title.includes("2, 3")) return "2, 3 BHK Apartments";
    if (title.includes("2, 2.5, 3")) return "2, 2.5, 3 BHK Apartments";
    
    return "Apartments";
  };

  // Format price display
  const getPriceDisplay = () => {
    if (property.price?.display) {
      return property.price.display;
    }
    
    if (property.price?.min) {
      const minInCr = (property.price.min / 10000000).toFixed(2);
      if (property.price.max) {
        const maxInCr = (property.price.max / 10000000).toFixed(2);
        return `₹${minInCr} Cr - ₹${maxInCr} Cr`;
      }
      return `₹${minInCr} Cr`;
    }
    
    return "Contact for Price";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${className}`}
    >
      {/* Property Image Container with Overlay */}
      <div className="relative h-72 overflow-hidden">
        {/* Skeleton Loader */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 animate-pulse"></div>
        )}

        {/* Main Image */}
        <img
          src={property.images?.[0] || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00"}
          alt={property.title}
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          } group-hover:scale-110`}
        />

        {/* Gradient Overlay for better text readability */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent"></div>

        {/* Property Info Overlay on Image - ONLY THIS SECTION */}
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          {/* Property Title */}
          <h3 className="text-xl font-bold mb-1">{property.title}</h3>
          
          {/* Developer */}
          <div className="flex items-center gap-1.5 mb-3">
            <Building className="w-3.5 h-3.5" />
            <span className="text-sm font-medium opacity-90">
              {property.developer}
            </span>
          </div>

          {/* Configuration */}
          <div className="flex items-center gap-2 mb-3">
            <Home className="w-4 h-4 opacity-80" />
            <span className="text-sm font-semibold">
              {getConfigTypes()}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0 opacity-80" />
            <div>
              <p className="text-sm font-medium" style={{textTransform:"capitalize"}}>
                {property.location?.area || property.location?.address}
              </p>
              <p className="text-sm opacity-90">
                {property.location?.city}
              </p>
            </div>
          </div>

          {/* Price - Most prominent */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider opacity-80 mb-1">Starting Price</p>
                <div className="text-xl font-bold">
                  {getPriceDisplay()}
                </div>
              </div>
              
              {/* View Details Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1 bg-white text-gray-900 px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors duration-200 shadow-lg"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;