import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";
import { Helmet } from "react-helmet-async";

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
} from "lucide-react";

import EnquiryForm from "../components/Properties/EnquiryForm";

function PropertyDetailsPage() {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axiosInstance.get(
          `/api/projects/getSingleProject/${slug}`,
        );
        console.log(res);
        setProject(res.data.data);
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
        description: project.property_description,
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

  return (
    <>
      {project && (
        <Helmet>
          <title>{`${project.project_name} | Nirveena`}</title>

          <meta name="description" content={project.property_description} />

          <meta property="og:title" content={project.project_name} />

          <meta
            property="og:description"
            content={project.property_description}
          />

          <meta property="og:image" content={project.image_url} />

          <meta
            property="og:url"
            content={`https://www.nirveena.com/property/${project.slug}`}
          />

          {schemaData && (
            <script type="application/ld+json">
              {JSON.stringify(schemaData)}
            </script>
          )}
        </Helmet>
      )}
      <div className="min-h-screen bg-slate-50 pb-20">
        {/* NAVBAR */}
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <ChevronLeft className="w-6 h-6 text-slate-700" />
          </button>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {/* HEADER */}
          <div className="mb-8">
            <h1
              className="text-3xl md:text-4xl font-extrabold text-slate-900"
              style={{ textTransform: "capitalize" }}
            >
              {project.project_name}
            </h1>

            <div className="flex items-center text-slate-500 mt-2">
              <MapPin className="w-4 h-4 mr-1 text-red-500" />
              <p className="text-lg">{project.project_location}</p>
            </div>

            <p className="text-3xl font-black text-blue-600 mt-3">
              {project.price}
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
                      {project.total_acres}
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
                      {project.no_of_units}
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
                      {project.club_house_size}
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
                      {project.rera_completion}
                    </p>
                  </div>
                </div>
              </div>

              {/* DESCRIPTION */}
              <section>
                <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-blue-600" />
                  About Property
                </h3>

                <p className="text-slate-600 leading-relaxed">
                  {project.property_description}
                </p>
              </section>

              {/* PROJECT DETAILS */}
              <section>
                <h3 className="text-2xl font-bold mb-6">Project Details</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    Type: {project.project_type}
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    Status: {project.project_status}
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    Structure: {project.structure}
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    Typology: {project.typology}
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                    <CheckCircle2 className="text-green-500 w-5 h-5" />
                    Built Area: {project.sba}
                  </div>
                </div>
              </section>
            </div>

            {/* CONTACT FORM */}
{/* ENQUIRY POPUP */}
{showPopup && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">

    <div className="relative bg-white w-[95%] max-w-md p-6 rounded-2xl shadow-2xl">

      {/* CLOSE BUTTON */}
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
        projectId={project.id}
        onSuccess={() => {
          setShowPopup(false);
          handleEnquirySuccess();
        }}
      />

    </div>
  </div>
)}
          </div>
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
            />

            <button onClick={nextImage} className="absolute right-6 text-white">
              <ChevronRight size={40} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default PropertyDetailsPage;
