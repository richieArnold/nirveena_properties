import EnquiryForm from "./EnquiryForm";

function EnquiryPopup({ projectId, onClose, onSuccess }) {
  return (
    <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h3 className="text-xl font-bold mb-4">
          Enquire Now
        </h3>

        <EnquiryForm
          projectId={projectId}
          onSuccess={onSuccess}
        />

      </div>
    </div>
  );
}

export default EnquiryPopup;