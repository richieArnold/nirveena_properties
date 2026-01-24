import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// CTA Button
const CTAButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-linear-to-r from-blue-600 to-purple-600 text-white font-semibold px-4 py-2 md:px-5 md:py-2.5 rounded-md hover:shadow-md transition-all duration-300 flex items-center gap-1.5 text-xs md:text-sm"
  >
    <Phone size={14} className="md:w-4 md:h-4" />
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
    { name: "Events", path: "/events" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Scroll listener to change header background on lg+
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30); // trigger after 30px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // Mobile Drawer animation variants
  const drawerVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
    exit: { x: "100%" },
  };

  return (
    <header
      // className={`w-full sticky top-0 z-50 transition-colors duration-300 bg-linear-to-b from-purple-600 to-purple-500`}
      className={`w-full sticky top-0 z-50 transition-colors duration-300 bg-white`}
    >
    {/* <header
      className={`w-full sticky top-0 z-50 transition-colors duration-300 ${
        isScrolled ? "bg-blue-500 shadow-md" : "bg-transparent"
      }`}
    > */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 sm:space-x-2.5">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">NV</span>
          </div>
          <h1 className="text-base sm:text-lg font-medium text-gray-900 tracking-tight">
            VEENA
          </h1>
        </Link>

        {/* Desktop Nav - lg+ */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-white">
          {navItems.map((item) => {
            const isActive = activeTab === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium relative group no-underline text-sm xl:text-base transition-colors duration-200 ${
                  isActive
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                    isActive
                      ? "w-full bg-black"
                      : "w-0 bg-black group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right side: CTA + Hamburger */}
        <div className="flex items-center gap-3 md:gap-4">
          <CTAButton onClick={() => console.log("CTA Click")} />

          {/* Hamburger Menu */}
          <button
            className="lg:hidden text-gray-700 p-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
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
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 backdrop-blur-sm"
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
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">NV</span>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900">VEENA</h2>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Menu Items */}
              <div className="flex-1 p-4 flex flex-col space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = activeTab === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium py-3 px-4 rounded-lg transition-all duration-200 no-underline text-base ${
                        isActive
                          ? "text-white bg-black shadow-md"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>

              {/* Footer Info */}
              <div className="p-6 border-t border-gray-100 text-sm text-gray-600 space-y-2">
                <p>Email: info@veena.com</p>
                <p>Phone: +1 234 567 8900</p>
                <p>Hours: Mon-Fri 9am-6pm, Sat 10am-4pm</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
