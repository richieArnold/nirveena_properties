// src/components/Footer.jsx
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Properties", path: "/properties" },
    { name: "Services", path: "/services" },
    { name: "Contact", path: "/contact" },
  ];

  const propertyTypes = [
    { name: "Apartments", path: "/properties?type=apartments" },
    { name: "Villas", path: "/properties?type=villas" },
    { name: "Commercial", path: "/properties?type=commercial" },
    { name: "Luxury Homes", path: "/properties?type=luxury" },
    { name: "New Projects", path: "/properties?type=new" },
  ];

  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
  ];

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      text: "+971 4 123 4567",
      href: "tel:+97141234567",
    },
    {
      icon: <Mail size={18} />,
      text: "info@veena.com",
      href: "mailto:info@veena.com",
    },
    { icon: <MapPin size={18} />, text: "Dubai, UAE", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter subscription");
  };

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">NV</span>
              </div>
              <h1 className="text-base sm:text-lg font-medium text-white tracking-tight">
                VEENA
              </h1>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Premium real estate solutions for modern living and smart
              investments in Dubai's most sought-after locations.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="bg-gray-800 p-2 rounded-md hover:bg-blue-600 transition-colors duration-300 group"
                  aria-label={social.label}
                >
                  <div className="text-gray-200 group-hover:text-white transition-colors duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-blue-500 transition-colors duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Properties
            </h3>
            <ul className="space-y-3">
              {propertyTypes.map((property) => (
                <li key={property.name}>
                  <Link
                    to={property.path}
                    className="text-gray-400 hover:text-blue-500 transition-colors duration-300 text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-gray-500 rounded-full group-hover:bg-blue-500 transition-colors duration-300"></span>
                    {property.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">
              Stay Updated
            </h3>
            <form onSubmit={handleNewsletterSubmit} className="mb-6">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 border border-gray-700 rounded-md text-sm bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="submit"
                  className="bg-linear-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-md font-medium hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 text-sm"
                >
                  <Send size={16} />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Subscribe to get updates on new properties
              </p>
            </form>

            <h4 className="text-md font-semibold mb-3 text-white">
              Contact Info
            </h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <a
                  key={index}
                  href={info.href}
                  className="flex items-center gap-3 text-gray-400 hover:text-blue-500 transition-colors duration-300 group"
                >
                  <div className="bg-gray-800 p-1.5 rounded-md group-hover:bg-blue-600 transition-colors duration-300">
                    <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                      {info.icon}
                    </div>
                  </div>
                  <span className="text-sm">{info.text}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gray-700"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} VEENA Real Estate. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-400 hover:text-gray-200 transition-colors duration-300 text-sm"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
