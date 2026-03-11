import { useEffect, useState } from "react";
import axiosInstance from "../utils/Instance";
import { Link } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";

const HEADING_STYLE = { fontFamily: "'Playfair Display', serif" };
const BODY_STYLE = { fontFamily: "'Inter', sans-serif" };

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchBlogs = async (pageNumber = 1) => {
    try {
      setIsLoading(true);

      const res = await axiosInstance.get(
        `/api/blogs?page=${pageNumber}&limit=5`
      );

      setBlogs(res.data.data || []);
      setPagination(res.data.pagination);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    fetchBlogs(page);
  }, [page]);

  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredBlog = filteredBlogs[0];

  return (
    <div className="min-h-screen bg-[#fafafa]" style={BODY_STYLE}>
      {/* HERO */}
      <section className="relative py-24 overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab')] bg-cover bg-center opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full">
            Blog Hub
          </span>

          <h1
            className="text-4xl md:text-6xl font-extrabold text-white mb-6"
            style={HEADING_STYLE}
          >
            Insights and Updates from <br />
            <span className="text-blue-500">Nirveena Realty</span>
          </h1>

          {/* SEARCH */}
          <div className="max-w-xl mx-auto relative mt-10">
            <div className="absolute inset-y-0 left-5 flex items-center text-gray-400">
              <Search size={22} />
            </div>

            <input
              type="text"
              placeholder="Search articles..."
              className="w-full bg-white/10 border border-white/20 text-white pl-14 pr-6 py-5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* BLOG SECTION */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex flex-col items-center py-20 text-gray-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p>Loading blogs...</p>
          </div>
        ) : featuredBlog ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

              {/* FEATURED BLOG */}
              <div className="lg:col-span-6 xl:col-span-7">
                <article className="flex flex-col h-full bg-white rounded-2xl overflow-hidden shadow border">
                  <div className="aspect-[1.4/1] overflow-hidden">
                    <img
                      src={
                        featuredBlog.images?.[0]?.image_url ||
                        "https://via.placeholder.com/800x600"
                      }
                      className="w-full h-full object-cover"
                      alt={featuredBlog.title}
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <div className="text-xs text-gray-400 uppercase mb-3">
                      By {featuredBlog.author} •{" "}
                      {new Date(featuredBlog.created_at).toLocaleDateString()}
                    </div>

                    <h2
                      className="text-3xl font-extrabold text-gray-900 mb-6"
                      style={HEADING_STYLE}
                    >
                      {featuredBlog.title}
                    </h2>

                    <Link
                      to={`/blogs/${featuredBlog.slug}`}
                      className="text-blue-600 font-bold text-sm"
                    >
                      Read Now →
                    </Link>
                  </div>
                </article>
              </div>

              {/* SIDE BLOGS */}
              <div className="lg:col-span-6 xl:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
                {filteredBlogs.slice(1, 5).map((blog) => (
                  <article
                    key={blog.id}
                    className="bg-white rounded-2xl border shadow-sm overflow-hidden"
                  >
                    <div className="aspect-[1.3/1] overflow-hidden">
                      <img
                        src={
                          blog.images?.[0]?.image_url ||
                          "https://via.placeholder.com/400x300"
                        }
                        className="w-full h-full object-cover"
                        alt={blog.title}
                      />
                    </div>

                    <div className="p-5">
                      <p className="text-xs text-gray-400 uppercase mb-1">
                        By {blog.author} •{" "}
                        {new Date(blog.created_at).toLocaleDateString()}
                      </p>

                      <h3
                        className="text-lg font-bold text-gray-900 mb-3"
                        style={HEADING_STYLE}
                      >
                        {blog.title}
                      </h3>

                      <Link
                        to={`/blogs/${blog.slug}`}
                        className="text-blue-600 text-sm font-semibold"
                      >
                        Read Now →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* PAGINATION */}
            {pagination && (
              <div className="flex justify-center items-center gap-6 mt-16">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="font-medium text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  disabled={page === pagination.totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400">No blogs found.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default BlogsPage;