import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit2,
  Trash2,
  RefreshCw,
  MapPin,
  Tag,
  Image as ImageIcon,
  ArrowLeft,
  ChevronUp,
  Filter,
  X,
  ArrowUpDown,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import Pagination from "../../components/admin/Pagination";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";

const ProjectsList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Sorting state
  const [sortBy, setSortBy] = useState("display_order"); // 'display_order', 'project_id', 'project_name'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc' or 'desc'
  const [showSortPanel, setShowSortPanel] = useState(false);

  // State for display order updates
  const [updatingOrder, setUpdatingOrder] = useState({});
  const [orderValues, setOrderValues] = useState({});

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login");
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProjects();
    }
  }, [navigate, currentPage, sortBy, sortOrder]); // Re-fetch when sort changes

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Add sort parameters to the API call
      const response = await axiosInstance.get(
        `/api/projects/getAllProjects?page=${currentPage}&limit=10&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      );
      setProjects(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);

      // Initialize order values from fetched projects
      const initialOrders = {};
      response.data.data.forEach((project) => {
        initialOrders[project.id] = project.display_order || 0;
      });
      setOrderValues(initialOrders);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load projects" });
      // console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderChange = (id, value) => {
    setOrderValues({
      ...orderValues,
      [id]: value,
    });
  };

  const handleUpdateOrder = async (id) => {
    const orderValue = parseInt(orderValues[id]);

    if (isNaN(orderValue)) {
      setMessage({ type: "error", text: "Please enter a valid number" });
      return;
    }

    setUpdatingOrder({ ...updatingOrder, [id]: true });

    try {
      const response = await axiosInstance.put(
        `/api/projects/${id}/update-display-order`,
        { display_order: orderValue },
      );

      if (response.data.success) {
        setMessage({
          type: "success",
          text: `Order updated to ${orderValue} successfully!`,
        });
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update order",
      });
    } finally {
      setUpdatingOrder({ ...updatingOrder, [id]: false });
    }
  };

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      // Toggle order if same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // New field, default to ascending
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
    setCurrentPage(1); // Reset to first page
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`))
      return;

    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`/api/projects/deleteProject/${id}`);
      setMessage({ type: "success", text: "Project deleted successfully!" });
      fetchProjects();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const baseClasses =
      "px-2 py-1 text-xs font-medium rounded-full inline-flex items-center";
    if (status === "RTM") return `${baseClasses} bg-green-100 text-green-700`;
    if (status === "UC") return `${baseClasses} bg-yellow-100 text-yellow-700`;
    return `${baseClasses} bg-gray-100 text-gray-700`;
  };

  // Get sort indicator
  const getSortIndicator = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? " ↑" : " ↓";
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate("/admin")}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
        </div>

        {/* Header with Sort Options */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              All Projects
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Total: {totalCount} projects | Sorted by:{" "}
              {sortBy === "display_order"
                ? "Display Order"
                : sortBy === "project_id"
                  ? "Project ID"
                  : "Project Name"}{" "}
              ({sortOrder})
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSortPanel(!showSortPanel)}
              className={`px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm ${
                showSortPanel
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <ArrowUpDown className="w-4 h-4" />
              {showSortPanel ? "Hide Sort" : "Sort"}
            </button>
            <button
              onClick={fetchProjects}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Sort Panel */}
        {showSortPanel && (
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => handleSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="display_order">Display Order</option>
                  <option value="project_id">Project ID</option>
                  <option value="project_name">
                    Project Name (Alphabetical)
                  </option>
                </select>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Order
                </label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="desc">Descending (Z-A / High to Low)</option>
                  <option value="asc">Ascending (A-Z / Low to High)</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSortBy("display_order");
                  setSortOrder("desc");
                  setCurrentPage(1);
                  setShowSortPanel(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm whitespace-nowrap"
              >
                <X className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        )}

        <AlertMessage
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                        onClick={() => handleSort("project_id")}
                      >
                        ID {getSortIndicator("project_id")}
                      </th>
                      <th
                        className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                        onClick={() => handleSort("project_name")}
                      >
                        Name {getSortIndicator("project_name")}
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Location
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Image
                      </th>
                      <th
                        className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:text-blue-600"
                        onClick={() => handleSort("display_order")}
                      >
                        Order {getSortIndicator("display_order")}
                      </th>
                      <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {projects.map((project) => (
                      <tr
                        key={project.id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                          #{project.project_id}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">
                            {project.project_name}
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-500">
                          {project.project_location || "N/A"}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <span
                            className={getStatusBadge(project.project_status)}
                          >
                            {project.project_status || "N/A"}
                          </span>
                        </td>
                        <td className="px-4 lg:px-6 py-4 text-sm text-gray-900">
                          {project.price || "N/A"}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          {project.image_url ? (
                            <img
                              src={project.image_url}
                              alt={project.project_name}
                              className="w-10 h-10 object-cover rounded"
                              onError={(e) => (e.target.style.display = "none")}
                            />
                          ) : (
                            <span className="text-xs text-gray-400">
                              No image
                            </span>
                          )}
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min="0"
                              value={orderValues[project.id] || 0}
                              onChange={(e) =>
                                handleOrderChange(project.id, e.target.value)
                              }
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="0"
                            />
                            <button
                              onClick={() => handleUpdateOrder(project.id)}
                              disabled={updatingOrder[project.id]}
                              className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                              title="Update order"
                            >
                              {updatingOrder[project.id] ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              ) : (
                                <ChevronUp className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-4 lg:px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                navigate(`/admin/view/${project.id}`)
                              }
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="View"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                navigate(`/admin/edit/${project.id}`)
                              }
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDelete(project.id, project.project_name)
                              }
                              disabled={deleteLoading === project.id}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deleteLoading === project.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden"
                >
                  {/* Image Header */}
                  <div className="relative h-40 bg-gray-100">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.project_name}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <ImageIcon className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className={getStatusBadge(project.project_status)}>
                        {project.project_status || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Title and ID */}
                    <div className="mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {project.project_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        ID: #{project.project_id}
                      </p>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-gray-600 truncate">
                          {project.project_location || "N/A"}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Tag className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-gray-600">
                          {project.price || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Display Order - Mobile */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-2">
                        Display Order
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          value={orderValues[project.id] || 0}
                          onChange={(e) =>
                            handleOrderChange(project.id, e.target.value)
                          }
                          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Order"
                        />
                        <button
                          onClick={() => handleUpdateOrder(project.id)}
                          disabled={updatingOrder[project.id]}
                          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                        >
                          {updatingOrder[project.id] ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <ChevronUp className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => navigate(`/admin/view/${project.id}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/admin/edit/${project.id}`)}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition text-sm"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(project.id, project.project_name)
                        }
                        disabled={deleteLoading === project.id}
                        className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition text-sm disabled:opacity-50"
                      >
                        {deleteLoading === project.id ? (
                          <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                <p className="text-gray-500">No projects found</p>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalCount={totalCount}
                onPageChange={handlePageChange}
              />
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectsList;
