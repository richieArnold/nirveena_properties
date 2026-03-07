import React from "react";
import { motion } from "framer-motion";

function PropertiesHero() {
  return (

    <>
      {/* ✅ HERO SECTION */}
<section className="relative h-[420px] md:h-[500px] flex items-center overflow-hidden text-white">        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
          alt="Luxury Home"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />

<div className="relative z-10 w-full px-4 sm:px-6 lg:px-12">          {/* Small Badge */}
          <div className="bg-white/90 text-gray-900 text-[10px] font-bold uppercase tracking-[0.3em] px-5 py-2 rounded-full w-fit mb-8">
            Nirveena Collection
          </div>

          {/* Heading */}
<h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black uppercase leading-tight" style={{fontFamily: "'Playfair Display', serif" }}>            Move Smarter.
            <br />
            <span className="text-blue-500">Live Better.</span>
          </h1>

          {/* Accent Line */}
          <div className="w-14 h-1 bg-blue-500 mt-8 mb-6 rounded-full" />

          {/* Subtext */}
<p className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.15em] text-gray-300 max-w-xl">            Explore the best homes, properties, plots tailored to your
            lifestyle.
          </p>
        </div>
      </section>
    </>
  );
}

export default PropertiesHero;
