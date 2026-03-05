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
      alert("Failed to load blog");
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

    alert("Blog updated successfully!");

    navigate("/admin/blogs");

  } catch (error) {
    console.error("Update failed", error);
    alert("Failed to update blog");
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
