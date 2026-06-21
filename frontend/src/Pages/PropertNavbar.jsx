import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft, Menu, X, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NirveenaLogo from "../assets/NirveenaLogo.jpg";

const PropertyNavbar = ({ project }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    setActive(id);
    setIsOpen(false);

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      setTimeout(() => {
        scrollToSection(hash);
      }, 300);
    }
  }, []);

  const menu = [
    { id: "overview", label: "Overview" },
    { id: "config", label: "Configuration" },
    { id: "amenities", label: "Amenities" },
    { id: "plans", label: "Plans" },
    { id: "gallery", label: "Gallery" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* LEFT → LOGO + NAME */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/property");
              }
            }}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>

          <img
            src={
              project?.builder_logo && project.builder_logo.trim() !== ""
                ? project.builder_logo
                : "/NirveenaLogo.jpg"
            }
            className="h-10 sm:h-12 object-contain"
            alt="Builder Logo"
          />
        </div>

        {/* CENTER → MENU (Desktop) */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative pb-1 transition hover:cursor-pointer ${
                active === item.id
                  ? "text-blue-600 font-bold"
                  : "text-gray-600 hover:text-blue-600"
              }`}
            >
              {item.label}

              {/* ACTIVE UNDERLINE */}
              {active === item.id && (
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-blue-600 rounded"></span>
              )}
            </button>
          ))}
        </div>

        {/* RIGHT → CTA + LOGO (Desktop) & Hamburger (Mobile) */}
        <div className="flex items-center gap-3">
          {/* Call CTA - Desktop: full button with text, Mobile: icon button */}
          <a
            href={`tel:${project?.contact_number || "9900468686"}`}
            className="hidden sm:inline-flex bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition items-center gap-1.5"
          >
            📞 {project?.contact_number || "9900468686"}
          </a>

          <a
            href={`tel:${project?.contact_number || "9900468686"}`}
            className="inline-flex sm:hidden p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 transition shadow-sm"
            aria-label="Call Builder"
          >
            <Phone size={16} />
          </a>

          <img
            src={NirveenaLogo}
            alt="Nirveena"
            className="h-12 sm:h-15 w-auto object-contain"
          />

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition text-gray-700"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-16 bg-black/40 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Menu Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
              className="fixed top-16 right-0 bottom-0 w-72 bg-white shadow-2xl border-l border-gray-100 p-6 z-50 md:hidden flex flex-col justify-between"
            >
              <div className="flex flex-col gap-5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Navigation
                </span>
                <div className="flex flex-col gap-2">
                  {menu.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`text-left py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                        active === item.id
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom CTA in Mobile Drawer */}
              <div className="flex flex-col gap-4 border-t pt-6">
                <a
                  href={`tel:${project?.contact_number || "9900468686"}`}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition"
                >
                  📞 Call Builder ({project?.contact_number || "9900468686"})
                </a>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <img
                    src={NirveenaLogo}
                    alt="Nirveena Logo"
                    className="h-8 object-contain"
                  />
                  <span className="text-xs text-gray-400">Nirveena Realty</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyNavbar;
