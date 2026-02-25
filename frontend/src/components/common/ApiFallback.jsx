import { AlertTriangle, RefreshCcw } from "lucide-react";

const ApiFallback = ({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
  loading = false,
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 
      ${fullScreen ? "min-h-[60vh]" : "min-h-[300px]"}`}
    >
      <div className="bg-red-50 p-6 rounded-2xl shadow-sm max-w-md w-full">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />

        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h2>

        <p className="text-gray-500 mb-6">{message}</p>

        {onRetry && (
          <button
            onClick={onRetry}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 
              bg-red-600 hover:bg-red-700 
              text-white rounded-lg transition disabled:opacity-50"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Retrying..." : "Retry"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ApiFallback;