import React, { useState, useEffect, useRef } from "react";
import {
  Target,
  Users,
  TrendingUp,
  Heart,
  Home,
  Award,
  CheckCircle,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  Building2,
  UserCheck,
  Calendar,
  ArrowRight,
  MessageSquare,
  Clock,
  X,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";

/**
 * REUSABLE COMPONENTS
 */
const ImageWithFallback = ({ src, alt, className }) => {
  const [error, setError] = useState(false);
  if (error || !src) {
    return (
      <div
        className={`${className} bg-gray-100 flex flex-col items-center justify-center text-gray-400 p-4 text-center`}
      >
        <Home size={48} strokeWidth={1} className="mb-2 opacity-50" />
        <span className="text-xs font-medium uppercase tracking-wider">
          {alt || "Image Unavailable"}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
};

const CountUp = ({ end, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) setHasStarted(true);
      },
      { threshold: 0.1 },
    );
    if (countRef.current) observer.observe(countRef.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [hasStarted, end, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

/**
 * FLOWING CARD COMPONENT
 * Implements the magnetic/tilt effect. Conditionally renders background image if provided.
 */
const FlowingCard = ({ data, index, isValueCard = false }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const contentX = useTransform(mouseXSpring, [-0.5, 0.5], ["10px", "-10px"]);
  const contentY = useTransform(mouseYSpring, [-0.5, 0.5], ["10px", "-10px"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Icon = data.icon;

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      className={`relative bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col overflow-hidden cursor-default transition-all duration-300 hover:shadow-xl hover:border-blue-100 ${isValueCard ? "p-10 text-left" : "p-8 items-center text-center"}`}
    >
      {/* Background Image Overlay - Only renders if data.image exists */}
      {data.image && (
        <div className="absolute inset-0 z-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-500 pointer-events-none">
          <img
            src={data.image}
            alt=""
            className="w-full h-full object-cover scale-110 group-hover:scale-125 transition-transform duration-700"
          />
        </div>
      )}

      {/* Content Container with Parallax Flow */}
      <motion.div
        style={{ x: contentX, y: contentY, transformZ: "20px" }}
        className={`relative z-10 flex flex-col pointer-events-none ${!isValueCard ? "items-center" : ""}`}
      >
        <div
          className={`flex items-center justify-center bg-blue-50/90 text-blue-600 rounded-lg mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 backdrop-blur-sm shadow-sm ${isValueCard ? "w-12 h-12" : "w-14 h-14"}`}
        >
          <Icon size={isValueCard ? 24 : 28} />
        </div>

        {isValueCard ? (
          <>
            <h3 className="text-xl font-bold text-gray-900 mb-3 drop-shadow-sm">
              {data.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed drop-shadow-sm font-medium">
              {data.description}
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl font-black text-gray-900 mb-1 tracking-tight drop-shadow-sm">
              <CountUp end={data.number} suffix={data.suffix} />
            </div>
            <div className="text-xs font-bold text-blue-700 uppercase tracking-widest drop-shadow-sm">
              {data.label}
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

/**
 * CONSULTATION MODAL
 */
const ConsultationModal = ({ isOpen, onClose }) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const bangaloreLocations = [
    "North Bangalore",
    "East Bangalore",
    "West Bangalore",
    "South Bangalore",
    "Central Bangalore",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      onClose();
    }, 2500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-gray-100"
          >
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-900 transition-colors z-10"
            >
              <X size={20} />
            </button>
            <div className="p-8 md:p-10">
              {formSubmitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank You!
                  </h3>
                  <p className="text-gray-600">
                    Our experts will contact you shortly.
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8 text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      Book Consultation
                    </h3>
                    <p className="text-gray-500">
                      Professional guidance for your property journey.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="text-left">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Full Name
                      </label>
                      <input
                        required
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                      />
                    </div>
                    <div className="text-left">
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        required
                        type="tel"
                        placeholder="+91"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-gray-900"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Enquiry
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer">
                          <option>Buying</option>
                          <option>Selling</option>
                          <option>Investment</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                          Location
                        </label>
                        <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all cursor-pointer">
                          {bangaloreLocations.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-lg font-bold hover:shadow-lg active:scale-[0.98] mt-4 flex items-center justify-center gap-2 group"
                    >
                      Enquiry now{" "}
                      <ArrowRight
                        size={18}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </button>
                  </form>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

/**
 * MAIN ABOUT PAGE
 */
const About = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description:
        "To help people find their perfect homes and make the buying process seamless and enjoyable.",
    },
    {
      icon: Users,
      title: "Client Focused",
      description:
        "We put our clients first, ensuring personalized service and attention to every detail.",
    },
    {
      icon: TrendingUp,
      title: "Market Expertise",
      description:
        "Years of experience and deep market knowledge to guide you through your real estate journey.",
    },
    {
      icon: Heart,
      title: "Integrity",
      description:
        "We build lasting relationships based on trust, transparency, and professional excellence.",
    },
  ];

  const stats = [
    {
      number: 500,
      label: "Properties Sold",
      suffix: "+",
      icon: Building2,
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=400&auto=format&fit=crop",
    },
    {
      number: 1000,
      label: "Happy Clients",
      suffix: "+",
      icon: UserCheck,
      image:
        "https://media.licdn.com/dms/image/v2/C4D12AQEzsiYwo6HArA/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1520239563445?e=2147483647&v=beta&t=pE94KW86a76XDsYICEjUrBMJxO8XTfpB51U5_xBmf60",
    },
    {
      number: 15,
      label: "Years Experience",
      suffix: "+",
      icon: Calendar,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
    },
    {
      number: 50,
      label: "Expert Agents",
      suffix: "+",
      icon: Award,
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=400&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden flex flex-col">
      <ConsultationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Header and Footer removed from here as they are handled by your global Layout or App.js */}

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[500px] md:h-[600px] bg-gray-900 flex items-center">
          <ImageWithFallback
            src="https://cdn.confident-group.com/wp-content/uploads/2024/12/27103036/types-of-real-estate-overview-scaled.jpg"
            alt="Modern Architecture"
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-left">
            <motion.div
              className="max-w-xl backdrop-blur-[2px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-xl" style={{fontFamily: "'Playfair Display', serif" }}>
                Nirveena Realty
              </h1>

              <p className="text-lg text-gray-100 mb-8 leading-relaxed font-light" style={{ fontFamily: "'Inter', sans-serif" }}>
                At Nirveena Realty, we specialize in premium apartments, luxury
                villas, villa plots, and high-value farmland investments. With
                nearly two decades of expertise and RERA-certified
                professionals, we guide you toward properties that elevate your
                lifestyle and secure your future.
              </p>
              <Link to="/property">
                <button className="bg-white text-gray-900 px-8 py-3.5 rounded-lg font-bold hover:bg-blue-50 transition-all shadow-xl">
                  View Properties
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Company Story */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-left"
              >
                <div className="mb-6">
                  <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                    Our Heritage
                  </span>
                  <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6 text-left tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Crafting Elegant Living
                  </h2>
                </div>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  <p>
                    Nirveena Realty is a premier real estate firm specializing
                    in thoughtfully curated apartments, luxury villas, villa
                    plots, and premium farmland investments. Backed by nearly
                    two decades of industry experience, our RERA-certified
                    professionals are committed to delivering a seamless and
                    transparent property experience for every client.
                  </p>

                  <p>
                    We offer a comprehensive end-to-end solution that supports
                    you at every stage of your property journey, from
                    identifying the right opportunity to ensuring a secure and
                    legally compliant transaction. Our approach combines deep
                    market intelligence, thorough legal due diligence, and
                    data-driven investment insights.
                  </p>

                  <p>
                    At Nirveena Realty, we believe a property should be more
                    than just a purchase, it should be a long-term asset that
                    enhances your lifestyle while building lasting value for the
                    future.
                  </p>
                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg w-fit">
                    <CheckCircle className="text-blue-600" size={20} />
                    <span className="text-sm font-bold text-gray-900">
                      Verified Listings
                    </span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative h-[450px] rounded-xl overflow-hidden shadow-xl">
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1581533961790-5ab6ecdf8254?q=80&w=1491&auto=format&fit=crop"
                    alt="Workspace"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section with Flowing Menu Effect */}
        <section className="py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <FlowingCard key={index} data={stat} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* Values Section with Flowing Menu (Background Images Removed) */}
        <section className="py-24 bg-white text-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                Why Choose Us
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mt-2 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                Our Core Values
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <FlowingCard
                  key={index}
                  data={value}
                  index={index}
                  isValueCard={true}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
