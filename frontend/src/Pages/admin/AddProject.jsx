import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Save, Upload, ArrowLeft, CheckCircle, XCircle, X, Plus, ChevronDown } from "lucide-react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import AdminLayout from "../../components/admin/AdminLayout";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";

const AddProject = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    title: "",
    message: "",
  });
  const [images, setImages] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newPropertyType, setNewPropertyType] = useState("");
  const [formData, setFormData] = useState({
    project_id: "",
    project_name: "",
    project_type: "",
    project_status: "",
    project_location: "",
    total_acres: "",
    no_of_units: "",
    club_house_size: "",
    structure: "",
    typology: "",
    sba: "",
    price: "",
    rera_completion: "",
    property_description: "",
  });

  // Fetch existing property types from backend
  useEffect(() => {
    fetchPropertyTypes();
  }, []);

  const fetchPropertyTypes = async () => {
    try {
      // You'll need to create this endpoint or use existing one
      const response = await axiosInstance.get("/api/projects/property-types");
      setPropertyTypes(response.data.types || []);
    } catch (error) {
      console.error("Error fetching property types:", error);
      // Fallback to default types if endpoint doesn't exist
      setPropertyTypes(["Apartment", "Villa", "Commercial", "Villa Plots", "Penthouse", "Studio"]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login");
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
  }, [navigate]);

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      property_description: value,
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleAddNewType = () => {
    if (newPropertyType.trim()) {
      // Add to property types list
      setPropertyTypes([...propertyTypes, newPropertyType.trim()]);
      // Select the new type
      setFormData({
        ...formData,
        project_type: newPropertyType.trim(),
      });
      // Reset new type input
      setNewPropertyType("");
      setShowNewTypeInput(false);
      
      // Optional: Save new type to backend
      saveNewPropertyType(newPropertyType.trim());
    }
  };

  const saveNewPropertyType = async (type) => {
    try {
      // You can create an endpoint to save new property types
      await axiosInstance.post("/api/projects/property-types", { type });
    } catch (error) {
      console.error("Error saving new property type:", error);
    }
  };

  const showSuccessNotification = (projectName, imageCount) => {
    setNotification({
      type: "success",
      title: "Project Added Successfully!",
      message: `"${projectName}" has been added with ${imageCount} image(s).`,
    });
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const showErrorNotification = (errorMsg) => {
    setNotification({
      type: "error",
      title: "Failed to Add Project",
      message: errorMsg || "An error occurred while adding the project.",
    });
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await axiosInstance.post(
        "/api/projects/addProject",
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Project added successfully!" });

        showSuccessNotification(
          formData.project_name,
          response.data.data?.images_uploaded || images.length,
        );

        setTimeout(() => navigate("/admin/list"), 2000);
      }
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.message || "Failed to add project";
      setMessage({ type: "error", text: errorMsg });
      showErrorNotification(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <AdminLayout user={user}>
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin')}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
      </div>

      {/* Custom Notification */}
      {showNotification && (
        <div
          className={`fixed top-24 right-6 z-50 max-w-md w-full bg-white rounded-xl shadow-2xl border-l-4 ${
            notification.type === "success"
              ? "border-green-500"
              : "border-red-500"
          } overflow-hidden animate-slide-in`}
        >
          <div className="p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {notification.type === "success" ? (
                  <CheckCircle className="w-6 h-6 text-green-500" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  {notification.title}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => navigate("/admin/list")}
                    className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                  >
                    View All Projects
                  </button>
                  <button
                    onClick={() => setShowNotification(false)}
                    className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
              <button
                onClick={() => setShowNotification(false)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            className={`h-1 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} animate-progress`}
          />
        </div>
      )}

      {/* Back button and title */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/admin")}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Add New Project</h1>
      </div>

      <AlertMessage
        message={message.text}
        type={message.type}
        onClose={() => setMessage({ type: "", text: "" })}
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project ID */}
          <div>
            <label className={labelClasses}>Project ID *</label>
            <input
              type="number"
              name="project_id"
              value={formData.project_id}
              onChange={handleInputChange}
              required
              className={inputClasses}
              placeholder="Enter project ID"
            />
          </div>

          {/* Project Name */}
          <div>
            <label className={labelClasses}>Project Name *</label>
            <input
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleInputChange}
              required
              className={inputClasses}
              placeholder="Enter project name"
            />
          </div>

          {/* Project Type with Dropdown and Add New */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Project Type</label>
            <div className="flex gap-2">
              {!showNewTypeInput ? (
                <>
                  <select
                    name="project_type"
                    value={formData.project_type}
                    onChange={handleInputChange}
                    className={`${inputClasses} flex-1`}
                  >
                    <option value="">Select Project Type</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewTypeInput(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2 whitespace-nowrap"
                    title="Add new property type"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">New Type</span>
                  </button>
                </>
              ) : (
                <>
                  <input
                    type="text"
                    value={newPropertyType}
                    onChange={(e) => setNewPropertyType(e.target.value)}
                    placeholder="Enter new property type"
                    className={`${inputClasses} flex-1`}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddNewType}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNewTypeInput(false);
                      setNewPropertyType("");
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Select from existing types or add a new one
            </p>
          </div>

          {/* Status */}
          <div>
            <label className={labelClasses}>Status</label>
            <select
              name="project_status"
              value={formData.project_status}
              onChange={handleInputChange}
              className={inputClasses}
            >
              <option value="">Select Status</option>
              <option value="UC">Under Construction (UC)</option>
              <option value="RTM">Ready to Move (RTM)</option>
              <option value="Completed">Completed</option>
              <option value="EOI">Expression of Interest (EOI)</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className={labelClasses}>Location</label>
            <input
              type="text"
              name="project_location"
              value={formData.project_location}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="Enter location"
            />
          </div>

          {/* Total Acres */}
          <div>
            <label className={labelClasses}>Total Acres</label>
            <input
              type="text"
              name="total_acres"
              value={formData.total_acres}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 12.5"
            />
          </div>

          {/* Number of Units */}
          <div>
            <label className={labelClasses}>Number of Units</label>
            <input
              type="number"
              name="no_of_units"
              value={formData.no_of_units}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 120"
            />
          </div>

          {/* Club House Size */}
          <div>
            <label className={labelClasses}>Club House Size</label>
            <input
              type="text"
              name="club_house_size"
              value={formData.club_house_size}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 25000 sq.ft"
            />
          </div>

          {/* Structure */}
          <div>
            <label className={labelClasses}>Structure</label>
            <input
              type="text"
              name="structure"
              value={formData.structure}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., G+3"
            />
          </div>

          {/* Typology */}
          <div>
            <label className={labelClasses}>Typology</label>
            <input
              type="text"
              name="typology"
              value={formData.typology}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 3 BHK, 4 BHK"
            />
          </div>

          {/* SBA */}
          <div>
            <label className={labelClasses}>SBA</label>
            <input
              type="text"
              name="sba"
              value={formData.sba}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 2500 - 4500 sq.ft"
            />
          </div>

          {/* Price */}
          <div>
            <label className={labelClasses}>Price</label>
            <input
              type="text"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., 2.5 Cr - 4.5 Cr"
            />
          </div>

          {/* RERA Completion */}
          <div className="md:col-span-2">
            <label className={labelClasses}>RERA Completion</label>
            <input
              type="text"
              name="rera_completion"
              value={formData.rera_completion}
              onChange={handleInputChange}
              className={inputClasses}
              placeholder="e.g., December 2025"
            />
          </div>

          {/* Property Description - Rich Text Editor */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Property Description</label>
            <SimpleMDE
              value={formData.property_description}
              onChange={handleDescriptionChange}
              options={{
                spellChecker: false,
                autofocus: false,
                placeholder: "Enter detailed description...",
                toolbar: [
                  "bold", "italic", "heading", "|",
                  "quote", "unordered-list", "ordered-list", "|",
                  "link", "|",
                  "preview", "side-by-side", "fullscreen", "|",
                  "guide"
                ],
              }}
            />
            <p className="text-xs text-gray-500 mt-1">
              Use formatting tools to create beautiful, structured descriptions
            </p>
          </div>

          {/* Image Upload */}
          <div className="md:col-span-2">
            <label className={labelClasses}>Project Images</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                    <span>Choose Images</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {images.length} image(s) selected
                  <br />
                  <span>Upload images upto 1mb</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {loading ? "Adding Project..." : "Add Project"}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }

        .animate-progress {
          animation: progress 5s linear;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AddProject;