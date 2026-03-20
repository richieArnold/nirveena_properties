import { useNavigate } from "react-router-dom";

const PropertyNavbar = ({ project }) => {
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -80; // adjust based on navbar height
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };
  return (

    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
          {console.log(window.history)}
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* LEFT → LOGO */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/property"); // or "/projects"
              }
            }}
            className="mr-2 text-lg"
          >
            ←
          </button>

          <img
            src={project?.builder_logo || "/logo.png"}
            className="h-8 object-contain"
          />
        </div>

        {/* CENTER → MENU */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
          <button
            onClick={() => scrollToSection("overview")}
            className="hover:text-blue-600"
          >
            Overview
          </button>

          <button
            onClick={() => scrollToSection("config")}
            className="hover:text-blue-600"
          >
            Configuration
          </button>

          <button
            onClick={() => scrollToSection("amenities")}
            className="hover:text-blue-600"
          >
            Amenities
          </button>

          <button
            onClick={() => scrollToSection("plans")}
            className="hover:text-blue-600"
          >
            Plans
          </button>

          <button
            onClick={() => scrollToSection("gallery")}
            className="hover:text-blue-600"
          >
            Gallery
          </button>

          <button
            onClick={() => scrollToSection("developer")}
            className="hover:text-blue-600"
          >
            Developer
          </button>
        </div>

        {/* RIGHT → CTA */}
        <a
          href={`tel:${project?.contact_number || "+9900468686"}`}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
        >
          +91 {project?.contact_number || "9900468686"}
        </a>
      </div>
    </div>
  );
};

export default PropertyNavbar;
