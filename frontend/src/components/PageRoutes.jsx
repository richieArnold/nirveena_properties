// src/components/PageRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Property from "@/pages/Properties";
import Events from "@/pages/Events";
import Contact from "@/pages/Contact";
import PropertyDetails from "../pages/PropertyDetails";
import PropertiesPage from "../Pages/PropertiesPage";



const PageRoutes = () => {
  return (
    <Routes>
      {/* Layout Route */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/property" element={<PropertiesPage />} />
        <Route path="/property/:slug" element={<PropertyDetails />} />
        <Route path="/contact" element={<Property />} />

      </Route>
    </Routes>
  );
};

export default PageRoutes;
