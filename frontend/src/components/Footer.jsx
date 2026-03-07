// src/components/Footer.jsx
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/NirveenaLogo.jpeg";
const Footer = () => {
  const socialLinks = [
    {
      icon: <Twitter size={18} />,
      href: "https://x.com/Nirveenarealty?s=20",
      label: "Twitter",
    },
    {
      icon: <Instagram size={18} />,
      href: "https://www.instagram.com/nirveena_realty?utm_source=ig_web_button_share_sheet&igsh=ODdmZWVhMTFiMw==",
      label: "Instagram",
    },
  ];

  const contactInfo = [
    {
      icon: <Phone size={18} />,
      text: "+91 9731658272",
      href: "tel:+91 9731658272",
    },
    {
      icon: <Mail size={18} />,
      text: "info@nirveena.com",
      href: "mailto:info@nirveena.com",
    },
    { icon: <MapPin size={18} />, text: "Bengaluru", href: "#" },
  ];

  const legalLinks = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Terms of Service", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
  ];

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 lg:gap-12 justify-items-center text-center">
          {" "}
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src={logo} alt="Nirveena Realty" className="h-10 w-auto" />
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Premium real estate solutions for modern living and smart
              investments in Bangalore's most sought-after locations.
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
          {/* Newsletter & Contact */}
          <div>

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
        <div className="flex flex-col md:flex-row justify-center items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} VEENA Real Estate. All rights
              reserved.
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
