import React, { useState } from "react";
import axiosInstance from "../../utils/Instance";
import { useUserRegistration } from "../../context/UserRegistrationContext";

function EnquiryForm({ projectId, onSuccess }) {
  
  const [formData, setFormData] = useState({
    full_name: "",
    contact: "",
    email: "",
  });

  const { registerUser } = useUserRegistration();

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const nameParts = formData.full_name.trim().split(" ");
    const first_name = nameParts[0];
    const last_name = nameParts.slice(1).join(" ");

    try {
      const res = await axiosInstance.post("/api/customers/create", {
        first_name,
        last_name,
        contact: formData.contact,
        email: formData.email,
        project_id: projectId,
      });

      if (res.data.success) {
        registerUser(projectId);
        onSuccess();
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="full_name"
          required
          onChange={handleChange}
          placeholder="Enter your name"
          className="w-full px-3 py-2.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
        />
      </div>

      {/* Contact Number */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Contact Number <span className="text-red-500">*</span>
        </label>
        <input
          type="tel"
          name="contact"
          required
          onChange={handleChange}
          placeholder="Enter contact number"
          className="w-full px-3 py-2.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Email Address <span className="text-red-500"></span>
        </label>
        <input
          type="email"
          name="email"
          onChange={handleChange}
          placeholder="Enter email address"
          className="w-full px-3 py-2.5 text-sm bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full h-11 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}

export default EnquiryForm;
