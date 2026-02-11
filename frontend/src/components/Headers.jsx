// src/components/Header.jsx
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

// Optional reusable CTA Button component
const CTAButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-md font-medium hover:shadow-md transition-all duration-300 hover:from-blue-700 hover:to-purple-700 flex items-center gap-1.5 text-xs md:text-sm"
  >
    <Phone size={14} className="md:w-4 md:h-4" />
    <span>GET IN TOUCH</span>
  </button>
);

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const activeTab = location.pathname;

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Property", path: "/property" },
    { name: "Contact Us", path: "/contact" },
  ];

  // Closes mobile menu on link click
  const handleNavigation = () => {
    setIsMenuOpen(false);
  };

  // CTA button click
  const handleGetConsultation = () => {
    console.log("Get consultation clicked");
    // Optional: open modal or navigate
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 sm:space-x-2.5 no-underline"
            >
              {/* Minimal logo */}
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-900 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs sm:text-sm">
                  NV
                </span>
              </div>

              {/* Text */}
              <h1 className="text-base sm:text-lg font-medium text-gray-900 tracking-tight">
                VEENA
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation - Only on large screens */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => {
              const isActive = activeTab === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`font-medium relative group no-underline whitespace-nowrap text-sm xl:text-base transition-colors duration-200 ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={handleNavigation}
                >
                  {item.name}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                      isActive
                        ? "w-fullbg-linear-to-r from-blue-600 to-purple-600"
                        : "w-0 bg-gray-900 group-hover:w-full"
                    }`}
                  ></span>
                </Link>
              );
            })}
          </nav>

          {/* Right side: CTA Button + Hamburger */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* CTA Button - ALWAYS VISIBLE on all screen sizes */}
            <div className="flex items-center">
              <CTAButton onClick={handleGetConsultation} />
            </div>

            {/* Hamburger Menu Button - Visible on mobile & tablet (up to lg) */}
            <button
              className="lg:hidden text-gray-700 p-1.5"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-full h-pxbg-linear-to-r from-transparent via-gray-100 to-transparent"></div>

      {/* Mobile/Tablet Menu Overlay */}
      {isMenuOpen && (
        <>
          {/* Backdrop Overlay */}
          <div
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Menu Panel */}
          <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85%] bg-white shadow-xl z-50 animate-in slide-in-from-right duration-300">
            {/* Menu Header */}
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
            <div className="p-4">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = activeTab === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`font-medium py-3 px-4 rounded-lg transition-all duration-200 no-underline text-base ${
                        isActive
                          ? "text-white bg-linear-to-r from-blue-600 to-purple-600 shadow-md"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                      onClick={handleNavigation}
                    >
                      <div className="flex items-center justify-between">
                        {item.name}
                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Additional Info */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Contact Info</p>
                    <p>Email: info@veena.com</p>
                    <p>Phone: +1 234 567 8900</p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium mb-1">Business Hours</p>
                    <p>Mon-Fri: 9am-6pm</p>
                    <p>Sat: 10am-4pm</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
