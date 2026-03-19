import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
const PropertyNavbar = ({ project }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("overview");

  const scrollToSection = (id) => {
    setActive(id);

    const el = document.getElementById(id);
    if (el) {
      const yOffset = -90;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const menu = [
    { id: "overview", label: "Overview" },
    { id: "config", label: "Configuration" },
    { id: "amenities", label: "Amenities" },
    { id: "plans", label: "Plans" },
    { id: "gallery", label: "Gallery" },
    { id: "developer", label: "Developer" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* LEFT → LOGO + NAME */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>

          <img
            src={
              project?.builder_logo && project.builder_logo.trim() !== ""
                ? project.builder_logo
                : "/NirveenaLogo.jpeg"
            }
            className="h-15 object-contain"
          />
        </div>

        {/* CENTER → MENU */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {menu.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`relative pb-1 transition ${
                active === item.id
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600 hover:cursor-pointer"
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

        {/* RIGHT → CTA */}
        <a
          href={`tel:${project?.contact_number || "9731658272"}`}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md hover:scale-105 transition"
        >
          📞 {project?.contact_number || "9731658272"}
        </a>
      </div>
    </div>
  );
};

export default PropertyNavbar;
