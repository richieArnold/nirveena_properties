import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/Instance";
import { Link } from "react-router-dom";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchProperties() {
    try {
      const res = await axiosInstance.get("/api/projects");
      setProperties(res.data.data); // 🔥 Corrected
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Properties Page</h1>

      {loading && <p>Loading properties...</p>}

      {!loading && properties.length === 0 && <p>No properties available</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {properties.map((property) => (
          <Link
            key={property.slug}
            to={`/property/${property.slug}`}
            style={{ textDecoration: "none", color: "black" }}
          >
            <div
              style={{
                width: "280px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "10px",
                cursor: "pointer",
              }}
            >
              {/* Image */}
              <img
                src={
                  property.image_url
                    ? property.image_url
                    : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
                }
                alt={property.project_name}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop";
                }}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                  borderRadius: "6px",
                }}
              />

              {/* Details */}
              <h3 style={{ marginTop: "10px" }}>{property.project_name}</h3>
              <p>{property.project_location}</p>
              <p>{property.price}</p>
              <p>
                {property.project_type} | {property.project_status}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default PropertiesPage;
