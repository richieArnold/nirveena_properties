import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/Instance";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  Building2,
  Home,
  TreePine,
  Briefcase,
  Clock,
  CheckCircle,
  Rocket,
  MapPin,
} from "lucide-react";
import PropertiesHero from "../components/Properties/PropertiesHero";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  async function fetchProperties() {
    try {
      const res = await axiosInstance.get("/api/projects/getAllProjects");
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

  const projectTypes = [
    "all",
    ...new Set(properties.map((p) => p.project_type?.toLowerCase())),
  ];

  const projectStatuses = [
    "all",
    ...new Set(properties.map((p) => p.project_status?.toLowerCase())),
  ];

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.project_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      property.project_location
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesType =
      selectedType === "all" ||
      property.project_type?.toLowerCase() === selectedType;

    const matchesStatus =
      selectedStatus === "all" ||
      property.project_status?.toLowerCase() === selectedStatus;

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
      const res = await axiosInstance.get(`/api/projects/getSingleProject/${slug}`);
      setSelectedProject(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch project details:", err);
    }
  };

  return (
    <div
      className="bg-[#f3f4f6] min-h-screen"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Hero Section */}

      <PropertiesHero />

      {/* 🔎 FILTER BAR */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-6 py-5 flex items-center gap-6">
          {/* Search Input */}
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search project..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-gray-100 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
            />
          </div>
          {/* Type Pills */}
          <div className="flex gap-3">
            {projectTypes.map((type) => {
              const isActive = selectedType === type;

              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border
            ${
              isActive
                ? "bg-blue-600 text-white border-blue-600 shadow-md"
                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
            }`}
                >
                  {type === "all"
                    ? "All Assets"
                    : type.replace(/\b\w/g, (l) => l.toUpperCase())}
                </button>
              );
            })}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 rounded-xl border border-gray-200 bg-gray-100 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="rtm">RTM</option>
            <option value="uc">UC</option>
            <option value="eoi">EOI</option>
          </select>
        </div>
      </div>

      {/* GRID */}
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
                    {/* IMAGE */}
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

                    {/* CONTENT */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Top Content */}
                      <div className="space-y-2">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 leading-snug line-clamp-2">
                          {property.project_name}
                        </h3>

                        {/* Location */}
                        <p className="text-sm text-gray-500 flex items-center gap-2">
                          <MapPin size={15} className="text-gray-400" />
                          {property.project_location}
                        </p>

                        {/* Project Type */}
                        <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-2">
                          {getIcon(property.project_type?.toLowerCase())}
                          {property.project_type}
                        </p>
                      </div>

                      {/* Bottom Section */}
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
              ))}
        </motion.div>
      </div>
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
          <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
            {/* Close */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl"
            >
              ✕
            </button>

            {/* Image */}
            <div className="h-80 overflow-hidden">
              <img
                src={
                  selectedProject.image_url ||
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
                }
                alt={selectedProject.project_name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Details */}
            <div className="p-8 space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProject.project_name}
              </h2>

              <p className="text-gray-500">
                {selectedProject.project_location}
              </p>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400">Price</p>
                  <p className="font-semibold text-blue-600">
                    {selectedProject.price}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Type</p>
                  <p className="font-semibold">
                    {selectedProject.project_type}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <p className="font-semibold">
                    {selectedProject.project_status}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Slug</p>
                  <p className="font-semibold">{selectedProject.slug}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertiesPage;
