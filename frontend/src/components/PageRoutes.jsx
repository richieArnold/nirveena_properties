// Outlet// src/components/PageRoutes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

// Pages (create these inside src/pages/)
import Home from "@/pages/Home";
import About from "@/pages/About";
import Property from "@/pages/Properties";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";


const PageRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route
        path="/property"
        element={
          <Layout>
            <Property />
          </Layout>
        }
      />
      <Route
        path="/events"
        element={
          <Layout>
            <Events />
          </Layout>
        }
      />
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
    </Routes>
  );
};

export default PageRoutes;
