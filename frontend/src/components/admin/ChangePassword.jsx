import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, Save, ArrowLeft } from "lucide-react";
import AdminLayout from "./AdminLayout";
import AlertMessage from "./AlertMessage";
import axiosInstance from "../../utils/Instance";

const ChangePassword = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("adminUser") || "{}"),
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const token = localStorage.getItem("adminToken");
      const response = await axiosInstance.put("/api/auth/password", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setMessage({
          type: "success",
          text: "Password updated successfully! Please login with your new password.",
        });

        // Clear form
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Optional: Logout after 3 seconds
        setTimeout(() => {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminUser");
          navigate("/admin/login");
        }, 3000);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition pr-12";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <AdminLayout user={user}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Change Password
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Update your admin account password
            </p>
          </div>
        </div>

        <AlertMessage
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Password Requirements */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password Requirements
            </h3>
            <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
              <li>Minimum 6 characters long</li>
              <li>Should be different from current password</li>
              <li>
                Use a combination of letters and numbers for stronger security
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className={labelClasses}>Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className={labelClasses}>New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className={inputClasses}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.newPassword && formData.newPassword.length < 6 && (
                <p className="text-xs text-red-500 mt-1">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className={labelClasses}>Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className={inputClasses}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {formData.confirmPassword &&
                formData.newPassword !== formData.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">
                    Passwords do not match
                  </p>
                )}
            </div>

            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">
                  Password Strength:
                </p>
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      formData.newPassword.length >= 6
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      /[0-9]/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      /[a-z]/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      /[A-Z]/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded-full ${
                      /[^A-Za-z0-9]/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-gray-200"
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {formData.newPassword.length < 6 &&
                    "❌ At least 6 characters"}
                  {formData.newPassword.length >= 6 && "✅ Length ok"}
                  {/[0-9]/.test(formData.newPassword)
                    ? " ✅ Has number"
                    : " ❌ Add number"}
                  {/[a-z]/.test(formData.newPassword)
                    ? " ✅ Lowercase"
                    : " ❌ Add lowercase"}
                  {/[A-Z]/.test(formData.newPassword)
                    ? " ✅ Uppercase"
                    : " ❌ Add uppercase"}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={
                  loading || formData.newPassword !== formData.confirmPassword
                }
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {loading ? "Updating..." : "Update Password"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-yellow-800 mb-2">
            🔒 Security Tips
          </h4>
          <ul className="text-xs text-yellow-700 space-y-1">
            <li>• Never share your password with anyone</li>
            <li>• Use a unique password for your admin account</li>
            <li>• Change your password regularly</li>
            <li>
              • Make sure you're on the official website before entering your
              password
            </li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ChangePassword;
