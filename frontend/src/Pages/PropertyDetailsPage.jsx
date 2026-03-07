import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";

import {
  MapPin,
  Square,
  ChevronLeft,
  ChevronRight,
  X,
  Share2,
  Heart,
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

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await axiosInstance.get(
          `/api/projects/getSingleProject/${slug}`,
        );
console.log(res)
        setProject(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [slug]);

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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button className="p-2 hover:bg-slate-100 rounded-full">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Share2 className="w-5 h-5 text-slate-700" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full">
            <Heart className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">
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
          <div
            onClick={() => setViewerOpen(true)}
            className="lg:col-span-2 relative h-[300px] md:h-[500px] rounded-2xl overflow-hidden shadow-lg cursor-pointer"
          >
            <img
              src={
                project.images?.[activeImage]?.image_url ||
                project.image_url ||
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
              }
              alt="property"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop";
              }}
            />

            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-sm">
              {activeImage + 1} / {project.images?.length}
            </div>
          </div>

          {/* THUMBNAILS */}
          <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
            {project.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 
      ${
        activeImage === i
          ? "border-blue-600 scale-95 shadow-md"
          : "border-transparent opacity-80 hover:opacity-100"
      }`}
              >
                <div className="w-full aspect-[4/3]">
                  <img
                    src={img.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
            ))}
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
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white p-6 rounded-2xl shadow-xl border">
              <h4 className="text-xl font-bold mb-6">Schedule a Viewing</h4>

              <EnquiryForm
                projectId={project.id}
                onSuccess={handleEnquirySuccess}
              />
            </div>
          </div>
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
  );
}

export default PropertyDetailsPage;
