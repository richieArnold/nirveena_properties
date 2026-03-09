import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/Instance";
import AdminLayout from "../../components/admin/AdminLayout";
import { ArrowLeft, User, Calendar } from "lucide-react";

const ViewBlog = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      const res = await axiosInstance.get(`/api/blogs/${slug}`);
      setBlog(res.data.data);
    } catch (error) {
      console.error("Failed to load blog", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-gray-500">
          Loading blog...
        </div>
      </AdminLayout>
    );
  }

  if (!blog) {
    return (
      <AdminLayout>
        <div className="p-10 text-center text-red-500">
          Blog not found
        </div>
      </AdminLayout>
    );
  }

  const heroImage = blog.images?.length ? blog.images[0].image_url : null;

  return (
    <AdminLayout>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate("/admin/blogs")}
          className="flex items-center gap-2 text-blue-600 hover:underline mb-6"
        >
          <ArrowLeft size={18} />
          Back to Blogs
        </button>

        {/* Hero Image */}
        {heroImage && (
          <div className="mb-8">
            <img
              src={heroImage}
              alt={blog.title}
              className="w-full h-[420px] object-cover rounded-xl shadow-md"
            />
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author + Date */}
        <div className="flex items-center gap-6 text-gray-500 mb-10 border-b pb-6">

          <div className="flex items-center gap-2">
            <User size={18} />
            <span className="font-medium">{blog.author}</span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar size={18} />
            <span>
              {new Date(blog.created_at).toLocaleDateString()}
            </span>
          </div>

        </div>

        {/* Blog Content */}
        <div
          className="prose prose-lg max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:font-medium"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />

        {/* Extra Images */}
        {blog.images?.length > 1 && (
          <div className="mt-12 grid grid-cols-2 gap-6">
            {blog.images.slice(1).map((img, index) => (
              <img
                key={index}
                src={img.image_url}
                alt="blog"
                className="rounded-lg shadow"
              />
            ))}
          </div>
        )}

      </div>

    </AdminLayout>
  );
};

export default ViewBlog;