import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";
import { Link } from "react-router-dom";

const BlogsPage = () => {

  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/api/blogs");
      setBlogs(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>

      {/* HERO */}
      <section className="bg-gray-100 py-20 text-center">
        <h1 className="text-4xl font-bold">Our Blog</h1>
        <p className="text-gray-500 mt-3">
          Insights and updates from Nirveena Property
        </p>
      </section>

      {/* BLOG CARDS */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-8">

        {blogs.map((blog) => (

          <div
            key={blog.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >

            {blog.images?.[0] && (
              <img
                src={blog.images[0].image_url}
                alt={blog.title}
                className="w-full h-52 object-cover"
              />
            )}

            <div className="p-6">

              <h2 className="text-xl font-semibold mb-2">
                {blog.title}
              </h2>

              <p className="text-gray-500 text-sm mb-4">
                By {blog.author}
              </p>

              <Link
                to={`/blogs/${blog.slug}`}
                className="text-blue-600 font-medium"
              >
                Read More →
              </Link>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
};

export default BlogsPage;