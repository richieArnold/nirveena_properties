import { motion } from "framer-motion";
import { MapPin, Home, BedDouble, Square, Maximize2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function PropertyCard({ property }) {
  // Debug log
  console.log("Rendering property:", property);

  // Extract BHK info from typology if available
  const getBHKInfo = () => {
    if (!property.typology) return null;
    const match = property.typology.match(/(\d+)\s*BHK/i);
    return match ? match[0] : null;
  };

  const bhkInfo = getBHKInfo();
  const navigate = useNavigate();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <div
        className="bg-white rounded-xl border border-gray-200
        shadow-md hover:shadow-lg
        transition-all duration-300 group relative
        flex flex-col h-full overflow-hidden cursor-pointer"
        onClick={() => navigate(`/properties/${property.slug}`)}
      >
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={
              property.image_url ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
            }
            alt={property.project_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              console.log("Image failed to load:", property.image_url);
              e.target.src =
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop";
            }}
          />

          {/* Status Badge */}
          <div className="absolute top-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wide shadow-sm ${
                property.project_status === "RTM"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : property.project_status === "UC"
                    ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                    : "bg-blue-100 text-blue-700 border border-blue-200"
              }`}
            >
              {property.project_status || "Coming Soon"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4 flex flex-col flex-1">
          {/* Title and Location */}
          <div className="space-y-1.5 mb-3">
            <h3
              style={{ textTransform: "capitalize" }}
              className="text-base font-bold text-gray-900 leading-snug line-clamp-1"
            >
              {property.project_name}
            </h3>

            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <MapPin size={12} className="text-gray-400 flex-shrink-0" />
              <span
                style={{ textTransform: "capitalize" }}
                className="truncate"
              >
                {property.project_location || "Location coming soon"}
              </span>
            </p>
          </div>

          {/* Property Type Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium">
              <Home size={10} />
              {property.project_type || "Property"}
            </span>
          </div>

          {/* Description Preview */}
          {property.property_description && (
            <div className="mb-3">
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {property.property_description}
              </p>
            </div>
          )}

          {/* Features Grid */}
          <div className="grid grid-cols-3 gap-1.5 mb-3">
            {bhkInfo && (
              <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg">
                <BedDouble size={12} className="text-gray-600 mb-0.5" />
                <span className="text-[10px] font-medium text-gray-700">
                  {bhkInfo}
                </span>
              </div>
            )}
            {property.sba && (
              <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg">
                <Square size={12} className="text-gray-600 mb-0.5" />
                <span className="text-[10px] font-medium text-gray-700">
                  SBA
                </span>
              </div>
            )}
            {property.total_acres && (
              <div className="flex flex-col items-center p-1.5 bg-gray-50 rounded-lg">
                <Maximize2 size={12} className="text-gray-600 mb-0.5" />
                <span className="text-[10px] font-medium text-gray-700">
                  {property.total_acres} ac
                </span>
              </div>
            )}
          </div>

          {/* Price and Action Row */}
          <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
            <div>
              <p className="text-[9px] text-gray-500 uppercase tracking-wider mb-0.5">
                Starting From
              </p>
              <p className="text-sm font-bold text-blue-600">
                {property.price || "On Request"}
              </p>
            </div>

            <Link to={`/properties/${property.slug}`}>
              <button
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white
                bg-gradient-to-r from-blue-600 to-purple-600
                hover:from-blue-700 hover:to-purple-700
                shadow-sm hover:shadow-md
                transition-all duration-300 flex items-center gap-1 cursor-pointer"
              >
                View
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;
