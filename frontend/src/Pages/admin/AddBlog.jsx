import React, { useState } from "react";
import BlogEditor from "../../components/admin/BlogEditor";
import axiosInstance from "../../utils/Instance";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Upload,
  X,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let file of files) {
      formData.append("images", file);
    }

    try {
      setUploading(true);

      const res = await axiosInstance.post("/api/blogs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages((prev) => [...prev, ...res.data.images]);
    } catch (error) {
      console.error("Upload failed", error);
      setError(true);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError(false);

      const payload = {
        title,
        author,
        body,
        images,
      };

      await axiosInstance.post("/api/blogs", payload);

      setTitle("");
      setAuthor("");
      setBody("");
      setImages([]);

      setSuccess(true);
    } catch (error) {
      console.error("Blog creation failed:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {/* Popup Modal */}
      {(success || error) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-xl shadow-lg p-8 w-[350px] text-center">
            {success && (
              <>
                <CheckCircle
                  className="mx-auto text-green-500 mb-3"
                  size={40}
                />
                <h2 className="text-lg font-semibold mb-2">Blog Published!</h2>
                <p className="text-gray-500 mb-4">
                  Your blog has been successfully created.
                </p>
              </>
            )}

            {error && (
              <>
                <AlertCircle className="mx-auto text-red-500 mb-3" size={40} />
                <h2 className="text-lg font-semibold mb-2">
                  Failed to Publish
                </h2>
                <p className="text-gray-500 mb-4">
                  Something went wrong. Please try again.
                </p>
              </>
            )}

            <button
              onClick={() => {
                setSuccess(false);
                setError(false);
              }}
              className="bg-blue-600 text-white px-5 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto p-8">
        {/* Back Button */}
        <button
          onClick={() => (window.location.href = "/admin/dashboard")}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-2xl shadow-lg border p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Create New Blog
            </h1>
            <p className="text-gray-500 mt-1">
              Write and publish a new blog post.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Blog Title
                </label>

                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter blog title"
                  required
                />

                <p className="text-xs text-gray-400 mt-1">
                  {title.length} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">
                  Author
                </label>

                <input
                  type="text"
                  className="w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Author name"
                  required
                />
              </div>
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Blog Images
              </label>

              <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-10 cursor-pointer hover:border-blue-500 transition relative">
                {uploading ? (
                  <Loader2 className="animate-spin text-blue-500" size={28} />
                ) : (
                  <Upload className="text-gray-400 mb-2" size={28} />
                )}

                <p className="text-sm text-gray-600">Click to upload images</p>

                <p className="text-xs text-gray-400 mt-1">
                  PNG, JPG, WEBP supported
                </p>
                <br />
                <span>Upload images upto 1 mb</span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img}
                        alt="preview"
                        className="w-full h-28 object-cover rounded-lg border"
                      />

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* EDITOR */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-gray-700">
                Blog Content
              </label>

              <div className="border rounded-lg overflow-hidden min-h-[300px]">
                <BlogEditor content={body} setContent={setBody} />
              </div>
            </div>

            {/* BUTTON */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading || !body || !title}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition disabled:opacity-50"
              >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {loading ? "Publishing..." : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddBlog;
