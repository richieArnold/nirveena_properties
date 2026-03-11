import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/NirveenaLogo.jpeg";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPropertiesDropdownOpen, setIsPropertiesDropdownOpen] =
    useState(false);
  const [isMobilePropertiesOpen, setIsMobilePropertiesOpen] = useState(false);
  const location = useLocation();
  const isBlogPage = location.pathname.startsWith("/blogs");
  const isDetailsPage = location.pathname.startsWith("/properties");

  const activeTab = location.pathname;

  // Reordered navItems - Properties will be added separately as the 3rd item
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Contact Us", path: "/contact" },
    { name: "Blogs", path: "/blogs" },
  ];

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
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
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-1 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 overflow-hidden rounded-full flex-shrink-0 border-2 border-white/30 shadow-md">
            <img
              src={logo}
              alt="Nirveena Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            className={`text-sm sm:text-base md:text-lg lg:text-xl font-serif tracking-wide transition-colors duration-300 ${
              isScrolled || isBlogPage ? "text-gray-900" : "text-white"
            }`}
          >
            NIRVEENA
          </h1>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-5 xl:space-x-12">
          {/* First two items */}
          {navItems.slice(0, 2).map((item) => {
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
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-white"
                    }`}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          {/* Properties Dropdown - Third position */}
          <div
            className="relative"
            onMouseEnter={() => setIsPropertiesDropdownOpen(true)}
            onMouseLeave={() => setIsPropertiesDropdownOpen(false)}
          >
            <button
              className={`font-semibold text-xs xl:text-sm tracking-wide relative py-1 transition-all duration-300 flex items-center gap-1 ${
                isScrolled || isBlogPage || isDetailsPage
                  ? "text-gray-600 hover:text-gray-900"
                  : "text-white/90 hover:text-white"
              }`}
            >
              Properties
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-300 ${
                  isPropertiesDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu with Status Options - UPDATED WITH GLASSY LOOK */}
            <AnimatePresence>
              {isPropertiesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 w-64 bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl py-2 z-50 overflow-hidden"
                >
                  {/* Glass background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>

                  <div className="relative">
                    <Link
                      to="/property"
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                        All Properties
                      </span>
                    </Link>
                    <Link
                      to="/property?status=rtm"
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                        Ready to Move
                      </span>
                    </Link>
                    <Link
                      to="/property?status=uc"
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                        On Going
                      </span>
                    </Link>
                    <Link
                      to="/property?status=eoi"
                      className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-600 transition-all"
                      onClick={() => setIsPropertiesDropdownOpen(false)}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                        Expression of Interest
                      </span>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Last two items */}
          {navItems.slice(2).map((item) => {
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
                        ? "bg-gradient-to-r from-blue-600 to-purple-600"
                        : "bg-white"
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
              isScrolled || isBlogPage || isDetailsPage
                ? "text-gray-600 hover:text-gray-900"
                : "text-white hover:text-white/80"
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer with Accordion */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-72 max-w-[80%] bg-white/90 backdrop-blur-xl shadow-2xl z-50 flex flex-col border-l border-white/20"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 overflow-hidden rounded-full ring-2 ring-white/50">
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
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-white/60 transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 py-4 px-3 flex flex-col space-y-1 overflow-y-auto">
                {/* Regular nav items - Glassy style */}
                {navItems.map((item) => {
                  const isActive = activeTab === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium py-3 px-4 rounded-xl text-sm transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                          : "text-gray-700 hover:bg-white/60 backdrop-blur-sm hover:shadow-md"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  );
                })}

                {/* Properties Accordion - Glassy look */}
                <div className="relative mt-2">
                  {/* Glass background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur-sm"></div>

                  <div className="relative bg-white/40 backdrop-blur-md border border-white/60 rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() =>
                        setIsMobilePropertiesOpen(!isMobilePropertiesOpen)
                      }
                      className="w-full flex items-center justify-between px-4 py-3.5 text-sm font-medium text-gray-800 hover:bg-white/60 transition-all duration-300 group"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
                        Properties
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-all duration-500 ${
                          isMobilePropertiesOpen
                            ? "rotate-180 text-purple-600"
                            : "text-gray-500 group-hover:text-purple-600"
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isMobilePropertiesOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-2 pb-2 space-y-0.5">
                            <Link
                              to="/property"
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-lg transition-all duration-300 hover:translate-x-1"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                All Properties
                              </span>
                            </Link>
                            <Link
                              to="/property?status=rtm"
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-lg transition-all duration-300 hover:translate-x-1"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-green-400"></span>
                                Ready to Move
                              </span>
                            </Link>
                            <Link
                              to="/property?status=uc"
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-lg transition-all duration-300 hover:translate-x-1"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-yellow-400"></span>
                                On Going
                              </span>
                            </Link>
                            <Link
                              to="/property?status=eoi"
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-white/60 backdrop-blur-sm rounded-lg transition-all duration-300 hover:translate-x-1"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <span className="flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-purple-400"></span>
                                Expression of Interest
                              </span>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-white/20 bg-white/30 backdrop-blur-sm">
                <div className="space-y-1 text-xs text-gray-600">
                  <p className="font-medium">info@nirveena.com</p>
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
