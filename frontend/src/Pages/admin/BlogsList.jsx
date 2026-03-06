import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/Instance";
import AdminLayout from "../../components/admin/AdminLayout";

const BlogsList = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      const res = await axiosInstance.get("/api/blogs");
      setBlogs(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch blogs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog?")) return;

    try {
      await axiosInstance.delete(`/api/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete blog");
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">Loading blogs...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Blogs</h1>

          <button
            onClick={() => navigate("/admin/blogs/create")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            + Add Blog
          </button>
        </div>

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">

          <table className="w-full text-left">

            <thead className="bg-gray-100">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Author</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>

              {blogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-6">
                    No blogs found
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="border-t hover:bg-gray-50"
                  >

                    <td className="p-4">
                      {blog.title}
                    </td>

                    <td className="p-4">
                      {blog.author}
                    </td>

                    <td className="p-4">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-center flex justify-center gap-3">

                      <button
                        onClick={() =>
                          navigate(`/admin/blogs/edit/${blog.id}`)
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </AdminLayout>
  );
};

export default BlogsList;