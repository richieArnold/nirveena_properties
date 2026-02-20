import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";

function PropertiesGrid({
  loading,
  filteredProperties,
  getIcon,
  handleViewDetails,
}) {
  return (
    <div className="w-full px-6 py-16">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {loading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200
                shadow-sm overflow-hidden animate-pulse h-[440px]"
              >
                <div className="h-56 bg-gray-200" />
                <div className="p-6 space-y-4">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="border-t pt-4 flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded w-20" />
                      <div className="h-5 bg-gray-200 rounded w-28" />
                    </div>
                    <div className="w-[150px] h-[42px] bg-gray-200 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          : filteredProperties.map((property) => (
              <PropertyCard
                key={property.slug}
                property={property}
                getIcon={getIcon}
                handleViewDetails={handleViewDetails}
              />
            ))}
      </motion.div>
    </div>
  );
}

export default PropertiesGrid;