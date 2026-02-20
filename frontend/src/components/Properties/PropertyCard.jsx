import React from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

function PropertyCard({ property, getIcon, handleViewDetails }) {
  return (
    <motion.div
      layout
      key={property.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="bg-white rounded-2xl border border-gray-200
        shadow-sm hover:shadow-xl hover:-translate-y-1
        transition-all duration-300 group relative
        flex flex-col h-[440px]"
      >
        <div className="relative h-56 overflow-hidden">
          <img
            src={
              property.image_url ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
            }
            alt={property.project_name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />

          <div className="absolute top-4 left-4 bg-white/90 text-gray-900 text-[10px] font-bold uppercase px-3 py-1 rounded-full">
            {property.project_status}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-1">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
              {property.project_name}
            </h3>

            <p className="text-sm text-gray-500 flex items-center gap-2">
              <MapPin size={15} className="text-gray-400" />
              {property.project_location}
            </p>

            <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2">
              {getIcon(property.project_type?.toLowerCase())}
              {property.project_type}
            </p>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-auto flex items-center justify-between">
            <div>
              <p className="text-[11px] text-gray-500 uppercase tracking-[0.15em] mb-1">
                Starting From
              </p>

              <p className="text-blue-600 font-bold text-lg whitespace-nowrap tabular-nums">
                {property.price}
              </p>
            </div>

            <button
              onClick={() => handleViewDetails(property.slug)}
              className="w-[150px] h-[42px] flex items-center justify-center
              rounded-full text-sm font-semibold text-white
              bg-gradient-to-r from-blue-600 to-purple-600
              shadow-md hover:shadow-lg hover:scale-105
              transition-all duration-300"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PropertyCard;