import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, PlusCircle, List, Settings } from "lucide-react";

const AdminLayout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/admin" className="flex items-center gap-2">
              <span className="text-2xl text-blue-600">Nirveena's</span>
              <span className="font-bold text-xl text-gray-900">
                Admin Panel
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  isActive("/admin")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link
                to="/admin/add"
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  isActive("/admin/add")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                Add Project
              </Link>
              <Link
                to="/admin/list"
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  isActive("/admin/list")
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <List className="w-4 h-4" />
                All Projects
              </Link>
            </nav>

            {/* User Info */}
            {user && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>

                {/* Add Password Change Link/Button */}
                <div className="relative group">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <Settings className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block">
                    <Link
                      to="/admin/change-password"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - with padding to account for fixed header */}
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
