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
import PropertiesPage from "../Pages/PropertiesPage";
import PropertyDetailsPage from "../Pages/PropertyDetailsPage";
import LeadsList from "../Pages/admin/LeadsList";
import LeadDetails from "../Pages/admin/LeadDetails";

// Admin Pages
import AdminDashboard from "../Pages/admin/AdminDashboard";
import AddProject from "../Pages/admin/AddProject";
import EditProject from "../Pages/admin/EditProject";
import ViewProject from "../Pages/admin/ViewProject";
import ProjectsList from "../Pages/admin/ProjectsList";

import AddBlog from "../Pages/admin/AddBlog";
import BlogsList from "../Pages/admin/BlogsList";
import EditBlog from "../Pages/admin/EditBlog";
import ViewBlog from "../Pages/admin/ViewBlog";

import ScrollToTop from "../components/ScrollToTop";

import CustomersList from "../Pages/admin/CustomersList";
import CustomerDetails from "../Pages/admin/CustomerDetails";

import BlogsPage from "../Pages/BlogsPage";
import BlogDetails from "../Pages/BlogDetails";

import ChangePassword from "../components/admin/ChangePassword";

const PageRoutes = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("adminToken"),
  );

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
    <ScrollToTop/>
    <Routes>
      {/* Public Routes - with Layout */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/property" element={<PropertiesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/properties/:slug" element={<PropertyDetailsPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:slug" element={<BlogDetails />} />
      </Route>

      {/* Admin Routes - NO Layout */}
      <Route path="/admin/login" element={<Login onLogin={handleLogin} />} />

      <Route
        path="/admin/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />

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

      {/* LEADS ROUTES - Place these BEFORE the catch-all route */}
      <Route
        path="/admin/leads"
        element={
          <ProtectedRoute>
            <LeadsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/leads/:id"
        element={
          <ProtectedRoute>
            <LeadDetails />
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

      <Route
        path="/admin/customers"
        element={
          <ProtectedRoute>
            <CustomersList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/customers/:id"
        element={
          <ProtectedRoute>
            <CustomerDetails />
          </ProtectedRoute>
        }
      />

      <Route path="/admin/blogs/create" element={<AddBlog />} />
      <Route path="/admin/blogs" element={<BlogsList />} />
      <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
      <Route path="/admin/blogs/view/:slug" element={<ViewBlog />} />

      <Route path="/blogs" element={<BlogsPage />} />
      <Route path="/blogs/:slug" element={<BlogDetails />} />
    </Routes>
    </>
  );
};

export default PageRoutes;
