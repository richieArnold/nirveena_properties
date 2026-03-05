import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";

const BlogDetails = () => {

  const { slug } = useParams();
  const [blog, setBlog] = useState(null);

  const fetchBlog = async () => {
    try {
      const res = await axiosInstance.get(`/api/blogs/${slug}`);
      setBlog(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlog();
  }, []);

  if (!blog) return <div className="p-10">Loading...</div>;

  return (
    <div>

      {/* HERO */}
      <section className="bg-gray-100 py-20 text-center">

        <h1 className="text-4xl font-bold max-w-3xl mx-auto">
          {blog.title}
        </h1>

        <p className="text-gray-500 mt-3">
          By {blog.author}
        </p>

      </section>

      {/* IMAGE SLIDER */}
      {blog.images?.length > 0 && (
        <div className="max-w-5xl mx-auto mt-10">

          <img
            src={blog.images[0].image_url}
            className="rounded-xl shadow-lg"
          />

        </div>
      )}

      {/* BLOG CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-16">

        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.body }}
        />

      </div>

    </div>
  );
};

export default BlogDetails;