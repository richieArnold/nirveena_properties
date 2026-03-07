import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/Instance";
import {
  Building2,
  Home,
  TreePine,
  Briefcase,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import PropertiesHero from "../components/Properties/PropertiesHero";
import PropertiesFilterBar from "../components/Properties/PropertiesFilterBar";
import PropertiesGrid from "../components/Properties/PropertiesGrid";

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
        "/api/projects/getAllPropertiesUnfiltered"
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const typeFromURL = params.get("type");

    if (typeFromURL) {
      setSelectedType(typeFromURL.toLowerCase());
    }
  }, [location.search]);

  const projectTypes = [
    "all",
    ...new Set(properties.map((p) => p.project_type?.toLowerCase())),
  ];

  const filteredProperties = properties.filter((property) => {
    const type = property.project_type?.toLowerCase();
    const status = property.project_status?.toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      property.project_name?.toLowerCase().includes(search) ||
      property.project_location?.toLowerCase().includes(search);

    const matchesType =
      selectedType === "all" ||
      type === selectedType ||
      (selectedType === "villa" && type === "villas");

    const matchesStatus =
      selectedStatus === "all" || status === selectedStatus;

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
        `/api/projects/getSingleProject/${slug}`
      );
      console.log(res);
    } catch (err) {
      console.error("Failed to fetch project:", err);
    }
  };

  return (
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
  );
}

export default PropertiesPage;