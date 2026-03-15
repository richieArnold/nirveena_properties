import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/Instance";
import { Building2, Home, TreePine, Briefcase } from "lucide-react";
import { useLocation } from "react-router-dom";

import PropertiesHero from "../components/Properties/PropertiesHero";
import PropertiesFilterBar from "../components/Properties/PropertiesFilterBar";
import PropertiesGrid from "../components/Properties/PropertiesGrid";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const location = useLocation();

  async function fetchProperties() {
    try {
      const res = await axiosInstance.get(
        "/api/projects/getAllPropertiesUnfiltered",
      );
      setProperties(res.data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  // Read both type and status from URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeFromURL = params.get("type");
    const statusFromURL = params.get("status");

    if (typeFromURL) {
      setSelectedType(typeFromURL.toLowerCase());
    }

    if (statusFromURL) {
      // Map URL status codes to display values for the filter
      const statusMap = {
        rtm: "Ready to Move",
        uc: "On Going",
        eoi: "Expression of Interest",
      };

      const displayStatus = statusMap[statusFromURL.toLowerCase()];
      if (displayStatus) {
        setSelectedStatus(displayStatus);
      } else {
        setSelectedStatus("all");
      }
    } else {
      setSelectedStatus("all");
    }
  }, [location.search]);

  const typesFromDB = [
    ...new Set(properties.map((p) => p.project_type?.toLowerCase())),
  ].filter(Boolean);

  const projectTypes = [
    "all",
    ...typesFromDB.filter((t) => t !== "commercial"),
    ...typesFromDB.filter((t) => t === "commercial"),
  ];

  const filteredProperties = properties.filter((property) => {
    const type = property.project_type?.toLowerCase();
    const status = property.project_status; // This is now the display value (e.g., "On Going")
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      property.project_name?.toLowerCase().includes(search) ||
      property.project_location?.toLowerCase().includes(search);

    const matchesType =
      selectedType === "all" ||
      type === selectedType ||
      (selectedType === "villa" && type === "villas");

    const matchesStatus = selectedStatus === "all" || status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getIcon = (type) => {
    if (type === "apartment") return <Building2 size={14} />;
    if (type === "villas") return <Home size={14} />;
    if (type === "villa plots") return <TreePine size={14} />;
    if (type === "commercial") return <Briefcase size={14} />;
    return <Building2 size={14} />;
  };

  const handleViewDetails = async (slug) => {
    try {
      const res = await axiosInstance.get(
        `/api/projects/getSingleProject/${slug}`,
      );
      console.log(res);
    } catch (err) {
      console.error("Failed to fetch project:", err);
    }
  };
  const whatsappNumber = "919731658272"; // change to admin number

  const message = encodeURIComponent(
    "Hello, I am interested in your properties.",
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
  return (
    <>
      <motion.div
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col"
      >
        {/* Phone */}
        <a
          href="tel:+919731658272"
          className="group flex items-center bg-gray-900 hover:bg-indigo-600 text-white w-12 hover:w-40 overflow-hidden transition-all duration-300 rounded-r-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 shrink-0">
            <FaPhoneAlt size={18} />
          </div>

          <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 font-medium">
            Call Us
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-gray-900 hover:bg-green-500 text-white w-12 hover:w-40 overflow-hidden transition-all duration-300 rounded-r-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 shrink-0">
            <FaWhatsapp size={20} />
          </div>

          <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 font-medium">
            WhatsApp
          </span>
        </a>
      </motion.div>
      <div
        className="bg-[#f3f4f6] min-h-screen"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <PropertiesHero />

        <PropertiesFilterBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          projectTypes={projectTypes}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <PropertiesGrid
          loading={loading}
          filteredProperties={filteredProperties}
          getIcon={getIcon}
          handleViewDetails={handleViewDetails}
        />
      </div>
    </>
  );
}

export default PropertiesPage;
