// src/components/PageRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import AdminDashboard from "../Pages/AdminDashboard";
import Login from "./Login"; // Add this import
import ProtectedRoute from "./ProtectedRoute"; // Add this import
import { useState } from "react";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PropertyDetails from "../pages/PropertyDetails";
import PropertiesPage from "../Pages/PropertiesPage";
import PropertyDetailsPage from "../Pages/PropertyDetailsPage";

const PageRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken"),
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* Layout Route */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/property" element={<PropertiesPage />} />
        <Route path="/property/:slug" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties/:slug" element={<PropertyDetailsPage />} />

        {/* Admin routes - these should NOT be inside Layout */}
      </Route>

      {/* Admin routes - outside Layout */}
      <Route path="/admin/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default PageRoutes;
