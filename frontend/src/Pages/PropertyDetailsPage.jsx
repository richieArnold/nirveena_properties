import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import { Clock, LayoutGrid, Ruler } from "lucide-react";
import { useUserRegistration } from "../context/UserRegistrationContext";

import EnquiryForm from "../components/Properties/EnquiryForm";

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

  const { isRegistered } = useUserRegistration();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000); // 5 seconds

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleExitIntent = (e) => {
      if (popupClosed) return;

      if (e.clientY <= 10) {
        setShowExitPopup(true);
      }
    };

    document.addEventListener("mouseleave", handleExitIntent);

    return () => {
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, [popupClosed]);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axiosInstance.get(
          `/api/projects/getSingleProject/${slug}`,
        );
        console.log(res);
        setProject(res.data.data);
        setProjectDetais(res.data.data.project);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

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
    setActiveImage((prev) =>
      prev === project.images.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setActiveImage((prev) =>
      prev === 0 ? project.images.length - 1 : prev - 1,
    );
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
    alert("Thank you! Our team will contact you soon.");
  };
  const whatsappNumber = "919731658272"; // change to admin number

  const message = encodeURIComponent(
    "Hello, I am interested in your properties.",
  );

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${message}`;
  return (
    <>
      {project && (
        <Helmet>
          <title>{`${projectDetails.project_name} | Nirveena`}</title>

          <meta
            name="description"
            content={project.property_description
              ?.replace(/[#*`]/g, "")
              .substring(0, 160)}
          />

          <meta property="og:title" content={projectDetails.project_name} />

          <meta
            property="og:description"
            content={project.property_description
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
      <div className="min-h-screen bg-slate-50 pt-20 pb-20">
        {/* NAVBAR */}
        <button
          onClick={() => {
            if (isRegistered) {
              navigate("/property"); // or navigate(-1)
            } else {
              setShowBackPopup(true);
            }
          }}
          className="flex items-center gap-2 px-3 py-2 hover:bg-slate-100 rounded-lg transition"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
          <span className="text-sm font-medium text-slate-700">
            Back to Properties
          </span>
        </button>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* HEADER */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-extrabold text-slate-900"
              style={{ textTransform: "capitalize" }}
            >
              {projectDetails.project_name}
            </h1>

            <div className="flex items-center text-slate-500 mt-2">
              <MapPin className="w-4 h-4 mr-1 text-red-500" />
              <p className="text-lg" style={{ textTransform: "capitalize" }}>
                {projectDetails.project_location}
              </p>
            </div>

            <p className="text-3xl font-black text-blue-600 mt-3">
              {projectDetails.price}
            </p>
          </div>

          {/* IMAGE GALLERY */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
            {/* LARGE IMAGE */}
            <div
              onClick={() => {
                setActiveImage(0);
                setViewerOpen(true);
              }}
              className="lg:col-span-2 relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
            >
              <img
                src={
                  project.images?.[0]?.image_url ||
                  project.image_url ||
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
                }
                className="w-full h-full object-cover"
                alt={projectDetails.project_name}
              />

              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-md text-sm">
                1 / {project.images?.length}
              </div>
            </div>

            {/* RIGHT SIDE IMAGES */}
            <div className="flex flex-col gap-4">
              {/* IMAGE 2 */}
              {project.images?.[1] && (
                <div
                  onClick={() => {
                    setActiveImage(1);
                    setViewerOpen(true);
                  }}
                  className="h-[145px] md:h-[240px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={project.images[1].image_url}
                    className="w-full h-full object-cover hover:scale-105 transition"
                    alt={`${projectDetails.project_name} view 2`}
                  />
                </div>
              )}

              {/* IMAGE 3 */}
              {project.images?.[2] && (
                <div
                  onClick={() => {
                    setActiveImage(2);
                    setViewerOpen(true);
                  }}
                  className="relative h-[145px] md:h-[240px] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={project.images[2].image_url}
                    className="w-full h-full object-cover hover:scale-105 transition"
                    alt={`${project.project_name} view 3`}
                  />

                  {/* MORE IMAGES OVERLAY */}
                  {project.images.length > 3 && (
                    <div
                      onClick={() => setViewerOpen(true)}
                      className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-lg font-semibold"
                    >
                      +{project.images.length - 3} more
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT SIDE */}
            <div className="lg:col-span-2 space-y-10">
              {/* PROJECT STATS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-y border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Square className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">
                      Total Acres
                    </p>
                    <p className="font-bold text-slate-800">
                      {projectDetails.total_acres}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Building2 className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">
                      Units
                    </p>
                    <p className="font-bold text-slate-800">
                      {projectDetails.no_of_units}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Home className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">
                      Club House
                    </p>
                    <p className="font-bold text-slate-800">
                      {projectDetails.club_house_size}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calendar className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">
                      Completion
                    </p>
                    <p className="font-bold text-slate-800">
                      {projectDetails.rera_completion}
                    </p>
                  </div>
                </div>
              </div>

              {/* ABOUT PROPERTY */}
              <section>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-blue-600" />
                  About Property
                </h3>

                <div className="prose prose-lg max-w-none text-slate-600">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.property_description}
                  </ReactMarkdown>
                </div>
              </section>

              {/* PROJECT DETAILS */}
              <section>
                <h3 className="text-2xl font-bold mb-6">Project Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <Home className="text-blue-600 w-5 h-5" />
                    <span>
                      <span className="font-medium text-slate-700">Type:</span>{" "}
                      {projectDetails.project_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <Clock className="text-blue-600 w-5 h-5" />
                    <span>
                      <span className="font-medium text-slate-700">
                        Status:
                      </span>{" "}
                      {projectDetails.project_status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <Building2 className="text-blue-600 w-5 h-5" />
                    <span>
                      <span className="font-medium text-slate-700">
                        Structure:
                      </span>{" "}
                      {projectDetails.structure}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <LayoutGrid className="text-blue-600 w-5 h-5" />
                    <span>
                      <span className="font-medium text-slate-700">
                        Typology:
                      </span>{" "}
                      {projectDetails.typology}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <Ruler className="text-blue-600 w-5 h-5" />
                    <span>
                      <span className="font-medium text-slate-700">
                        Built Area:
                      </span>{" "}
                      {projectDetails.sba} Sqft
                    </span>
                  </div>
                </div>
              </section>
            </div>

            {/* RIGHT SIDE FORM */}
            {!isRegistered && (
              <div className="hidden lg:block">
                <div className="sticky top-28 bg-white border rounded-2xl shadow-xl p-6">
                  <h3 className="text-xl font-bold mb-4 text-center">
                    Schedule A Site Visit
                  </h3>

                  <EnquiryForm
                    projectId={project.project_id}
                    onSuccess={handleEnquirySuccess}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ENTRY POPUP */}
          {!isRegistered && showPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative bg-white w-[95%] max-w-md p-6 rounded-2xl shadow-2xl">
                <button
                  onClick={() => setShowPopup(false)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-black"
                >
                  <X size={24} />
                </button>

                <h3 className="text-xl font-bold mb-4 text-center">
                  Schedule A Site Visit
                </h3>

                <EnquiryForm
                  projectId={project.project_id}
                  onSuccess={() => {
                    setShowPopup(false);
                    handleEnquirySuccess();
                  }}
                />
              </div>
            </div>
          )}
          {/* EXIT POPUP */}
          {!isRegistered && showExitPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative bg-white w-[95%] max-w-md p-6 rounded-2xl shadow-2xl">
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
                  projectId={project.project_id}
                  onSuccess={() => {
                    setShowExitPopup(false);
                    handleEnquirySuccess();
                  }}
                />
              </div>
            </div>
          )}
          {!isRegistered && showBackPopup && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
              <div className="relative bg-white w-[95%] max-w-md p-6 rounded-2xl shadow-2xl">
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
                  projectId={project.id}
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

          {/* features */}
          {/* AMENITIES & FEATURES */}
          {project.features?.length > 0 && (
            <section className="mt-10">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <LayoutGrid className="text-blue-600" />
                Amenities & Features
              </h3>

              <div className="space-y-8">
                {project.features.map((feature) => (
                  <div key={feature.id}>
                    {/* Feature Title */}
                    <h4 className="text-lg font-semibold text-slate-800 mb-4">
                      {feature.feature_name}
                    </h4>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {feature.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm hover:shadow-md transition"
                        >
                          {/* Icon */}
                          {item.icon_url && (
                            <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                              <img
                                src={item.icon_url}
                                alt={item.label}
                                className="w-5 h-5 object-contain"
                              />
                            </div>
                          )}

                          {/* Label */}
                          <span className="text-sm font-medium text-slate-700">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          {/* configurations */}
          {/* CONFIGURATIONS */}
          {project.configurations?.length > 0 && (
            <section className="mt-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Home className="text-blue-600" />
                Configurations
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {project.configurations.map((config, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition p-6"
                  >
                    {/* Configuration Title */}
                    <h4 className="text-xl font-semibold text-slate-800 mb-4">
                      {config.configuration}
                    </h4>

                    {/* Size */}
                    <div className="flex items-center gap-2 text-slate-600 mb-2">
                      <Square className="w-4 h-4 text-blue-600" />
                      <span>{config.size_range} Sqft</span>
                    </div>

                    {/* Price */}
                    {isRegistered ? (
                      <div className="flex items-center gap-2 text-slate-700 font-semibold">
                        <IndianRupee className="w-4 h-4 text-green-600" />
                        {config.price}
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowPopup(true)}
                        className="mt-2 w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        View Prices
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* floorplans */}
          {/* FLOOR PLANS */}
          {project.floorplans?.length > 0 && (
            <section className="mt-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <LayoutGrid className="text-blue-600" />
                Floor Plans
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.floorplans.map((plan, index) => (
                  <div
                    key={index}
                    className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                  >
                    {/* IMAGE */}
                    <div
                      className="cursor-pointer relative"
                      onClick={() => {
                        if (!isRegistered) {
                          setShowPopup(true);
                        } else {
                          setActiveFloorPlan(plan.image_url);
                          setFloorPlanViewer(true);
                        }
                      }}
                    >
                      <img
                        src={plan.image_url}
                        alt={plan.configuration}
                        className={`w-full h-[220px] object-contain bg-slate-50 transition ${
                          !isRegistered ? "blur-[1px] brightness-75" : ""
                        }`}
                      />

                      {!isRegistered && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="bg-white/90 text-slate-800 text-sm font-semibold px-4 py-2 rounded-lg shadow">
                            View Floor Plan
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-slate-800">
                        {plan.configuration}
                      </h4>

                      {plan.size && (
                        <p className="text-slate-600 text-sm mt-1">
                          {plan.size} Sqft
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
        {/* FULLSCREEN IMAGE VIEWER */}
        {viewerOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              onClick={() => setViewerOpen(false)}
              className="absolute top-6 right-6 text-white"
            >
              <X size={32} />
            </button>

            <button onClick={prevImage} className="absolute left-6 text-white">
              <ChevronLeft size={40} />
            </button>

            <img
              src={project.images?.[activeImage]?.image_url}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              alt={`${project.project_name} view ${activeImage + 1}`}
            />

            <button onClick={nextImage} className="absolute right-6 text-white">
              <ChevronRight size={40} />
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
        className="flex fixed left-0 top-1/2 -translate-y-1/2 z-40 flex-col"
      >
        {/* Phone */}
        <a
          href="tel:+919731658272"
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
    </>
  );
}

export default PropertyDetailsPage;
