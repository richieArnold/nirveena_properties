import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";

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
  ArrowLeft,
} from "lucide-react";

import EnquiryForm from "../components/Properties/EnquiryForm";

function PropertyDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

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
        console.log(res.data.data);
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-blue-600 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
            <X className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Project Not Found</h2>
          <p className="text-slate-600 mb-8">The property you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate("/property")}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const handleEnquirySuccess = () => {
    alert("Thank you! Our team will contact you soon.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Back Button - Positioned below navbar */}
    
      {/* Hero Section with Main Image - Below back button */}
      <div className="relative h-[60vh] min-h-[550px] overflow-hidden">
  {/* Back Button - Positioned on image */}
  <div className="absolute top-30 left-6 z-20">
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-md rounded-full text-gray-700 hover:bg-white transition-all border border-gray-200"
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm font-medium">Back</span>
    </button>
  </div>

  <div className="absolute inset-0">
    <img
      src={
        project.images?.[activeImage]?.image_url ||
        project.image_url ||
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
      }
      alt={project.project_name}
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
  </div>

  {/* Property Title Overlay */}
  <div className="absolute bottom-0 left-0 right-0 z-10 pb-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 bg-blue-600/90 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-blue-400/30">
            {project.project_status || 'Premium Property'}
          </span>
          <span className="px-3 py-1 bg-purple-600/90 backdrop-blur-sm text-white rounded-full text-xs font-medium border border-purple-400/30">
            {project.project_type || 'Luxury'}
          </span>
        </div>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 leading-tight">
          {project.project_name}
        </h1>
        <div className="flex items-center text-white/80">
          <MapPin className="w-4 h-4 mr-2 text-blue-400" />
          <p className="text-base">{project.project_location}</p>
        </div>
      </div>
    </div>
  </div>
</div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Main Content */}
          <div className="space-y-6">
            {/* Price */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <p className="text-sm text-gray-500 mb-1">Starting Price</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {project.price}
              </p>
            </div>

            {/* Description */}
            {project.property_description && (
              <div className="bg-white rounded-xl p-6 shadow-md">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  About This Property
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {project.property_description}
                </p>
              </div>
            )}

            {/* Project Details */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="text-lg font-semibold mb-4">Project Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Project Type', value: project.project_type },
                  { label: 'Status', value: project.project_status },
                  { label: 'Structure', value: project.structure },
                  { label: 'Typology', value: project.typology },
                  { label: 'Built Area', value: project.sba },
                  { label: 'RERA Completion', value: project.rera_completion },
                ].map((detail, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">{detail.label}</p>
                    <p className="font-medium text-gray-900">{detail.value || 'N/A'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats Cards & Enquiry Form */}
          <div className="space-y-4">
            {/* Thumbnail Strip - Right side */}
            {project.images && project.images.length > 0 && (
              <div className="bg-white rounded-xl shadow-md p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Property Images</h4>
                <div className="grid grid-cols-4 gap-2">
                  {project.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`relative rounded-md overflow-hidden transition-all duration-300 aspect-square
                        ${activeImage === i ? 'ring-2 ring-blue-600' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <img
                        src={img.image_url}
                        alt={`Thumbnail ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stats Cards - Compact */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-50 rounded-lg p-3">
                  <Square className="w-4 h-4 text-blue-600 mb-1" />
                  <p className="text-xs text-gray-500">Total Acres</p>
                  <p className="text-sm font-semibold text-gray-900">{project.total_acres || 'N/A'}</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <Building2 className="w-4 h-4 text-purple-600 mb-1" />
                  <p className="text-xs text-gray-500">Units</p>
                  <p className="text-sm font-semibold text-gray-900">{project.no_of_units || 'N/A'}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <Home className="w-4 h-4 text-green-600 mb-1" />
                  <p className="text-xs text-gray-500">Club House</p>
                  <p className="text-sm font-semibold text-gray-900">{project.club_house_size || 'N/A'}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-3">
                  <Calendar className="w-4 h-4 text-orange-600 mb-1" />
                  <p className="text-xs text-gray-500">Completion</p>
                  <p className="text-sm font-semibold text-gray-900">{project.rera_completion || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Enquiry Form - White with borderless fields */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4">
                <h4 className="text-base font-semibold text-white mb-1">Interested in this property?</h4>
                <p className="text-xs text-white/80">Get in touch for exclusive offers and site visits</p>
              </div>
              <div className="p-5">
                <EnquiryForm
                  projectId={project.id}
                  onSuccess={handleEnquirySuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Image Viewer */}
      {viewerOpen && (
        <div className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center">
          <button
            onClick={() => setViewerOpen(false)}
            className="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all z-10"
          >
            <X size={28} />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
          >
            <ChevronLeft size={32} />
          </button>

          <img
            src={project.images?.[activeImage]?.image_url}
            alt="Property"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-2xl"
          />

          <button
            onClick={nextImage}
            className="absolute right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all"
          >
            <ChevronRight size={32} />
          </button>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full text-sm border border-white/20">
            {activeImage + 1} / {project.images?.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default PropertyDetailsPage;