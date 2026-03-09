import React from "react";
import Hero from "../components/Home/Hero";
import PropertyTabs from "../components/Home/PropertyTabs";
import Contact from "../components/Home/Contact";
import Stats from "../components/Home/Stats";
import Amenities from "../components/Home/Amenities";
import { Helmet } from "react-helmet-async";

const Home = () => {
  return (
    <>
    <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "RealEstateAgent",
            name: "Nirveena",
            url: "https://www.nirveena.com",
            logo: "https://www.nirveena.com/NirveenaLogo.jpeg",
            areaServed: "Bangalore",
            description: "Premium apartments and villas in Bangalore."
          })}
        </script>
      </Helmet>
      <div>
        <Hero />
        <PropertyTabs />
        <Amenities />
        <Stats />
        <Contact />
      </div>
    </>
  );
};

export default Home;
