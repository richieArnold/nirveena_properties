import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/Instance";
import {
  Building2,
  Home,
  TreePine,
  Briefcase,
} from "lucide-react";

import PropertiesHero from "../components/Properties/PropertiesHero";
import PropertiesFilterBar from "../components/Properties/PropertiesFilterBar";
import PropertiesGrid from "../components/Properties/PropertiesGrid";
import PropertyModal from "../components/Properties/PropertyModal";

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
    <div className="bg-[#f3f4f6] min-h-screen" style={{ fontFamily: "Poppins, sans-serif" }}>
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

      {isModalOpen && selectedProject && (
        <PropertyModal
          selectedProject={selectedProject}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  );
}

export default PropertiesPage;