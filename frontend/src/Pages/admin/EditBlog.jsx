import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/Instance";
import AdminLayout from "../../components/admin/AdminLayout";
import BlogEditor from "../../components/admin/BlogEditor";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBlog = async () => {
    try {
      const res = await axiosInstance.get(`/api/blogs/id/${id}`);
      const blog = res.data.data;

      setTitle(blog.title);
      setAuthor(blog.author);
      setBody(blog.body);

      if (blog.images) {
        setImages(blog.images.map((img) => img.image_url));
      }
    } catch (error) {
      console.error("Failed to fetch blog", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const payload = {
        title,
        author,
        body,
        images,
      };

      await axiosInstance.put(`/api/blogs/${id}`, payload);

      navigate("/admin/blogs");
    } catch (error) {
      console.error("Update failed", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading blog...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h1 className="text-2xl font-bold mb-6">Edit Blog</h1>

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
              <label className="block text-sm font-medium mb-2">Author</label>

              <input
                type="text"
                className="w-full border rounded-lg p-3"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Blog Images
              </label>

              {/* 🔥 Custom Upload Button */}
              <label className="inline-block cursor-pointer">
                <span className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition">
                  Upload Images
                </span>

                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              {/* 🔥 Helper text */}
              <p className="text-xs text-gray-500 mt-2">
                Max file size: 1MB per image
              </p>

              {/* Preview */}
              <div className="flex flex-wrap gap-3 mt-4">
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
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded"
                    >
                      ✕
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
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              {saving ? "Updating..." : "Update Blog"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditBlog;
