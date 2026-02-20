import React, { useState, useEffect, useMemo, forwardRef } from "react";
import {
  Search,
  MapPin,
  Maximize2,
  Calendar,
  Tag,
  Filter,
  ArrowRight,
  X,
  CheckCircle,
  Phone,
  Home,
  Building2,
  TreePine,
  Zap,
  History,
  LayoutGrid,
  ChevronRight,
  IndianRupee,
  Clock,
  Menu,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Mail,
  Navigation,
  TrainFront,
  Bus,
  Train,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { getProperties } from "@/services/api";
import axiosInstance from "@/utils/Instance";


/**
 * NEW PROPERTY DETAIL MODAL (Split View with Map and Info)
 */


const PropertyDetailModal = ({ isOpen, onClose, property, onEnquire }) => {
  if (!property) return null;

  const query = encodeURIComponent(`${property.project_name
}, ${property.project_location
}`);
  const mapUrl = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const connectivity = Object.entries(property.connectivity || {}).map(
    ([key, dist]) => ({
      name: key,
      dist,
      icon:
        key === "metro" ? (
          <TrainFront size={18} />
        ) : key === "bus" ? (
          <Bus size={18} />
        ) : (
          <Train size={18} />
        ),
    }),
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-[2rem] shadow-3xl overflow-hidden flex flex-col lg:flex-row"
          >
            <div className="w-full lg:w-1/2 p-6 md:p-10 overflow-y-auto no-scrollbar bg-white flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div className="text-left">
                  <div className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg w-fit mb-3">
                    Premium Asset
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight leading-none mb-3">
                    {property.project_name}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-500 font-bold text-sm uppercase tracking-wider">
                    <MapPin size={16} className="text-blue-500" />
                    {property.project_location}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 bg-gray-50 text-gray-400 rounded-xl"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="rounded-2xl overflow-hidden mb-8 shadow-lg aspect-video">
                <img
                  src={property.images?.[0]?.image_url}

                  alt={property.project_name}

                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10 text-left">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Configuration
                  </p>
                  <p className="text-base font-black text-gray-900">
                    {property.typology}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Possession
                  </p>
                  <p className="text-base font-black text-gray-900">
                    {property.rera_completion}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Status
                  </p>
                  <p className="text-base font-black text-blue-600 uppercase italic">
                    {property.project_status}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-10 text-left">
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">
                  Neighborhood Connectivity
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {connectivity.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 transition-all hover:bg-white hover:shadow-md"
                    >
                      <div className="text-blue-600">{item.icon}</div>
                      <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase leading-none mb-1 capitalize">
                          {item.name}
                        </p>
                        <p className="text-sm font-black text-gray-900 leading-none">
                          {item.dist}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-100">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                    Starting Price
                  </p>
                  <p className="text-3xl font-black text-gray-900">
                    {property.price}
                  </p>
                </div>
                <button
                  onClick={() => onEnquire(property)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                >
                  Enquiry Now <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div className="w-full lg:w-1/2 h-[400px] lg:h-auto relative bg-gray-100">
              <button
                onClick={onClose}
                className="hidden lg:flex absolute top-6 right-6 z-20 p-3 bg-white/90 backdrop-blur-md text-gray-500 hover:text-gray-900 rounded-2xl shadow-xl transition-all border border-white"
              >
                <X size={24} />
              </button>
              <iframe
                title={`Map for ${property.project_name}`}

                className="w-full h-full border-0 grayscale-[0.2]"
                src={mapUrl}
                allowFullScreen
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-gray-900/90 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center justify-between text-white pointer-events-none">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                    <Navigation size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">
                      Interactive Location
                    </p>
                    <p className="text-xs font-bold truncate max-w-[200px]">
                      {property.project_name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    Region
                  </p>
                  <p className="text-xs font-bold">
                    {property.project_location}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * CONSULTATION MODAL (The "Enquiry Card")
 */
const ConsultationModal = ({ isOpen, onClose, propertyTitle }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const bangaloreLocations = [
    "North Bangalore",
    "East Bangalore",
    "West Bangalore",
    "South Bangalore",
    "Central Bangalore",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden text-left border border-gray-100"
          >
            {/* Added brand color header accent */}
            <div className="h-2 bg-gradient-to-r from-blue-600 to-purple-600 w-full" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-900 transition-colors z-10 bg-gray-50 rounded-xl"
            >
              <X size={20} />
            </button>

            <div className="p-8 md:p-10 bg-gradient-to-b from-blue-50/30 to-white">
              {formSubmitted ? (
                <div className="py-24 text-center">
                  <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 uppercase tracking-tight">
                    Request Received
                  </h3>
                  <p className="text-gray-600 font-medium">
                    Our experts will contact you regarding{" "}
                    <b>{propertyTitle}</b> shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Zap size={16} fill="currentColor" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Quick Inquiry
                      </span>
                    </div>
                    <h3 className="text-3xl font-black text-gray-900 mb-1 uppercase tracking-tight leading-none">
                      Let's connect
                    </h3>
                    <p className="text-gray-500 text-xs font-medium mt-2">
                      Personalized guidance for:{" "}
                      <span className="text-blue-600 font-bold">
                        {propertyTitle}
                      </span>
                    </p>
                  </div>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-5 font-medium"
                  >
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91"
                        className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Interest
                        </label>
                        <select className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                          <option>Buying</option>
                          <option>Investment</option>
                          <option>Site Visit</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                          Region
                        </label>
                        <select className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                          {bangaloreLocations.map((loc) => (
                            <option key={loc}>{loc}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:shadow-2xl hover:shadow-blue-200 transition-all flex items-center justify-center gap-2 group mt-6 active:scale-[0.98]"
                    >
                      Submit Request{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                    <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest mt-4">
                      By submitting, you agree to our privacy policy & terms.
                    </p>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * ENHANCED PROPERTY CARD
 */
const PropertyCard = forwardRef(({ property, onClick }, ref) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 600, damping: 30 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-600";
      case "ready":
        return "bg-emerald-600";
      case "upcoming":
        return "bg-amber-600";
      case "resale":
        return "bg-indigo-600";
      default:
        return "bg-slate-600";
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      ref={ref}
      layout
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-2xl transition-all group flex flex-col h-full cursor-pointer shadow-sm hover:shadow-xl"
    >
      {/* Made image bigger: h-56 -> h-64 */}
      <div className="relative h-[260px] overflow-hidden">
        <ImageWithFallback
          src={property.image}

          alt={property.project_name}

          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        <div
          className={`absolute top-5 left-5 ${getStatusColor(property.status)} text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-xl shadow-lg`}
        >
          {property.status}     
        </div>
        <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-md">
          <p className="text-blue-600 font-black text-[10px] uppercase tracking-wider">
            {property.category}
          </p>
        </div>
      </div>

      <div
        className="p-6 flex flex-col flex-grow text-left"
        style={{ transform: "translateZ(40px)" }}
      >
        <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 mb-1 leading-tight group-hover:text-blue-600 transition-colors tracking-tight uppercase">
          {property.title}
        </h3>
        <div className="flex items-center gap-1.5 text-gray-400 mb-5">
          <MapPin size={12} className="shrink-0" />
          <span className="text-xs font-bold truncate">
            {property.location}
          </span>
        </div>

        <div className="space-y-3 mb-6 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
            <span className="text-gray-400 font-black uppercase tracking-widest">
              Configuration
            </span>
            <span className="text-gray-900 font-black">{property.area}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest">
            <span className="text-gray-400 font-black uppercase tracking-widest">
              Possession
            </span>
            <span className="text-gray-900 font-black">
              {property.possession}
            </span>
          </div>
        </div>
                          {/* EXTRA PROJECT DETAILS */}
<div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-[11px]">
  <div>
    <p className="text-gray-400 font-black uppercase tracking-widest">Project ID</p>
    <p className="text-gray-900 font-bold">{property.id}</p>
  </div>

  <div>
    <p className="text-gray-400 font-black uppercase tracking-widest">Typology</p>
    <p className="text-gray-900 font-bold">{property.area}</p>
  </div>

  <div>
    <p className="text-gray-400 font-black uppercase tracking-widest">Total Acres</p>
    <p className="text-gray-900 font-bold">{property.totalAcres}</p>
  </div>

  <div>
    <p className="text-gray-400 font-black uppercase tracking-widest">Units</p>
    <p className="text-gray-900 font-bold">{property.units}</p>
  </div>

  <div>
    <p className="text-gray-400 font-black uppercase tracking-widest">Structure</p>
    <p className="text-gray-900 font-bold">{property.structure}</p>
  </div>

  <div>
    <p className="text-gray-400 font-black uppercase tracking-widest">SBA</p>
    <p className="text-gray-900 font-bold">{property.sba}</p>
  </div>

  <div className="col-span-2">
    <p className="text-gray-400 font-black uppercase tracking-widest">Club House Size</p>
    <p className="text-gray-900 font-bold">{property.clubHouseSize}</p>
  </div>
</div>

        <div className="mt-auto pt-5 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Starting from
            </span>
            <p className="text-sm md:text-base font-black text-blue-600 leading-none">
              {property.priceRange}
            </p>
          </div>

          {/* Added color to detail button */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-md transform group-hover:scale-105 transition-all">
            View Details
          </div>
        </div>


      </div>
    </motion.div>
  );
});
PropertyCard.displayName = "PropertyCard";

/**
 * PROPERTIES PAGE
 */
const PropertiesPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedProp, setSelectedProp] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

const API_URL = "http://localhost:5000";

useEffect(() => {
  getProperties()
    .then((data) => {
      const normalized = data.map((p) => ({
        id: p.id,
        slug: p.slug, // 🔥 IMPORTANT
        title: p.project_name,
        status: p.project_status?.toLowerCase(),
        category: p.project_type?.toLowerCase(),

        image: p.images?.[0]?.image_url,
        location: p.project_location,
        priceRange: p.price,
        area: p.typology,
        possession: p.rera_completion,
      }));

      setProperties(normalized);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setLoading(false);
    }
  };

  fetchProjects();
}, []);


  const categories = [
    { id: "all", name: "All Assets", icon: LayoutGrid },
    { id: "flats", name: "Apartments", icon: Building2 },
    { id: "villas", name: "Villas", icon: Zap },
    { id: "plots", name: "Plots", icon: TreePine },
    { id: "upcomingProjects", name: "Upcoming", icon: Clock },
    { id: "resaleProjects", name: "Resale", icon: History },
  ];

  const filteredProperties = useMemo(() => {
    let list = properties;

    if (activeTab !== "all") {
      list = list.filter((p) => {
        if (activeTab === "flats") return p.category === "flat";
        if (activeTab === "villas") return p.category === "villa";
        if (activeTab === "plots") return p.category === "plot";
        if (activeTab === "upcomingProjects") return p.status === "upcoming";
        if (activeTab === "resaleProjects") return p.status === "resale";
        return true;
      });
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q),
      );
    }

    return list;
  }, [properties, activeTab, searchQuery]);

const handlePropertyClick = async (prop) => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(`/api/projects/${prop.slug}`);

    setSelectedProp(res.data.data); // full project
    setIsDetailModalOpen(true);
  } catch (err) {
    console.error("Failed to fetch project details:", err);
  } finally {
    setLoading(false);
  }
};


  const handleEnquireFromDetail = (prop) => {
    setIsDetailModalOpen(false);
    setTimeout(() => setIsModalOpen(true), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">
          Loading Properties
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-gray-900 flex flex-col">
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        propertyTitle={selectedProp?.project_name || "Property"}

      />

      <PropertyDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        property={selectedProp}
        onEnquire={handleEnquireFromDetail}
      />

      <main className="flex-grow">
        {/* PROMO HERO SECTION */}
        <section className="relative bg-gray-900 py-20 md:py-24 overflow-hidden border-b border-gray-800">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
            alt="Pleasant Home Background"
            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px] scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-r from-gray-900 via-gray-900/60 to-transparent" />

          <div className="container mx-auto px-6 relative z-10 text-left">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="bg-white/90 text-gray-900 text-[9px] font-black uppercase tracking-[0.35em] px-4 py-2 rounded-xl w-fit mb-6 border border-gray-200">
                  Nirveena Collection
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight uppercase mb-6">
                  Move Smarter. <br />
                  <span className="text-blue-400 ">Live Better.</span>
                </h1>

                <div className="h-1 w-12 bg-blue-500 mb-6 rounded-full" />

                <p className="text-gray-200 text-sm md:text-base font-bold uppercase tracking-[0.1em] leading-relaxed max-w-xl opacity-90">
                  Explore the best homes, properties, plots tailored to your
                  lifestyle.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* HORIZONTAL FILTER BAR */}
        <div className="sticky top-[0px] z-40 bg-white shadow-xl border-b border-gray-100 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="relative w-full lg:w-96 mx-auto group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search project..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-xs shadow-inner"
                />
              </div>

              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full pb-1 lg:pb-0 px-2">
                <div className="flex flex-nowrap items-center gap-3 min-w-max">
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setActiveTab(cat.id);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-200 -translate-y-0.5 scale-105 border-transparent ring-2 ring-blue-600/20"
                            : "bg-white text-gray-500 hover:bg-gray-50 border border-gray-200 hover:border-blue-200"
                        }`}
                      >
                        <Icon
                          size={14}
                          strokeWidth={isActive ? 3 : 2}
                          className={isActive ? "text-white" : "text-blue-600"}
                        />
                        <span
                          className={`whitespace-nowrap ${isActive ? "opacity-100" : "opacity-80"}`}
                        >
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-24">
          <div className="flex flex-col gap-12 text-left">
            <main className="flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16 gap-6 border-b border-gray-100 pb-8">
                <div>
                  <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">
                    {activeTab === "all"
                      ? "All Inventory"
                      : categories.find((c) => c.id === activeTab).name}
                  </h2>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                      {filteredProperties.length} Premium Units Found
                    </p>
                  </div>
                </div>
              </div>

              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
                  <AnimatePresence mode="popLayout">
                    {filteredProperties.map((prop) => (
                      <PropertyCard
                        key={prop.id}
                        property={prop}
                        onClick={() => handlePropertyClick(prop)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="py-40 text-center bg-gray-50/50 rounded-[2.5rem] border border-dashed border-gray-200">
                  <Search size={48} className="mx-auto text-gray-300 mb-6" />
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight text-gray-900 uppercase tracking-tight">
                    No matching assets
                  </h3>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-2">
                    Adjust your filters to see more results
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PropertiesPage;
