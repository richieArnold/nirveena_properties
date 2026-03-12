import React from "react";
import { motion } from "framer-motion";
import PropertyCard from "./PropertyCard";

function PropertiesGrid({
  loading,
  filteredProperties,
  getIcon,
  handleViewDetails,
}) {

  // Ensure commercial properties appear last
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    const aType = (a.project_type || "").toLowerCase().trim();
    const bType = (b.project_type || "").toLowerCase().trim();

    if (aType === "commercial" && bType !== "commercial") return 1;
    if (aType !== "commercial" && bType === "commercial") return -1;

    return 0;
  });

  return (
    <div className="w-full px-4 sm:px-6 lg:px-12 py-10 lg:py-16">
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
          : sortedProperties.map((property) => (
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