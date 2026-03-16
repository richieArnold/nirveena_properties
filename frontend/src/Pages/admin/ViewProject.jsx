import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Home,
  Building2,
  Ruler,
  DollarSign,
  FileText,
} from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";

const ViewProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const userData = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login");
    } else {
      setUser(JSON.parse(userData));
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      fetchProject();
    }
  }, [navigate, id]);

  const fetchProject = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/projects/getProject/${id}`,
      );
      console.log(response);
      setProject(response.data.data);
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Failed to fetch project details" });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout user={user}>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!project) {
    return (
      <AdminLayout user={user}>
        <div className="text-center py-20">
          <p className="text-gray-500">Project not found</p>
        </div>
      </AdminLayout>
    );
  }

  const allImages = project.images || [];

  return (
    <AdminLayout user={user}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/admin/list")}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {project.project_name}
          </h1>
        </div>

        <AlertMessage
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ type: "", text: "" })}
        />

        {/* Image Gallery */}
        {allImages.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden mb-4">
              <img
                src={allImages[selectedImage]?.image_url}
                alt={project.project_name}
                className="w-full h-full object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {allImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 ${
                    selectedImage === index ? "ring-2 ring-blue-500" : ""
                  }`}
                >
                  <img
                    src={img.image_url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project Details */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">Project ID</p>
                  <p className="font-semibold">#{project.project_id}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-semibold">
                    {project.project_location || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Home className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-500">Project Type</p>
                  <p className="font-semibold">
                    {project.project_type || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-5 h-5 flex items-center justify-center text-orange-600 font-bold">
                  📐
                </div>
                <div>
                  <p className="text-sm text-gray-500">Structure</p>
                  <p className="font-semibold">{project.structure || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Ruler className="w-5 h-5 text-indigo-600" />
                <div>
                  <p className="text-sm text-gray-500">Total Acres</p>
                  <p className="font-semibold">
                    {project.total_acres || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-500">Price</p>
                  <p className="font-semibold">{project.price || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">RERA Completion</p>
                  <p className="font-semibold">
                    {project.rera_completion || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center text-pink-600 font-bold">
                  🏢
                </span>
                <div>
                  <p className="text-sm text-gray-500">Club House Size</p>
                  <p className="font-semibold">
                    {project.club_house_size || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center text-pink-600 font-bold">
                  🏢
                </span>
                <div>
                  <p className="text-sm text-gray-500">Youtube Video URL</p>
                  <p className="font-semibold">
                    {project.youtube_video_url || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Property Description - Integrated */}
          {/* {project.property_description && ( */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">Description</h3>
            </div>
            {project.property_description ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {project.property_description}
              </p>
            ) : (
              <p className="text-gray-400 italic">
                No description available for this property.
              </p>
            )}
          </div>
          {/* )} */}

          {/* Additional Info */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">No. of Units</p>
              <p className="text-lg font-semibold text-blue-900">
                {project.no_of_units || "N/A"}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600">Typology</p>
              <p className="text-lg font-semibold text-green-900">
                {project.typology || "N/A"}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-purple-600">SBA</p>
              <p className="text-lg font-semibold text-purple-900">
                {project.sba || "N/A"}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mt-6 flex justify-end">
            <span
              className={`px-4 py-2 rounded-lg font-medium ${
                project.project_status === "RTM"
                  ? "bg-green-100 text-green-700"
                  : project.project_status === "UC"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {project.project_status || "Status Not Set"}
            </span>
          </div>
        </div>
        <div>
          {/* ================= AMENITIES ================= */}
          {project.features?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">
                Amenities / Features
              </h2>

              <div className="space-y-6">
                {project.features.map((feature) => (
                  <div key={feature.id}>
                    <h3 className="font-semibold text-gray-800 mb-3">
                      {feature.feature_name}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {feature.items?.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                        >
                          {item.icon_url && (
                            <img
                              src={item.icon_url}
                              className="w-6 h-6 object-contain"
                            />
                          )}

                          <span className="text-sm font-medium text-gray-700">
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          {/* ================= CONFIGURATIONS ================= */}
          {project.configurations?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Configurations</h2>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold">
                        Configuration
                      </th>
                      <th className="text-left p-3 text-sm font-semibold">
                        Size Range
                      </th>
                      <th className="text-left p-3 text-sm font-semibold">
                        Price
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {project.configurations.map((config) => (
                      <tr key={config.id} className="border-t">
                        <td className="p-3">{config.configuration}</td>
                        <td className="p-3">{config.size_range}</td>
                        <td className="p-3 font-semibold text-green-700">
                          {config.price}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
        <div>
          {/* ================= FLOOR PLANS ================= */}

          {project.floorplans?.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Floor Plans</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.floorplans.map((plan) => (
                  <div
                    key={plan.id}
                    className="border rounded-lg overflow-hidden bg-gray-50"
                  >
                    <img
                      src={plan.image_url}
                      className="w-full h-56 object-contain bg-white"
                    />

                    <div className="p-4">
                      <p className="font-semibold">{plan.title}</p>
                      <p className="text-sm text-gray-600">{plan.area}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-4">
          <button
            onClick={() => navigate(`/admin/edit/${id}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit Project
          </button>
          <button
            onClick={() => navigate("/admin/list")}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Back to List
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewProject;
