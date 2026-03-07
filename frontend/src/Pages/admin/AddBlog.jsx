import React, { useState } from "react";
import BlogEditor from "../../components/admin/BlogEditor";
import axiosInstance from "../../utils/Instance";
import AdminLayout from "../../components/admin/AdminLayout";

const AddBlog = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const formData = new FormData();

    for (let file of files) {
      formData.append("images", file);
    }

    try {
      const res = await axiosInstance.post("/api/blogs/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setImages((prev) => [...prev, ...res.data.images]);
    } catch (error) {
      console.error("Upload failed", error);
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

      const payload = {
        title,
        author,
        body,
        images,
      };

      const res = await axiosInstance.post("/api/blogs", payload);

      console.log("Blog created:", res.data);

      // reset form
      setTitle("");
      setAuthor("");
      setBody("");
      setImages([]);

      // show success alert
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
      }, 4000);

    } catch (error) {
      console.error("Blog creation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">

        <div className="bg-white shadow-lg rounded-xl p-8">

          <h1 className="text-2xl font-bold mb-6">
            Create Blog
          </h1>

          {/* SUCCESS ALERT */}
          {success && (
            <div className="mb-6 rounded-lg border border-green-300 bg-green-50 p-4 text-green-700">
              ✅ Blog successfully created!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Blog Title
              </label>

              <input
                type="text"
                className="w-full border rounded-lg p-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Author
              </label>

              <input
                type="text"
                className="w-full border rounded-lg p-3"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Blog Images
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-3"
              />

              <div className="flex flex-wrap gap-3">
                {images.map((img, index) => (
                  <div key={index} className="relative">

                    <img
                      src={img}
                      alt="preview"
                      className="w-32 h-24 object-cover rounded"
                    />

                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
                    >
                      X
                    </button>

                  </div>
                ))}
              </div>
            </div>

            {/* Blog Editor */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Blog Content
              </label>

              <BlogEditor content={body} setContent={setBody} />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Create Blog"}
            </button>

          </form>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AddBlog;