import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo/logo.png";

// CTA Button - Gradient colors maintained
const CTAButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-md hover:shadow-md transition-all duration-300 flex items-center gap-1.5 text-xs sm:text-sm"
  >
    <Phone size={14} className="sm:w-4 sm:h-4" />
    <span>GET IN TOUCH</span>
  </button>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const activeTab = location.pathname;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Property", path: "/property" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  return (
    <header
      className={`w-full sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-white"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 py-1 flex items-center justify-between">
        {/* Logo Section - Bigger logo */}
        <Link to="/" className="flex items-center space-x-1 sm:space-x-1">
          <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-18 md:h-18 overflow-hidden rounded-full p-1 flex-shrink-0">
            <img
              src={logo}
              alt="Nirveena Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-serif tracking-tight text-gray-900">
            NIRVEENA
          </h1>
        </Link>

        {/* Desktop Nav - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`font-semibold text-sm xl:text-base tracking-wide relative py-1 transition-colors duration-200 ${
                  isActive
                    ? "text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-2 sm:gap-4">
          <CTAButton onClick={() => console.log("CTA Click")} />

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-600 hover:text-gray-900 p-1.5 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <Link
          to="/admin"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Admin Dashboard
        </Link>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 overflow-hidden rounded-full">
                    <img
                      src={logo}
                      alt="Nirveena Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    NIRVEENA
                  </h2>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1.5"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 py-4 px-4 sm:px-5 flex flex-col space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = activeTab === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-semibold py-3 px-4 rounded-md transition-all duration-200 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              <div className="p-5 sm:p-6 border-t border-gray-100">
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p className="font-medium">hello@nirveena.com</p>
                  <p className="font-medium">+1 (234) 567-8900</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Mon-Fri: 9am - 6pm
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
