import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/NirveenaLogo.jpeg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith("/blogs");
  const isDetailsPage = location.pathname.startsWith("/properties");

  const activeTab = location.pathname;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Properties", path: "/property" },
    { name: "Contact Us", path: "/contact" },
    { name: "Blogs", path: "/blogs" },

  ];

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      // Check if scrolled more than half screen height
      const halfScreen = window.innerHeight / 2;
      setIsScrolled(window.scrollY > halfScreen);
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
  className={`w-full fixed top-0 z-50 transition-all duration-500 ${
    isScrolled || isBlogPage
      ? "bg-white shadow-lg py-1.5 sm:py-2"
      : "bg-transparent py-2 sm:py-3"
  }`}
>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 flex items-center justify-between">
        {/* Logo Section - Smaller on mobile */}
        <Link to="/" className="flex items-center gap-1 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden rounded-full flex-shrink-0 border-2 border-white/30 shadow-md">
            <img
              src={logo}
              alt="Nirveena Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className={`text-sm sm:text-base md:text-lg lg:text-xl font-serif tracking-wide transition-colors duration-300 ${
isScrolled || isBlogPage ? 'text-gray-900' : 'text-white'          }`}>
            NIRVEENA
          </h1>
        </Link>

        {/* Desktop Nav - Hidden on mobile */}
        <nav className="hidden lg:flex items-center space-x-5 xl:space-x-12">
          {navItems.map((item) => {
            const isActive = activeTab === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`font-semibold text-xs xl:text-sm tracking-wide relative py-1 transition-all duration-300 ${
                  isScrolled || isBlogPage || isDetailsPage
                    ? isActive
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                    : isActive
                      ? "text-white font-bold"
                      : "text-white/90 hover:text-white"
                }`}
              >
                {item.name}
                {isActive && (
                  <motion.span
                    layoutId="activeNav"
                    className={`absolute bottom-0 left-0 w-full h-0.5 ${
                      isScrolled || isBlogPage || isDetailsPage
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                        : 'bg-white'
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          {/* Mobile Menu Button */}
          <button
            className={`lg:hidden p-1 transition-colors ${
              isScrolled || isBlogPage || isDetailsPage ? 'text-gray-600 hover:text-gray-900' : 'text-white hover:text-white/80'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Drawer Panel */}
            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 max-w-[80%] bg-white shadow-xl z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 overflow-hidden rounded-full">
                    <img
                      src={logo}
                      alt="Nirveena Logo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h2 className="text-sm font-semibold text-gray-900">
                    NIRVEENA
                  </h2>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 py-3 px-3 flex flex-col space-y-0.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = activeTab === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium py-2.5 px-3 rounded-md text-sm transition-all duration-200 ${
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

                {/* Mobile Admin Link */}
                <Link
                  to="/admin"
                  className="sm:hidden font-medium py-2.5 px-3 rounded-md text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all duration-200 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </div>

              <div className="p-4 border-t border-gray-100">
                <div className="space-y-1 text-xs text-gray-600">
                  <p className="font-medium">hello@nirveena.com</p>
                  <p className="font-medium">+1 (234) 567-8900</p>
                  <p className="text-[10px] text-gray-500 mt-1">
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