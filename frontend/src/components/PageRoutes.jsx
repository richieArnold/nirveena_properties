// src/components/PageRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import { useState } from "react";

// Public Pages
import Home from "@/pages/Home";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import PropertyDetails from "../pages/PropertyDetails";
import PropertiesPage from "../Pages/PropertiesPage";
import PropertyDetailsPage from "../Pages/PropertyDetailsPage";

// Admin Pages - Update these paths to match your folder structure
import AdminDashboard from "../Pages/admin/AdminDashboard";
import AddProject from "../Pages/admin/AddProject";
import EditProject from "../Pages/admin/EditProject";
import ViewProject from "../Pages/admin/ViewProject";
import ProjectsList from "../Pages/admin/ProjectsList";

const PageRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken"),
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <Routes>
      {/* Public Routes - with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/property" element={<PropertiesPage />} />
        <Route path="/property/:slug" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties/:slug" element={<PropertyDetailsPage />} />
      </Route>

      {/* Admin Routes - NO Layout */}
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
        path="/admin/add"
        element={
          <ProtectedRoute>
            <AddProject />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/list"
        element={
          <ProtectedRoute>
            <ProjectsList />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/edit/:id"
        element={
          <ProtectedRoute>
            <EditProject />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/admin/view/:id"
        element={
          <ProtectedRoute>
            <ViewProject />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all for any other admin routes - redirect to dashboard */}
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