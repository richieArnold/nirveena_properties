import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  User,
  Building,
  Home,
  Map,
} from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    propertyType: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeField, setActiveField] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
        propertyType: "",
      });

      // Reset success message after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const iconVariants = {
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: { type: "spring", stiffness: 300 },
    },
  };

  const inputVariants = {
    focus: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    blur: {
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  return (
    <section className="py-24 bg-linear-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Contact Info */}
            <motion.div
              variants={itemVariants}
              className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8 md:p-12 lg:p-16 relative overflow-hidden"
            >
              {/* Animated Background Elements */}
              <motion.div
                className="absolute top-0 left-0 w-64 h-64 bg-linear-to-r from-blue-600/10 to-purple-600/10 rounded-full -translate-x-1/2 -translate-y-1/2"
                animate={{
                  x: [0, 100, 0],
                  y: [0, 50, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-r from-blue-600/5 to-purple-600/5 rounded-full translate-x-1/2 translate-y-1/2"
                animate={{
                  x: [0, -50, 0],
                  y: [0, -100, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="relative z-10">
                <motion.div variants={itemVariants} className="mb-10">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-full mb-6 border border-white/20"
                  >
                    <MessageSquare size={18} />
                    <span className="text-sm font-bold tracking-widest">
                      GET IN TOUCH
                    </span>
                  </motion.div>
                  <motion.h2
                    variants={itemVariants}
                    className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
                  >
                    Ready to Find Your Dream Property?
                  </motion.h2>
                  <motion.p
                    variants={itemVariants}
                    className="text-gray-300 text-base md:text-lg leading-relaxed"
                  >
                    Fill out the form, and our experts will reach out to you
                    within 1 working hour to help you find the perfect home.
                  </motion.p>
                </motion.div>

                {/* Animated Contact Details */}
                <motion.div
                  variants={containerVariants}
                  className="space-y-6 mb-10"
                >
                  {[
                    {
                      icon: Phone,
                      title: "Call Us",
                      detail: "+91 98765 43210",
                      sub: "All Days, 9AM-9PM",
                      color: "from-blue-500/20 to-purple-500/20",
                    },
                    {
                      icon: Mail,
                      title: "Email Us",
                      detail: "info@nirveena.com",
                      sub: "Response within 1 hours",
                      color: "from-blue-500/20 to-purple-500/20",
                    },
                    {
                      icon: MapPin,
                      title: "Visit Office",
                      detail: "#202, Share Spare, Borewell Road, Whitefield",
                      sub: "Karnataka, India",
                      color: "from-blue-500/20 to-purple-500/20",
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ x: 5 }}
                      className="flex items-start gap-4 group cursor-pointer"
                    >
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className={`w-12 h-12 rounded-xl bg-linear-to-r ${item.color} flex items-center justify-center shrink-0 group-hover:shadow-lg transition-shadow`}
                      >
                        <item.icon className="w-5 h-5 text-blue-300" />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-lg mb-1 group-hover:text-blue-300 transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-gray-300 group-hover:text-white transition-colors">
                          {item.detail}
                        </p>
                        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                          {item.sub}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Animated Stats */}
                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-2 gap-6 pt-8 border-t border-white/20"
                >
                  {[
                    { value: "24/7", label: "Support Available" },
                    { value: "1 Hour", label: "Average Response" },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-4 bg-white/5 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors"
                    >
                      <div className="text-2xl md:text-3xl font-bold mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-300">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Animated Form */}
            <motion.div variants={itemVariants} className="p-8 md:p-12 lg:p-16">
              <AnimatePresence mode="wait">
                {isSubmitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9, rotateX: -90 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.9, rotateX: 90 }}
                    transition={{ duration: 0.5, type: "spring" }}
                    className="flex flex-col items-center justify-center h-full py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring" }}
                      className="w-24 h-24 rounded-full bg-linear-to-r from-green-100 to-emerald-100 flex items-center justify-center mb-8 shadow-lg"
                    >
                      <CheckCircle className="w-12 h-12 text-green-600" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center"
                    >
                      Thank You!
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-600 text-center max-w-md leading-relaxed"
                    >
                      Our property expert will contact you shortly to discuss
                      your requirements and schedule a viewing.
                    </motion.p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <motion.h3
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                      >
                        Fill the form, we'll reach out to you
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-500 text-sm"
                      >
                        Our team will contact you within 24 hours
                      </motion.p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                      {/* Name & Phone Row */}
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid md:grid-cols-2 gap-6"
                      >
                        <motion.div variants={itemVariants}>
                          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <User size={14} />
                            Full Name *
                          </label>
                          <motion.div
                            variants={inputVariants}
                            animate={activeField === "name" ? "focus" : "blur"}
                          >
                            <input
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              onFocus={() => setActiveField("name")}
                              onBlur={() => setActiveField(null)}
                              required
                              placeholder="John Doe"
                              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm hover:shadow"
                            />
                          </motion.div>
                        </motion.div>

                        <motion.div variants={itemVariants}>
                          <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            {" "}
                            <Phone size={14} />
                            Phone Number *
                          </label>
                          <motion.div
                            variants={inputVariants}
                            animate={activeField === "phone" ? "focus" : "blur"}
                          >
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                              onFocus={() => setActiveField("phone")}
                              onBlur={() => setActiveField(null)}
                              required
                              placeholder="+91 90000 00009"
                              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm hover:shadow"
                            />
                          </motion.div>
                        </motion.div>
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                          <Mail size={14} />
                          Email Address *
                        </label>
                        <motion.div
                          variants={inputVariants}
                          animate={activeField === "email" ? "focus" : "blur"}
                        >
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => setActiveField("email")}
                            onBlur={() => setActiveField(null)}
                            required
                            placeholder="john@example.com"
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm hover:shadow"
                          />
                        </motion.div>
                      </motion.div>

                      {/* Property Type */}
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                          <Building size={14} />
                          Property Type Interested In
                        </label>
                        <motion.div
                          variants={inputVariants}
                          animate={
                            activeField === "propertyType" ? "focus" : "blur"
                          }
                        >
                          <select
                            name="propertyType"
                            value={formData.propertyType}
                            onChange={handleChange}
                            onFocus={() => setActiveField("propertyType")}
                            onBlur={() => setActiveField(null)}
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm hover:shadow appearance-none cursor-pointer"
                          >
                            <option value="">Select Property Type</option>
                            <option value="apartment">Apartments</option>
                            <option value="villa">Villas</option>
                            <option value="plot">Plots</option>
                            <option value="commercial">Commercial</option>
                          </select>
                        </motion.div>
                      </motion.div>

                      {/* Message */}
                      <motion.div
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <label className="block text-sm font-semibold text-gray-700 mb-2 items-center gap-2">
                          <MessageSquare size={14} />
                          Your Requirements
                        </label>
                        <motion.div
                          variants={inputVariants}
                          animate={activeField === "message" ? "focus" : "blur"}
                        >
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            onFocus={() => setActiveField("message")}
                            onBlur={() => setActiveField(null)}
                            rows="4"
                            placeholder="Tell us about your property requirements, budget, preferred location, etc."
                            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all text-gray-900 shadow-sm hover:shadow resize-none"
                          />
                        </motion.div>
                      </motion.div>

                      {/* Submit Button */}
                      <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{
                          scale: 1.02,
                          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className={`w-full relative overflow-hidden bg-linear-to-r from-blue-600 via-blue-500 to-purple-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ${
                          isSubmitting ? "opacity-90 cursor-not-allowed" : ""
                        }`}
                      >
                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />

                        {isSubmitting ? (
                          <span className="relative flex items-center justify-center gap-3">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                              }}
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            />
                            Processing...
                          </span>
                        ) : (
                          <span className="relative flex items-center justify-center gap-3 ">
                            Send Message
                            <Send
                              size={18}
                              className="group-hover:translate-x-1 transition-transform"
                            />
                          </span>
                        )}
                      </motion.button>
                    </form>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-400 text-xs text-center pt-4 border-t border-gray-100"
                    >
                      By submitting, you agree to our Terms & Privacy Policy.
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
