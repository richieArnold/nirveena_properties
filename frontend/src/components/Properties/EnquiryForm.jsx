import React, { useState } from "react";
import axiosInstance from "../../utils/Instance";

function EnquiryForm({ projectId, onSuccess }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    contact: "",
    email: "",
  });

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
    console.log(formData, projectId);
    
    try {
      const res = await axiosInstance.post("/api/customers/create", {
        ...formData,
        project_id: projectId,
      });
      console.log(res);

      if (res.data.success) {
        onSuccess(); // tell parent submission success
      }
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Submission failed");
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
      name="first_name"
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
      Email Address <span className="text-red-500">*</span>
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