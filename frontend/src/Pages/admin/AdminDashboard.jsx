import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Edit3, Eye, Users, Mail, TrendingUp, FileSpreadsheet, ArrowLeft } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import DashboardCard from "../../components/admin/DashboardCard";
import LeadsCard from "../../components/admin/LeadsCard";
import AlertMessage from "../../components/admin/AlertMessage";
import ApiFallback from "../../components/common/ApiFallback";
import ExcelImport from "../../components/admin/ExcelImport";
import axiosInstance from "../../utils/Instance";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [leadsStats, setLeadsStats] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    converted: 0,
    lost: 0,
    unopened: 0,
    today: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login");
    } else {
      setUser(JSON.parse(userData));
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchDashboardData();
    }
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      setError(false);
      setLoading(true);

      const [projectsRes, leadsStatsRes] = await Promise.all([
        axiosInstance.get("/api/projects/getAllProjects"),
        axiosInstance.get("/api/leads/stats"),
      ]);

      setProjects(projectsRes.data.data);
      setLeadsStats(leadsStatsRes.data.data);
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: projects.length,
    rtm: projects.filter((p) => p.project_status === "RTM").length,
    uc: projects.filter((p) => p.project_status === "UC").length,
    totalCustomers: 0, // You'll need to fetch this from your API
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <ApiFallback
          title="Loading dashboard..."
          message="Please wait while we fetch your data."
          loading={true}
        />
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout user={user}>
        <ApiFallback
          title="Failed to load dashboard"
          message="There was a problem connecting to the server."
          onRetry={fetchDashboardData}
          fullScreen
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-500 mt-2">
            Manage your properties and leads from here
          </p>
        </div>

        <AlertMessage
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        {/* Show either dashboard or excel import based on activeTab */}
        {activeTab === 'dashboard' ? (
          <>
            {/* Projects Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Property Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashboardCard
                  title="Add Project"
                  icon={<PlusCircle className="w-8 h-8" />}
                  color="blue"
                  link="/admin/add"
                />
                <DashboardCard
                  title="Update Projects"
                  icon={<Edit3 className="w-8 h-8" />}
                  color="green"
                  link="/admin/list"
                />
                <DashboardCard
                  title="View Projects"
                  icon={<Eye className="w-8 h-8" />}
                  color="purple"
                  link="/admin/list"
                />
              </div>
            </div>

            {/* Leads Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Lead Management
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <LeadsCard
                  title="Total Leads"
                  count={leadsStats.total}
                  icon={<Users className="w-8 h-8" />}
                  color="blue"
                  link="/admin/leads"
                  subtitle="All time leads"
                />
                <LeadsCard
                  title="New Leads"
                  count={leadsStats.new}
                  icon={<Mail className="w-8 h-8" />}
                  color="green"
                  link="/admin/leads?status=new"
                  subtitle="Awaiting contact"
                />
                <LeadsCard
                  title="Unopened"
                  count={leadsStats.unopened}
                  icon={<Eye className="w-8 h-8" />}
                  color="orange"
                  link="/admin/leads?status=new&unopened=true"
                  subtitle="Not viewed yet"
                />
                <LeadsCard
                  title="Today's Leads"
                  count={leadsStats.today}
                  icon={<TrendingUp className="w-8 h-8" />}
                  color="purple"
                  link="/admin/leads?today=true"
                  subtitle="Received today"
                />
              </div>

              {/* Quick Status Summary */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-blue-600 font-medium">Contacted</p>
                  <p className="text-xl font-bold text-blue-700">
                    {leadsStats.contacted || 0}
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-purple-600 font-medium">Qualified</p>
                  <p className="text-xl font-bold text-purple-700">
                    {leadsStats.qualified || 0}
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-600 font-medium">Converted</p>
                  <p className="text-xl font-bold text-green-700">
                    {leadsStats.converted || 0}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-yellow-600 font-medium">Lost</p>
                  <p className="text-xl font-bold text-yellow-700">
                    {leadsStats.lost || 0}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 font-medium">Total</p>
                  <p className="text-xl font-bold text-gray-700">
                    {leadsStats.total || 0}
                  </p>
                </div>
              </div>
              
              {/* Customers Card */}
              <div className="mt-6">
                <DashboardCard
                  title="Customers"
                  count={stats.totalCustomers || 0}
                  icon={<Users className="w-8 h-8" />}
                  color="orange"
                  link="/admin/customers"
                  subtitle="Manage customers & enquiries"
                />
              </div>
            </div>

            {/* Excel Import Card - Using a button directly to ensure click works */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-green-600" />
                Bulk Import
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <button
                  onClick={() => setActiveTab('excel')}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-left"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 opacity-10 group-hover:opacity-20 transition">
                    <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
                      <circle cx="80" cy="20" r="40" />
                      <circle cx="20" cy="80" r="30" />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl opacity-90">
                        <FileSpreadsheet className="w-8 h-8" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-1">Import from Excel</h3>
                    <p className="text-sm opacity-90">Bulk import projects via Excel</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Excel Import Tab */
          <div className="mt-6">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <ExcelImport />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;