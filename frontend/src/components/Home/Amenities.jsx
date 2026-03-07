import React from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

// SVG Icons
const SvgIcons = {
  JoggingTrack: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  Gym: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29z"/>
    </svg>
  ),
  YogaLawn: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  PetPark: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.73 12.02l3.98-3.98c.78-.78.78-2.05 0-2.83l-2.83-2.83c-.78-.78-2.05-.78-2.83 0l-3.98 3.98L8 2.29C7.8 2.1 7.55 2 7.29 2c-.26 0-.51.1-.71.29L2.25 6.34c-.39.39-.39 1.02 0 1.41l2.83 2.83L3.17 15c-.39.39-.39 1.02 0 1.41l2.83 2.83c.39.39 1.02.39 1.41 0L15 17.73l3.98 3.98c.78.78 2.05.78 2.83 0l2.83-2.83c.78-.78.78-2.05 0-2.83l-3.98-3.98z"/>
    </svg>
  ),
  Garden: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9 4.03-9 9zM5.6 10.25c0 1.38 1.12 2.5 2.5 2.5.53 0 1.01-.16 1.42-.44l-.02.19c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5l-.02-.19c.4.28.89.44 1.42.44 1.38 0 2.5-1.12 2.5-2.5 0-1-.59-1.85-1.43-2.25.84-.4 1.43-1.25 1.43-2.25 0-1.38-1.12-2.5-2.5-2.5-.53 0-1.01.16-1.42.44l.02-.19C14.5 3.12 13.38 2 12 2S9.5 3.12 9.5 4.5l.02.19c-.4-.28-.89-.44-1.42-.44-1.38 0-2.5 1.12-2.5 2.5 0 1 .59 1.85 1.43 2.25-.84.4-1.43 1.25-1.43 2.25z"/>
    </svg>
  ),
  SwimmingPool: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 10V6c0-1.1-.9-2-2-2h-2V2h-2v2h-2.03c.04.1.03.32.03.5 0 1.93-1.57 3.5-3.5 3.5S7.5 4.93 7.5 3c0-.18 0-.4.03-.5H6V2H4v2H2c-1.1 0-2 .9-2 2v4h2v-4h2v4h2V6h2v4h2V6h2v4h2V6h2v4h2V6h2v4h2z"/>
    </svg>
  ),
  MultipurposeHall: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
      <path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z"/>
    </svg>
  ),
  SkatingRink: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
      <path d="M7.1 10.18c.61 1.11 1.48 2.05 2.52 2.72l.81-.58c-.83-.58-1.52-1.36-1.97-2.25l-1.36.11zM16.9 10.18l-1.36-.11c-.45.89-1.14 1.67-1.97 2.25l.81.58c1.04-.67 1.91-1.61 2.52-2.72z"/>
    </svg>
  ),
  CricketNet: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  ),
  KidsPlayArea: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="15.5" cy="9.5" r="1.5"/>
      <circle cx="8.5" cy="9.5" r="1.5"/>
      <path d="M12 14c-2.33 0-4.32 1.45-5.12 3.5h1.67c.69-1.19 1.97-2 3.45-2s2.75.81 3.45 2h1.67c-.8-2.05-2.79-3.5-5.12-3.5zm-.01-12C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
    </svg>
  ),
  BadmintonCourt: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
      <path d="M8 8h8v2H8zm0 4h8v2H8zm0 4h5v2H8z"/>
    </svg>
  ),
  BasketballCourt: () => (
    <svg className="w-12 h-12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM7.5 17.5h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2v-2h2v2z"/>
    </svg>
  ),
};

const amenities = [
  { id: 1, title: "Jogging Track", icon: SvgIcons.JoggingTrack },
  { id: 2, title: "Gym", icon: SvgIcons.Gym },
  { id: 3, title: "Yoga Lawn", icon: SvgIcons.YogaLawn },
  { id: 4, title: "Pet Park", icon: SvgIcons.PetPark },
  { id: 5, title: "Garden", icon: SvgIcons.Garden },
  { id: 6, title: "Swimming Pool", icon: SvgIcons.SwimmingPool },
  { id: 7, title: "Multipurpose Hall", icon: SvgIcons.MultipurposeHall },
  { id: 8, title: "Skating Rink", icon: SvgIcons.SkatingRink },
  { id: 9, title: "Cricket Net", icon: SvgIcons.CricketNet },
  { id: 10, title: "Kids Play Area", icon: SvgIcons.KidsPlayArea },
  { id: 11, title: "Badminton Court", icon: SvgIcons.BadmintonCourt },
  { id: 12, title: "Basketball Court", icon: SvgIcons.BasketballCourt },
];

const AmenitiesCard = ({ amenity }) => {
  return (
    <motion.div
      className="relative shrink-0 w-48 md:w-56 mx-3 group"
      whileHover={{ 
        y: -12,
        scale: 1.05,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <div className="relative p-6 text-center bg-white rounded-2xl shadow-sm border border-gray-100 group-hover:border-blue-300 group-hover:shadow-2xl transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-blue-400 to-purple-400 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="mb-4 flex justify-center">
          <motion.div 
            className="text-blue-500 group-hover:text-blue-600 transition-colors"
            whileHover={{ rotate: 10 }}
          >
            <amenity.icon />
          </motion.div>
        </div>
        
        <h3 className="font-bold text-gray-800 text-sm md:text-base mb-1 whitespace-nowrap">
          {amenity.title}
        </h3>
        
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-blue-500 transition-colors">
            amenities
          </span>
        </div>

        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full group-hover:w-1/2 transition-all duration-300" />
      </div>
    </motion.div>
  );
};

const Amenities = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const marqueeItems = [...amenities, ...amenities, ...amenities];

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AMENITIES FOR EVERY ASPECT OF LIFE
            </span>
          </h2>
          
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-6 rounded-full"
          />
          
          <p className="text-gray-500 font-medium text-xs md:text-sm uppercase tracking-[0.3em]">
            World-Class Facilities &bull; Premium Experience &bull; Active Lifestyle
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex overflow-hidden py-10">
            <motion.div 
              className="flex"
              animate={{
                x: [0, "-33.33%"],
              }}
              transition={{
                duration: 40,
                ease: "linear",
                repeat: Infinity,
              }}
              whileHover={{ animationPlayState: "paused" }}
              style={{ width: "max-content" }}
            >
              {marqueeItems.map((amenity, index) => (
                <AmenitiesCard key={`${amenity.id}-${index}`} amenity={amenity} />
              ))}
            </motion.div>
          </div>
        </div>

        <motion.div 
          className="mt-12 text-center text-gray-400 text-xs italic md:hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          Hover or tap on a card to learn more
        </motion.div>
      </div>
    </section>
  );
};

export default Amenities;