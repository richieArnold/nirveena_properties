import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/Instance";
import { User, Lock, Loader2 } from "lucide-react";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await axiosInstance.post("/api/auth/login", credentials);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("adminUser", JSON.stringify(response.data.user));

        if (onLogin) onLogin();

        navigate("/admin");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://www.prestigesouthernstar.info/images/prestige/tiny-flats-hefty-rents-other-side-of-high-potential-bangalore-real-estate.webp')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Login Container */}
      <div className="w-full max-w-md relative z-10">

        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Nirveena Admin
          </h1>
          <p className="text-gray-200 mt-2">
            Sign in to access dashboard
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border">

          <form className="space-y-6" onSubmit={handleSubmit}>

            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>

              <div className="relative">
                <User
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter username"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock
                  className="absolute left-3 top-3.5 text-gray-400"
                  size={18}
                />

                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading && <Loader2 className="animate-spin" size={18} />}
              {loading ? "Signing in..." : "Sign In"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;