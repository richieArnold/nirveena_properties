import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit3, Eye } from 'lucide-react';
import AdminLayout from "../../components/admin/AdminLayout";  // Correct path
import DashboardCard from "../../components/admin/DashboardCard";  // Correct path
import AlertMessage from "../../components/admin/AlertMessage";  // Correct path

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

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
  }, [navigate]);

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/projects/getAllProjects");
      setProjects(response.data.data);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to load projects" });
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: projects.length,
    rtm: projects.filter(p => p.project_status === 'RTM').length,
    uc: projects.filter(p => p.project_status === 'UC').length
  };

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h1>
          <p className="text-gray-500 mt-2">Manage your properties from here</p>
        </div>

        <AlertMessage 
          message={message.text} 
          type={message.type} 
          onClose={() => setMessage({ type: "", text: "" })} 
        />

        {/* 3 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DashboardCard
            title="Add Project"
            // count={stats.total}
            icon={<PlusCircle className="w-8 h-8" />}
            color="blue"
            link="/admin/add"
          />
          <DashboardCard
            title="Update Projects"
            // count={stats.uc}
            icon={<Edit3 className="w-8 h-8" />}
            color="green"
            link="/admin/list"
          />
          <DashboardCard
            title="View Projects"
            // count={stats.rtm}
            icon={<Eye className="w-8 h-8" />}
            color="purple"
            link="/admin/list"
          />
        </div>

        {/* Recent Projects */}
        {/* <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Projects</h2>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects.slice(0, 3).map(project => (
                <div key={project.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  {project.image_url && (
                    <img 
                      src={project.image_url} 
                      alt={project.project_name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-semibold text-gray-900">{project.project_name}</h3>
                  <p className="text-sm text-gray-500">{project.project_location}</p>
                </div>
              ))}
            </div>
          )}
        </div> */}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;