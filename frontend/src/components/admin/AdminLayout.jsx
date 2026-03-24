import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Home, PlusCircle, List, Settings, Menu, X, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const AdminLayout = ({ children, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Reset timer on user activity
  // useEffect(() => {
  //   const resetTimer = () => {
  //     setTimeLeft(180);
  //   };

  //   const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'touchstart'];
  //   events.forEach(event => {
  //     window.addEventListener(event, resetTimer);
  //   });

  //   return () => {
  //     events.forEach(event => {
  //       window.removeEventListener(event, resetTimer);
  //     });
  //   };
  // }, []);

  // const formatTime = (seconds) => {
  //   const mins = Math.floor(seconds / 60);
  //   const secs = seconds % 60;
  //   return `${mins}:${secs.toString().padStart(2, '0')}`;
  // };

  // const getTimerColor = () => {
  //   if (timeLeft <= 30) return 'text-red-600';
  //   if (timeLeft <= 60) return 'text-yellow-600';
  //   return 'text-green-600';
  // };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    { path: "/admin/add", label: "Add Project", icon: <PlusCircle className="w-4 h-4" /> },
    { path: "/admin/list", label: "All Projects", icon: <List className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo - Responsive */}
            <Link to="/admin" className="flex items-center gap-1 sm:gap-2">
              <span className="text-lg sm:text-xl lg:text-2xl text-blue-600 font-bold truncate max-w-[120px] sm:max-w-none">
                Nirveena's
              </span>
              <span className="hidden xs:inline text-sm sm:text-base lg:text-xl font-bold text-gray-900 truncate">
                Admin
              </span>
            </Link>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 lg:px-4 py-2 rounded-lg transition flex items-center gap-2 text-sm lg:text-base ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  <span className="hidden lg:inline">{item.label}</span>
                  <span className="lg:hidden">{item.label.split(' ')[0]}</span>
                </Link>
              ))}
            </nav>

            {/* User Info - Responsive */}
            {user && (
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Session Timer */}
                {/* <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-lg">
                  <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                  <span className={`text-xs font-medium ${getTimerColor()}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div> */}

                {/* Desktop User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[120px]">
                    {user.username}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500">Admin</p>
                </div>

                {/* Settings Dropdown */}
                <div className="relative group hidden sm:block">
                  <button className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                    <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 hidden group-hover:block">
                    <Link
                      to="/admin/change-password"
                      className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-gray-50 transition truncate"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 px-3 py-2">
            <nav className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg transition flex items-center gap-3 text-sm ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Settings */}
              <Link
                to="/admin/change-password"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg transition flex items-center gap-3 text-sm text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-4 h-4" />
                Change Password
              </Link>

              {/* Mobile Timer */}
              {/* <div className="px-4 py-2 flex items-center justify-between bg-gray-50 rounded-lg mt-2">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${getTimerColor()}`} />
                  <span className="text-xs text-gray-600">Session</span>
                </div>
                <span className={`text-sm font-medium ${getTimerColor()}`}>
                  {formatTime(timeLeft)}
                </span>
              </div> */}
              
              {/* Mobile User Info */}
              <div className="px-4 py-3 border-t border-gray-100 mt-2">
                <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content - with responsive padding */}
      <main className="pt-16 sm:pt-20 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;