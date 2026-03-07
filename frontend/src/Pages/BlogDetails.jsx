import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";
import { Loader2, ArrowLeft, Calendar, Clock } from "lucide-react";

const BlogDetails = () => {
  const { slug } = useParams();

  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/api/blogs/${slug}`);
      setBlog(res.data.data);
    } catch (error) {
      console.error("Failed to fetch blog:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-20 text-gray-400">Blog not found</div>
    );
  }

  return (
<div className="bg-[#f7f7f7] min-h-screen">

  {/* TOP BACKGROUND UNDER TRANSPARENT HEADER */}
  <div className="absolute top-0 left-0 w-full h-28 bg-white z-0"></div>
<div className="relative pt-28">
<div className="max-w-6xl mx-auto px-6 mb-6"><button
onClick={() => navigate(-1)}
  className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700"
>
  <ArrowLeft size={18} />
  Back to blogs
</button>
      </div>
      </div>

      {/* ARTICLE HEADER */}

      <div className="max-w-4xl mx-auto px-6 text-center mt-10">
        {/* CATEGORY */}
        <span className="inline-block text-xs font-semibold bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-wide">
          Tech Trends
        </span>

        {/* TITLE */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-6 leading-tight">
          {blog.title}
        </h1>

        {/* META INFO */}

        <div className="flex items-center justify-center gap-6 mt-6 text-gray-500 text-sm">
          <span className="flex items-center gap-2">👤 {blog.author}</span>

          <span className="flex items-center gap-2">
            <Calendar size={16} />
            {new Date(blog.created_at).toLocaleDateString()}
          </span>
        </div>

        <hr className="mt-8 border-gray-200" />
      </div>

      {/* HERO IMAGE */}

      {blog.images?.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 mt-12">
          <img
            src={blog.images[0].image_url}
            alt={blog.title}
            className="rounded-2xl shadow-lg w-full object-cover max-h-[550px]"
          />
        </div>
      )}

      {/* BLOG BODY */}

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-p:text-gray-700"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />
      </div>
    </div>
  );
};

export default BlogDetails;
