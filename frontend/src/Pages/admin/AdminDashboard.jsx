import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusCircle,
  Edit3,
  Eye,
  Users,
  Mail,
  TrendingUp,
  FileSpreadsheet,
  ArrowLeft,
  FileText,
  Menu,
  X,
} from "lucide-react";
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
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login");
    } else {
      setUser(JSON.parse(userData));
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
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

  const quickStats = [
    { label: "Contacted", value: leadsStats.contacted || 0, color: "blue" },
    { label: "Qualified", value: leadsStats.qualified || 0, color: "purple" },
    { label: "Converted", value: leadsStats.converted || 0, color: "green" },
    { label: "Lost", value: leadsStats.lost || 0, color: "yellow" },
    { label: "Total", value: leadsStats.total || 0, color: "gray" },
  ];

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Welcome Header - Mobile Optimized */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2">
            Manage your properties and leads from here
          </p>
        </div>

        <AlertMessage
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        {/* Mobile Section Navigation */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <span className="font-medium text-gray-700">Jump to Section</span>
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
              {[
                {
                  id: "property",
                  label: "Property Management",
                  icon: TrendingUp,
                },
                { id: "blog", label: "Blog Management", icon: FileText },
                { id: "leads", label: "Lead Management", icon: Mail },
                { id: "bulk", label: "Bulk Import", icon: FileSpreadsheet },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    document
                      .getElementById(item.id)
                      ?.scrollIntoView({ behavior: "smooth" });
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition"
                >
                  <item.icon size={18} className="text-gray-500" />
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Show either dashboard or excel import based on activeTab */}
        {activeTab === "dashboard" ? (
          <>
            {/* Property Management Section */}
            <section id="property" className="mb-8 sm:mb-12 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                Property Management
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <DashboardCard
                  title="Add Project"
                  icon={<PlusCircle className="w-6 h-6 sm:w-8 sm:h-8" />}
                  color="blue"
                  link="/admin/add"
                />
                <DashboardCard
                  title="Update Projects"
                  icon={<Edit3 className="w-6 h-6 sm:w-8 sm:h-8" />}
                  color="green"
                  link="/admin/list"
                />
                <DashboardCard
                  title="View Projects"
                  icon={<Eye className="w-6 h-6 sm:w-8 sm:h-8" />}
                  color="purple"
                  link="/admin/list"
                />
              </div>
            </section>

            {/* Blog Management Section */}
            <section id="blog" className="mb-8 sm:mb-12 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                Blog Management
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 justify-items-centre">
                {" "}
                <DashboardCard
                  title="Add Blog"
                  icon={<PlusCircle className="w-6 h-6 sm:w-8 sm:h-8" />}
                  color="blue"
                  link="/admin/blogs/create"
                />
                <DashboardCard
                  title="Edit and View Blogs"
                  icon={<Edit3 className="w-6 h-6 sm:w-8 sm:h-8" />}
                  color="green"
                  link="/admin/blogs"
                />
              </div>
            </section>

            {/* Lead Management Section */}
            <section id="leads" className="mb-8 sm:mb-12 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Lead Management
              </h2>

              {/* Lead Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
                <LeadsCard
                  title="Total Leads"
                  count={leadsStats.total}
                  icon={
                    <Users className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  }
                  color="blue"
                  link="/admin/leads"
                  subtitle="All time"
                />
                <LeadsCard
                  title="New Leads"
                  count={leadsStats.new}
                  icon={
                    <Mail className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  }
                  color="green"
                  link="/admin/leads?status=new"
                  subtitle="Awaiting"
                />
                <LeadsCard
                  title="Unopened"
                  count={leadsStats.unopened}
                  icon={<Eye className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />}
                  color="orange"
                  link="/admin/leads?status=new&unopened=true"
                  subtitle="Not viewed"
                />
                <LeadsCard
                  title="Today's"
                  count={leadsStats.today}
                  icon={
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
                  }
                  color="purple"
                  link="/admin/leads?today=true"
                  subtitle="Received today"
                />
              </div>

              {/* Quick Status Summary - Mobile Optimized */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className={`bg-${stat.color}-50 rounded-lg p-2 sm:p-3 text-center`}
                  >
                    <p className="text-[10px] sm:text-xs font-medium text-gray-600 truncate">
                      {stat.label}
                    </p>
                    <p className="text-sm sm:text-base lg:text-xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Customers Card */}
              <div className="mt-4 sm:mt-6">
                <DashboardCard
                  title="Customers"
                  icon={<Users className="w-6 h-6 sm:w-8 sm:h-8" />}
                  color="orange"
                  link="/admin/customers"
                  subtitle="Manage customers & enquiries"
                />
              </div>
            </section>

            {/* Bulk Import Section */}
            <section id="bulk" className="mt-8 sm:mt-12 scroll-mt-20">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                Bulk Import
              </h2>

              {/* Import Card - Mobile Optimized */}
              <button
                onClick={() => setActiveTab("excel")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group text-left"
              >
                <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-10 group-hover:opacity-20 transition">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <circle cx="80" cy="20" r="40" />
                    <circle cx="20" cy="80" r="30" />
                  </svg>
                </div>
                <div className="relative z-10 flex items-center gap-3 sm:gap-4">
                  <div className="text-3xl sm:text-4xl opacity-90">
                    <FileSpreadsheet className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-xl font-semibold mb-0.5 sm:mb-1">
                      Import from Excel
                    </h3>
                    <p className="text-xs sm:text-sm opacity-90">
                      Bulk import projects via Excel
                    </p>
                  </div>
                </div>
              </button>
            </section>
          </>
        ) : (
          /* Excel Import Tab */
          <div className="mt-4 sm:mt-6">
            <button
              onClick={() => setActiveTab("dashboard")}
              className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition flex items-center gap-2 text-sm sm:text-base"
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
