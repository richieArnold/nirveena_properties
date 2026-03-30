import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axiosInstance from "../utils/Instance";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  MapPin,
  Square,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Calendar,
  Info,
  CheckCircle2,
  Building2,
  Home,
  IndianRupee,
  Lock,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { Clock, LayoutGrid, Ruler } from "lucide-react";
import { useUserRegistration } from "../context/UserRegistrationContext";

import EnquiryForm from "../components/Properties/EnquiryForm";
import PropertyNavbar from "./PropertNavbar";

function PropertyDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [projectDetails, setProjectDetais] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);

  const [showExitPopup, setShowExitPopup] = useState(false);
  const [popupClosed, setPopupClosed] = useState(false);
  const [showBackPopup, setShowBackPopup] = useState(false);

  const [floorPlanViewer, setFloorPlanViewer] = useState(false);
  const [activeFloorPlan, setActiveFloorPlan] = useState(null);

  const scrollRef = useRef(null);

  const amenities = project?.features?.flatMap((f) => f.items) || [];

  const { isRegistered } = useUserRegistration();

  const isProjectRegistered = project ? isRegistered(projectDetails.id) : false;

  const [isWide, setIsWide] = useState(true);

  const [showWABubble, setShowWABubble] = useState(false);
  const [hideBubble, setHideBubble] = useState(false);

  useEffect(() => {
    if (isProjectRegistered) return;

    const timer = setTimeout(() => {
      if (!hideBubble) setShowWABubble(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [hideBubble, isProjectRegistered]);

  useEffect(() => {
    if (isProjectRegistered) return;

    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isProjectRegistered]);

  useEffect(() => {
    const handleExitIntent = (e) => {
      if (popupClosed || isProjectRegistered || showExitPopup) return;

      if (e.clientY <= 10) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, [popupClosed, isProjectRegistered, showExitPopup]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axiosInstance.get(
          `/api/projects/full-details/${slug}`, // ✅ NEW API
        );

        const data = res.data.data;
        // console.log(data);
        setProject(data); // full object
        setProjectDetais(data.project); // actual project
        setConnectivity(data.connectivity || {}); // ✅ now comes from same API
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

  const configScrollRef = useRef(null);
  useEffect(() => {
    const scrollContainer = configScrollRef.current;
    if (!scrollContainer || window.innerWidth > 640) return; // Only auto-scroll on mobile

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      // If at the end, jump back to start, else scroll right by one card width
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({
          left: clientWidth * 0.85,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [project?.configurations]);

  const floorPlanScrollRef = useRef(null);
  useEffect(() => {
    const scrollContainer = floorPlanScrollRef.current;
    if (!scrollContainer || window.innerWidth > 640) return; // Only auto-scroll on mobile

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      // If at the end, jump back to start, else scroll right by one card width
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({
          left: clientWidth * 0.85,
          behavior: "smooth",
        });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [project?.floorplans]);

  const galleryScrollRef = useRef(null);

  const connectivityScrollRef = useRef(null);

  const [connectivity, setConnectivity] = useState({});

  const allImages = project?.images || [];
  const heroImages =
    allImages.length >= 3
      ? allImages.slice(0, 3)
      : [...allImages, ...allImages, ...allImages].slice(0, 3);
  const galleryImages = allImages.slice(3);

  useEffect(() => {
    const scrollContainer = galleryScrollRef.current;

    if (!scrollContainer || window.innerWidth > 640) return; // only mobile

    const interval = setInterval(() => {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollBy({
          left: clientWidth * 0.8,
          behavior: "smooth",
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [galleryImages]);

  useEffect(() => {
    if (!heroImages?.length || viewerOpen) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages, viewerOpen]);
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setViewerOpen(false);
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    if (viewerOpen) {
      window.addEventListener("keydown", handleKey);
    }

    return () => window.removeEventListener("keydown", handleKey);
  }, [viewerOpen, project]);

  const schemaData = project
    ? {
        "@context": "https://schema.org",
        "@type": "Product",
        name: project.project_name,
        description: project.property_description?.replace(/[#*`]/g, ""), // Remove markdown for meta description
        image: project.image_url,
        brand: {
          "@type": "Brand",
          name: "Nirveena",
        },
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: project.price,
          availability: "https://schema.org/InStock",
        },
      }
    : null;

  const nextImage = () => {
    const total = viewerOpen ? project.images.length : heroImages.length;

    setActiveImage((prev) => (prev + 1) % total);
  };

  const prevImage = () => {
    const total = viewerOpen ? project.images.length : heroImages.length;

    setActiveImage((prev) => (prev - 1 + total) % total);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading property...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold">Project not found</h2>
      </div>
    );
  }

  const handleEnquirySuccess = () => {
    navigate("/thank-you", {
      state: {
        projectName: projectDetails.project_name,
      },
    });
  };
  const whatsappNumber = "919900468686"; // change to admin number

  const message = encodeURIComponent(
    `Hi, I'm interested in ${projectDetails.project_name} located at ${projectDetails.project_location}`,
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;

  //image load
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;

    if (naturalWidth > naturalHeight) {
      setIsWide(true); // landscape → cover
    } else {
      setIsWide(false); // portrait → contain
    }
  };

  //Youtube Helper

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    const regExp = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;

    const match = url.match(regExp);

    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const embedUrl = getYoutubeEmbedUrl(projectDetails.youtube_video_url);

  return (
    <>
      {/* {console.log(project)} */}
      <PropertyNavbar project={projectDetails} />
      {project && (
        <Helmet>
          <title>{`${projectDetails.project_name} | Nirveena`}</title>

          <meta
            name="description"
            content={projectDetails.property_description
              ?.replace(/[#*`]/g, "")
              .substring(0, 160)}
          />

          <meta property="og:title" content={projectDetails.project_name} />

          <meta
            property="og:description"
            content={projectDetails.property_description
              ?.replace(/[#*`]/g, "")
              .substring(0, 160)}
          />

          <meta property="og:image" content={projectDetails.image_url} />

          <meta
            property="og:url"
            content={`https://www.nirveena.com/property/${projectDetails.slug}`}
          />

          {schemaData && (
            <script type="application/ld+json">
              {JSON.stringify(schemaData)}
            </script>
          )}
        </Helmet>
      )}

      <div className="min-h-screen bg-slate-50 pb-20">
        {/*  FULL WIDTH HERO */}
        <div className="relative w-full h-[45vh] sm:h-[60vh] md:h-[75vh] lg:h-[85vh] overflow-hidden bg-black">
          {/* BLUR BACKGROUND */}
          <img
            src={heroImages[activeImage]?.image_url || heroImages[0]?.image_url}
            className="absolute w-full h-full object-cover blur-xl scale-110 opacity-25"
            alt=""
          />

          {/* MAIN IMAGE */}
          <motion.img
            key={activeImage}
            src={heroImages?.[activeImage]?.image_url}
            onLoad={handleImageLoad}
            onClick={() => setViewerOpen(true)}
            className={`relative z-10 h-full mx-auto w-full cursor-zoom-in ${
              isWide ? "object-cover" : "object-contain"
            }`}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          />

          {/* OPTIONAL GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-20" />

          {/* LEFT */}
          <button
            onClick={prevImage}
            className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-30 bg-black/40 p-2 sm:p-3 rounded-full text-white"
          >
            <ChevronLeft size={28} />
          </button>

          {/* RIGHT */}
          <button
            onClick={nextImage}
            className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black text-white p-2 sm:p-3 rounded-full"
          >
            <ChevronRight size={28} />
          </button>

          {/* DOTS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {heroImages?.map((_, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(index)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  activeImage === index ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>

          {/* 🔥 BONUS: TOTAL IMAGES COUNT */}
          <div className="absolute bottom-4 right-4 z-30 bg-black/60 text-white px-3 py-1 rounded text-sm">
            {allImages.length} Photos
          </div>
        </div>
        {/* 🔥 FLOATING PROPERTY CARD */}
        <div className="relative z-30 translate-y-[-30px] md:translate-y-[-60px] lg:translate-y-[-80px] px-4">
          {" "}
          <div className="max-w-6xl mx-auto bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-xl border border-gray-100 p-5 md:px-10 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* LEFT SECTION */}
            <div className="flex flex-col flex-1">
              {/* DESKTOP (unchanged) */}
              <div className="hidden md:flex items-center gap-10">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-2">
                    <Building2 className="w-6 h-6 text-slate-600" />
                  </div>

                  <div>
                    <h1 className="text-3xl font-bold text-[#0A2540]">
                      {projectDetails.project_name}
                    </h1>
                    <p className="text-lg text-gray-400">
                      {projectDetails.project_location}
                    </p>
                  </div>
                </div>

                <div className="h-14 w-px bg-gray-200" />

                <div>
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1">
                    Starting From
                  </p>
                  <p className="text-3xl font-black text-[#0A2540]">
                    {projectDetails.price}
                  </p>
                </div>
              </div>

              {/* MOBILE (NEW STRUCTURE) */}
              <div className="md:hidden flex flex-col gap-4">
                {/* Title + Icon */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 shrink-0">
                    <Building2 className="w-5 h-5 text-slate-600" />
                  </div>

                  <div>
                    <h1 className="text-lg font-bold text-[#0A2540] leading-tight">
                      {projectDetails.project_name}
                    </h1>
                    <p className="text-sm text-gray-500">
                      📍 {projectDetails.project_location}
                    </p>
                  </div>
                </div>

                {/* Info Row (like image structure) */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  {/* Left Info */}
                  <div>
                    <p className="text-base font-semibold text-[#0A2540]">
                      {projectDetails.bhk || "3 BHK"}
                    </p>
                    <p className="text-xs text-gray-400">Apartments</p>
                  </div>

                  {/* Right Price */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-[#0A2540]">
                      {projectDetails.price}
                    </p>
                    <p className="text-[10px] text-gray-400 uppercase">
                      Starting Price
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP BUTTONS (unchanged) */}
            <div className="hidden md:flex items-center gap-4">
              {" "}
              <button
                onClick={() => !isProjectRegistered && setShowPopup(true)}
                className="bg-black text-white h-14 px-8 rounded-full font-semibold text-base whitespace-nowrap"
              >
                Get Details →
              </button>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#00D952] text-white h-14 px-8 rounded-full font-semibold text-base flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <FaWhatsapp size={18} />
                Chat
              </a>
            </div>

            {/* MOBILE CTA (same feel, not copied text) */}
            <div className="md:hidden w-full">
              <button
                onClick={() => !isProjectRegistered && setShowPopup(true)}
                className="w-full bg-black text-white h-12 rounded-xl font-semibold"
              >
                View Pricing Details
              </button>
            </div>
          </div>
        </div>
        {/* CONTENT */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          {/* CONTENT */}
          <section
            id="overview"
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch"
          >
            {/* LEFT IMAGE */}
            <div className="w-full h-full flex">
              <img
                src={project.images?.[0]?.image_url}
                onClick={() => {
                  setActiveImage(0);
                  setViewerOpen(true);
                }}
                className="w-full h-[250px] sm:h-[350px] md:h-[420px] lg:h-full object-cover rounded-lg cursor-zoom-in"
              />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex flex-col justify-center">
              {/* HEADING */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-wide text-gray-900">
                Overview
              </h2>

              <div className="flex items-center gap-2 my-4">
                <div className="w-10 h-[1px] bg-gray-300"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <div className="w-10 h-[1px] bg-gray-300"></div>
              </div>

              {/* INTRO */}
              <p className="text-lg text-gray-800 leading-relaxed">
                Welcome to{" "}
                <span className="font-semibold text-gray-900">
                  {projectDetails.project_name}
                </span>{" "}
                — {projectDetails.project_location}
              </p>

              {/* DESCRIPTION */}
              <div className="text-gray-700 mt-6 text-[15px] leading-relaxed space-y-4">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {projectDetails.property_description}
                </ReactMarkdown>
              </div>

              {/* INFO GRID */}
              <div className="grid grid-cols-2 gap-y-6 gap-x-10 mt-10 pt-6 border-t text-sm">
                <div className="border-r pr-6">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Unit Types
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {projectDetails.typology || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Starting from
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {projectDetails.price || "-"}
                  </p>
                </div>

                <div className="border-r pr-6">
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Super Built-up Area
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {projectDetails.sba || "-"} Sq.Ft.
                  </p>
                </div>

                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-wide">
                    Location
                  </p>
                  <p className="font-medium text-gray-900 mt-1">
                    {projectDetails.project_location || "-"}
                  </p>
                </div>
              </div>
            </div>
          </section>
          {/* ENTRY POPUP */}
          {!isProjectRegistered && showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative bg-white w-[95%] max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-black"
                >
                  <X size={24} />
                </button>

                <h3 className="text-xl font-bold mb-4 text-center">
                  Enquire now
                </h3>

                <EnquiryForm
                  projectId={projectDetails.id}
                  onSuccess={() => {
                    setShowPopup(false);
                    handleEnquirySuccess();
                  }}
                />
              </div>
            </div>
          )}
          {/* EXIT POPUP */}
          {!isProjectRegistered && showExitPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative bg-white w-[95%] max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl">
                <button
                  onClick={() => {
                    setShowExitPopup(false);
                    setPopupClosed(true);
                  }}
                  className="absolute top-4 right-4"
                >
                  <X size={24} />
                </button>

                <h3 className="text-xl font-bold mb-4 text-center">
                  Wait! Get Exclusive Property Deals
                </h3>

                <EnquiryForm
                  projectId={projectDetails.id}
                  onSuccess={() => {
                    setShowExitPopup(false);
                    handleEnquirySuccess();
                  }}
                />
              </div>
            </div>
          )}
          {!isProjectRegistered && showBackPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative bg-white w-[95%] max-w-md p-4 sm:p-6 rounded-2xl shadow-2xl">
                {/* Close */}
                <button
                  onClick={() => navigate("/property")}
                  className="absolute top-4 right-4"
                >
                  <X size={24} />
                </button>

                <h3 className="text-xl font-bold mb-2 text-center">
                  Wait! Get Exclusive Property Deals
                </h3>

                <p className="text-sm text-slate-500 text-center mb-4">
                  Submit your details and our team will contact you with the
                  best offers.
                </p>

                <EnquiryForm
                  projectId={projectDetails.id}
                  onSuccess={() => {
                    setShowBackPopup(false);
                    handleEnquirySuccess();
                  }}
                />

                <button
                  onClick={() => navigate("/property")}
                  className="w-full mt-3 text-sm text-slate-500 hover:text-black"
                >
                  No Thanks, Go Back
                </button>
              </div>
            </div>
          )}

          {}
          {/* AMENITIES & FEATURES */}
          {project.features.length > 0 && (
            <section id="amenities" className="mt-24 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
                AMENITIES
              </h2>

              <div className="flex justify-center items-center gap-2 my-3">
                <div className="w-8 h-[1px] bg-gray-400"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-8 h-[1px] bg-gray-400"></div>
              </div>

              <p className="text-gray-600 mt-4">
                Designed for comfort, crafted for lifestyle.
              </p>

              {/* CAROUSEL */}
              {/* CAROUSEL WRAPPER */}
              <div className="relative mt-12 max-w-6xl mx-auto">
                {/* LEFT FADE */}
                <div className="hidden sm:block pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-slate-50 to-transparent z-10" />

                {/* RIGHT FADE */}
                <div className="hidden sm:block pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-slate-50 to-transparent z-10" />
                {/* LEFT BUTTON */}
                <button
                  onClick={() => {
                    if (!scrollRef.current) return;
                    scrollRef.current.scrollBy({
                      left: -340,
                      behavior: "smooth",
                    });
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
    bg-white/90 backdrop-blur shadow-lg p-3 rounded-full hover:scale-110 transition"
                >
                  <ChevronLeft size={20} />
                </button>

                {/* RIGHT BUTTON */}
                <button
                  onClick={() => {
                    if (!scrollRef.current) return;
                    scrollRef.current.scrollBy({
                      left: 340,
                      behavior: "smooth",
                    });
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
    bg-white/90 backdrop-blur shadow-lg p-3 rounded-full hover:scale-110 transition"
                >
                  <ChevronRight size={20} />
                </button>

                {/* SCROLL CONTAINER */}
                <div
                  ref={scrollRef}
                  className="
  flex gap-4 sm:gap-6 px-4 sm:px-6
  overflow-x-auto scroll-smooth
  snap-x snap-mandatory scroll-pl-6
  no-scrollbar
"
                >
                  {amenities.map((item) => (
                    <div
                      key={item.id}
                      className="min-w-[240px] sm:min-w-[280px] md:min-w-[300px]
max-w-[240px] sm:max-w-[280px] md:max-w-[300px] flex-shrink-0 snap-start snap-always"
                    >
                      <div className="relative group overflow-hidden rounded-xl shadow-md">
                        <img
                          src={item.image_url || item.icon_url}
                          className="w-full h-[240px] object-cover 
            group-hover:scale-110 transition duration-500"
                        />

                        <div
                          className="
    absolute inset-0 bg-black/50 
    opacity-100 sm:opacity-0 
    sm:group-hover:opacity-100 
    transition duration-300 
    flex flex-col justify-end p-4 text-white
  "
                        >
                          <h3 className="text-lg font-semibold">
                            {item.label}
                          </h3>
                          <p className="text-sm opacity-80">
                            {item.description || ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* configurations */}
          {project.configurations.length > 0 && (
            <section id="config" className="mt-24 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide text-gray-900">
                CONFIGURATIONS
              </h2>

              <div className="flex justify-center items-center gap-2 my-3">
                <div className="w-10 h-[1px] bg-gray-300"></div>
                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                <div className="w-10 h-[1px] bg-gray-300"></div>
              </div>

              {/* SCROLLABLE CONTAINER */}
              <div
                className="
        mt-10 px-4
        flex gap-6 
        overflow-x-auto 
        snap-x snap-mandatory 
        no-scrollbar 
        pb-8
        sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none
      "
              >
                {project.configurations.map((config, index) => (
                  <div
                    key={index}
                    className={`
            relative group rounded-2xl overflow-hidden transition-all duration-500 flex-shrink-0
            w-[85%] sm:w-auto snap-center
            ${index === 1 ? "sm:scale-105 shadow-2xl" : "shadow-md hover:shadow-xl hover:-translate-y-2"}
            bg-[#f8f7f5]
          `}
                  >
                    <div className="p-6 sm:p-7 flex flex-col justify-between h-full space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 tracking-tight">
                          {config.configuration}
                        </h3>
                        <div className="w-8 h-[1px] bg-gray-300 my-3 mx-auto"></div>
                        <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                          <Ruler size={14} className="text-gray-400" />
                          {config.size_range} Sq.Ft.
                        </p>
                      </div>

                      <div className="mt-4 text-center">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-gray-400 mb-1">
                          Starting Price
                        </p>
                        <p className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-1">
                          <IndianRupee size={18} />
                          {config.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          !isProjectRegistered && setShowPopup(true)
                        }
                        className="mt-4 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-slate-800 transition-all"
                      >
                        {isProjectRegistered
                          ? "View Details 🔓"
                          : "Get Details →"}
                      </button>
                    </div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gray-400 to-transparent opacity-40" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FLOOR PLANS */}
          {/* FLOOR PLANS */}
          {project.floorplans.length > 0 && (
            <section id="plans" className="mt-24 text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
                FLOOR PLANS & LAYOUTS
              </h2>

              <div className="flex justify-center items-center gap-2 my-3">
                <div className="w-8 h-[1px] bg-gray-400"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-8 h-[1px] bg-gray-400"></div>
              </div>

              <p className="text-gray-600 mt-4 px-4 text-sm sm:text-base">
                Smartly designed spaces for modern living.
              </p>

              {/* SCROLLABLE GRID */}
              <div
                ref={floorPlanScrollRef} // Add a new ref at the top of your component!
                className="
        mt-12 px-4 
        flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6
        sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:snap-none
      "
              >
                {project.floorplans.map((plan, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      if (isProjectRegistered) {
                        setActiveFloorPlan(plan.image_url);
                        setFloorPlanViewer(true);
                      } else {
                        setShowPopup(true);
                      }
                    }}
                    className="
            relative group overflow-hidden rounded-xl shadow-lg cursor-pointer flex-shrink-0
            w-[85%] sm:w-auto snap-center bg-white border border-gray-100
          "
                  >
                    {/* IMAGE BOX */}
                    <div className="aspect-[4/3] flex items-center justify-center p-4 bg-white">
                      <img
                        src={plan.image_url}
                        alt={plan.title}
                        className={`max-w-full max-h-full object-contain transition-all duration-700
                ${!isProjectRegistered ? "blur-[1px] grayscale scale-110" : "group-hover:scale-110"}`}
                      />
                    </div>

                    {/* LOCK OVERLAY */}
                    {!isProjectRegistered && (
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition duration-300 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          {/* Lock Icon */}
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Lock size={18} className="text-white" />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowPopup(true);
                            }}
                            className="backdrop-blur-sm bg-white text-black px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all shadow-xl"
                          >
                            Unlock Plan
                          </button>
                        </div>
                      </div>
                    )}

                    {/* LABEL */}
                    <div className="bg-white py-4 border-t border-gray-50">
                      <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                        {plan.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {embedUrl && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4">Property Video</h2>

              <div className="relative w-full pb-[56.25%]">
                <iframe
                  src={embedUrl}
                  title="Property Video"
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}

          {/* CONNECTIVITY */}
          {/* CONNECTIVITY */}
          {Object.keys(connectivity).length > 0 && (
            <section id="connectivity" className="mt-24 px-4 sm:px-6">
              <div className="max-w-6xl mx-auto">
                {/* HEADER */}
                <div className="text-center mb-12">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide text-gray-900 uppercase">
                    Location & Connectivity
                  </h2>
                  <div className="flex justify-center items-center gap-2 my-3">
                    <div className="w-8 h-[1px] bg-gray-400"></div>
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                    <div className="w-8 h-[1px] bg-gray-400"></div>
                  </div>
                </div>

                {/* SCROLLABLE GRID */}
                <div
                  ref={connectivityScrollRef}
                  className="
          flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6
          sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:snap-none
        "
                >
                  {Object.entries(connectivity).map(
                    ([category, items], idx) => (
                      <div
                        key={idx}
                        className="
              min-w-[85%] sm:min-w-0 snap-center
              group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300
            "
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center mb-5 text-slate-400 group-hover:bg-black group-hover:text-white transition-colors">
                          <MapPin size={20} />
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm tracking-widest uppercase mb-4">
                          {category.replace(/_/g, " ")}
                        </h3>

                        <ul className="space-y-3">
                          {items.map((item, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-3 text-gray-600 text-sm leading-snug"
                            >
                              <div className="mt-1.5 w-1 h-1 rounded-full bg-slate-300 shrink-0 group-hover:bg-black" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </section>
          )}
          {/* GALLERY */}
          {galleryImages.length > 0 && (
            <section id="gallery" className="mt-24 text-center">
              {/* HEADER (MATCHING AMENITIES STYLE) */}
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-wide">
                GALLERY
              </h2>

              <div className="flex justify-center items-center gap-2 my-3">
                <div className="w-8 h-[1px] bg-gray-400"></div>
                <div className="w-2 h-2 bg-black rounded-full"></div>
                <div className="w-8 h-[1px] bg-gray-400"></div>
              </div>

              <p className="text-gray-600 mt-4">
                Discover more visuals of this premium project.
              </p>

              {/* GRID */}
              <div
                ref={galleryScrollRef}
                className="
    mt-12 px-4
    flex gap-4
    overflow-x-auto
    snap-x snap-mandatory
    no-scrollbar
    pb-4
  "
              >
                {galleryImages.map((img, index) => (
                  <div
                    key={index}
                    className="
        min-w-[70%] sm:min-w-[45%] md:min-w-[30%]
        flex-shrink-0 snap-center
        relative overflow-hidden rounded-xl cursor-pointer group
      "
                    onClick={() => {
                      setActiveImage(index + 3);
                      setViewerOpen(true);
                    }}
                  >
                    {/* IMAGE */}
                    <img
                      src={img.image_url}
                      className="
          w-full h-48 sm:h-52 md:h-56 object-cover
          group-hover:scale-110 transition duration-500
        "
                    />

                    {/* OVERLAY */}
                    <div
                      className="
          absolute inset-0 bg-black/40 opacity-0
          group-hover:opacity-100 transition
          flex items-center justify-center text-white text-sm font-medium
        "
                    >
                      View Image
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        {/* FULLSCREEN IMAGE VIEWER */}
        {viewerOpen && (
          <div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setViewerOpen(false)} // ✅ ADD THIS
          >
            {" "}
            {/* Close */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ✅ ADD
                setViewerOpen(false);
              }}
              className="absolute top-6 right-6 text-white hover:scale-110"
            >
              <X size={32} />
            </button>
            {/* Image Counter */}
            <div className="absolute top-6 left-6 text-white text-sm opacity-80">
              {activeImage + 1} / {project.images?.length || 0}
            </div>
            {/* Left */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ✅ ADD
                prevImage();
              }}
              className="absolute left-6 text-white bg-black/40 p-3 rounded-full hover:bg-black"
            >
              <ChevronLeft size={32} />
            </button>
            {/* Image */}
            <motion.img
              key={activeImage}
              src={project.images?.[activeImage]?.image_url}
              onClick={(e) => e.stopPropagation()} // ✅ ADD THIS
              className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            />
            {/* Right */}
            <button
              onClick={(e) => {
                e.stopPropagation(); // ✅ ADD
                nextImage();
              }}
              className="absolute right-6 text-white bg-black/40 p-3 rounded-full hover:bg-black"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}
        {/* FLOOR PLAN VIEWER */}
        {floorPlanViewer && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              onClick={() => setFloorPlanViewer(false)}
              className="absolute top-6 right-6 text-white"
            >
              <X size={32} />
            </button>

            <img
              src={activeFloorPlan}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              alt="Floor Plan"
            />
          </div>
        )}
      </div>

      <motion.div
        initial={{ x: -60 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 md:left-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 flex md:flex-col gap-3 z-40"
      >
        {/* Phone */}
        <a
          href="tel:+91 9900468686"
          className="group flex items-center bg-gray-900 hover:bg-indigo-600 text-white w-12 hover:w-40 overflow-hidden transition-all duration-300 rounded-r-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 shrink-0">
            <FaPhoneAlt size={18} />
          </div>

          <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 font-medium">
            Call Us
          </span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center bg-gray-900 hover:bg-green-500 text-white w-12 hover:w-40 overflow-hidden transition-all duration-300 rounded-r-lg"
        >
          <div className="flex items-center justify-center w-12 h-12 shrink-0">
            <FaWhatsapp size={20} />
          </div>

          <span className="ml-2 opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-300 font-medium">
            WhatsApp
          </span>
        </a>
      </motion.div>

      {/* 💬 WhatsApp Chat Bubble */}
      {!isProjectRegistered && showWABubble && !hideBubble && (
        <div className="fixed bottom-24 right-6 z-50 max-w-xs animate-fadeIn">
          <div className="bg-white shadow-xl rounded-2xl p-4 relative border">
            {/* Close */}
            <button
              onClick={() => setHideBubble(true)}
              className="absolute top-2 right-2 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            {/* Message */}
            <p className="text-sm text-gray-800 leading-relaxed">
              Hi 👋
              <br />
              Need help with{" "}
              <span className="font-semibold">
                {projectDetails.project_name}
              </span>
              ?
            </p>

            {/* CTA */}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-green-600 font-medium text-sm hover:underline"
            >
              Chat on WhatsApp →
            </a>
          </div>
        </div>
      )}
      {/* ✅ FLOATING WHATSAPP (BOTTOM RIGHT) */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex flex-col items-center group"
      >
        {/* Pulse ring */}
        <span className="absolute inline-flex h-14 w-14 rounded-full bg-green-400 opacity-75 animate-ping"></span>

        {/* Button */}
        <div className="relative bg-green-500 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all duration-300 animate-[floaty_2.5s_ease-in-out_infinite]">
          <FaWhatsapp size={26} />
        </div>

        {/* Label */}
        <span className="mt-2 text-xs bg-white px-3 py-1 rounded-md shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition">
          Talk to us?
        </span>
      </a>
    </>
  );
}

export default PropertyDetailsPage;
