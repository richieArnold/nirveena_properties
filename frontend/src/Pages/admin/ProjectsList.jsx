import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, Edit2, Trash2, RefreshCw } from 'lucide-react';
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token) {
      navigate('/admin/login');
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchProjects();
    }
  }, [navigate, currentPage]); // Re-fetch when page changes

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        `/api/projects/getAllProjects?page=${currentPage}&limit=10`
      );
      setProjects(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;

    setDeleteLoading(id);
    try {
      await axiosInstance.delete(`/api/projects/deleteProject/${id}`);
      setMessage({ type: "success", text: "Project deleted successfully!" });
      fetchProjects(); // Refresh after delete
    } catch (error) {
      setMessage({ type: "error", text: error.response?.data?.message || "Failed to delete" });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Total: {totalCount} projects</p>
          </div>
          <button
            onClick={fetchProjects}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

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
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PROJECT ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map(project => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">#{project.project_id}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{project.project_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{project.project_location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          project.project_status === 'RTM' 
                            ? 'bg-green-100 text-green-700'
                            : project.project_status === 'UC'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {project.project_status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{project.price || 'N/A'}</td>
                      <td className="px-6 py-4">
                        {project.image_url ? (
                          <img 
                            src={project.image_url} 
                            alt={project.project_name} 
                            className="w-12 h-12 object-cover rounded"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <span className="text-xs text-gray-400">No image</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/admin/view/${project.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/admin/edit/${project.id}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(project.id, project.project_name)}
                            disabled={deleteLoading === project.id}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
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

              {projects.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-gray-500">No projects found</p>
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalCount={totalCount}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProjectsList;