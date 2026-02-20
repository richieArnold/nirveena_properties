import React from "react";

function PropertyModal({ selectedProject, setIsModalOpen }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-6">
      <div className="bg-white rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative">
        {/* Close */}
        <button
          onClick={() => setIsModalOpen(false)}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-xl"
        >
          ✕
        </button>

        {/* Image */}
        <div className="h-80 overflow-hidden">
          <img
            src={
              selectedProject.image_url ||
              "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop"
            }
            alt={selectedProject.project_name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-8 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {selectedProject.project_name}
          </h2>

          <p className="text-gray-500">
            {selectedProject.project_location}
          </p>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400">Price</p>
              <p className="font-semibold text-blue-600">
                {selectedProject.price}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Type</p>
              <p className="font-semibold">
                {selectedProject.project_type}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Status</p>
              <p className="font-semibold">
                {selectedProject.project_status}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-400">Slug</p>
              <p className="font-semibold">
                {selectedProject.slug}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertyModal;