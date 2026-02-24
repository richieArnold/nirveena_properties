import React, { useState, useEffect } from "react";
import EnquiryPopup from "./EnquiryPopup";

function PropertyModal({ selectedProject, setIsModalOpen }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!selectedProject) return null;

  const images = selectedProject.images || [];

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const [showEnquiryPopup, setShowEnquiryPopup] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const getStatus = (status) => {
    if (status === "UC") return "Under Construction";
    if (status === "RTM") return "Ready To Move";
    return status;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="min-h-screen flex justify-center items-center px-4 py-8">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-xl">
          {/* Close */}
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow text-sm"
          >
            ✕
          </button>

          {/* Image */}
          <div className="relative h-[250px] w-full overflow-hidden rounded-t-2xl">
            {images.length > 0 && (
              <img
                src={images[currentIndex]?.image_url}
                alt="property"
                className="w-full h-full object-cover transition-all duration-700"
              />
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 w-8 h-8 rounded-full flex items-center justify-center shadow text-sm"
                >
                  ‹
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 w-8 h-8 rounded-full flex items-center justify-center shadow text-sm"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedProject.project_name}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                📍 {selectedProject.project_location}
              </p>

              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-gray-100 text-xs rounded-full">
                  {selectedProject.project_type}
                </span>

                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                  {getStatus(selectedProject.project_status)}
                </span>
              </div>
            </div>

            {/* Price + Details Side by Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-5">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                  Starting From
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹ {selectedProject.price}
                </p>
              </div>

              {/* Quick Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <Detail label="Acres" value={selectedProject.total_acres} />
                <Detail label="Units" value={selectedProject.no_of_units} />
                <Detail label="Structure" value={selectedProject.structure} />
                <Detail label="SBA" value={selectedProject.sba} />
              </div>
            </div>

            {/* CTA Section */}

            <div className="pt-4 border-t">
              {!submitted && (
                <button
                  onClick={() => setShowEnquiryPopup(true)}
                  className="w-full h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold"
                >
                  Enquire
                </button>
              )}

              {submitted && (
                <div className="text-center mt-4">
                  <p className="text-green-600 font-semibold mb-3">
                    Thank you! Download your brochure below.
                  </p>

                  <a
                    href="/brochure/sample.pdf"
                    download
                    className="inline-block px-6 py-2 rounded-full bg-purple-600 text-white text-sm"
                  >
                    Download Brochure
                  </a>
                </div>
              )}
            </div>

            {showEnquiryPopup && (
              <EnquiryPopup
                projectId={selectedProject.id}
                onClose={() => setShowEnquiryPopup(false)}
                onSuccess={() => {
                  setSubmitted(true);
                  setShowEnquiryPopup(false);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className="font-semibold text-gray-800">{value}</p>
  </div>
);

export default PropertyModal;
