// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import {
//   Save,
//   Upload,
//   ArrowLeft,
//   Trash2,
//   X,
//   CheckCircle,
//   XCircle,
// } from "lucide-react";
// import AdminLayout from "../../components/admin/AdminLayout";
// import AlertMessage from "../../components/admin/AlertMessage";
// import axiosInstance from "../../utils/Instance";

// const EditProject = () => {
//   const navigate = useNavigate();
//   const { id } = useParams();
//   console.log(id)
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [fetchLoading, setFetchLoading] = useState(true);
//   const [message, setMessage] = useState({ type: "", text: "" });
//   const [showNotification, setShowNotification] = useState(false);
//   const [notification, setNotification] = useState({
//     type: "",
//     title: "",
//     message: "",
//     details: {},
//   });
//   const [newImages, setNewImages] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);
//   const [imagesToKeep, setImagesToKeep] = useState([]);
//   const [formData, setFormData] = useState({
//     project_id: "",
//     project_name: "",
//     project_type: "",
//     project_status: "",
//     project_location: "",
//     total_acres: "",
//     no_of_units: "",
//     club_house_size: "",
//     structure: "",
//     typology: "",
//     sba: "",
//     price: "",
//     rera_completion: "",
//     property_description: "", // ADD THIS
//   });
//   useEffect(() => {
//     const token = localStorage.getItem("adminToken");
//     const userData = localStorage.getItem("adminUser");

//     if (!token) {
//       navigate("/admin/login");
//     } else {
//       setUser(JSON.parse(userData));
//       axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//       fetchProject();
//     }
//   }, [navigate, id]);

//   const fetchProject = async () => {
//     try {
//       const response = await axiosInstance.get(
//         `/api/projects/getProject/${id}`,
//       );
//       console.log(response);
//       const project = response.data.data;
//       setFormData({
//         project_id: project.project_id || "",
//         project_name: project.project_name || "",
//         project_type: project.project_type || "",
//         project_status: project.project_status || "",
//         project_location: project.project_location || "",
//         total_acres: project.total_acres || "",
//         no_of_units: project.no_of_units || "",
//         club_house_size: project.club_house_size || "",
//         structure: project.structure || "",
//         typology: project.typology || "",
//         sba: project.sba || "",
//         price: project.price || "",
//         rera_completion: project.rera_completion || "",
//         property_description: project.property_description || "", // ADD THIS
//       });

//       const images = project.images || [];
//       setExistingImages(images);
//       setImagesToKeep(images.map((img) => img.image_url));
//     } catch (error) {
//       console.log(error);
//       setMessage({ type: "error", text: "Failed to fetch project details" });
//     } finally {
//       setFetchLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };
//   const handleImageChange = (e) => {
//     setNewImages([...e.target.files]);
//   };

//   const handleRemoveExistingImage = (index) => {
//     const removedImage = existingImages[index];
//     setExistingImages((prev) => prev.filter((_, i) => i !== index));
//     setImagesToKeep((prev) =>
//       prev.filter((url) => url !== removedImage.image_url),
//     );
//   };

//   const handleRemoveNewImage = (index) => {
//     setNewImages((prev) => prev.filter((_, i) => i !== index));
//   };

//   const showSuccessNotification = (projectName, stats) => {
//     let message = `"${projectName}" has been updated.`;
//     if (stats.images_added > 0) {
//       message += ` Added ${stats.images_added} new image(s).`;
//     }
//     if (stats.images_deleted > 0) {
//       message += ` Removed ${stats.images_deleted} old image(s).`;
//     }

//     setNotification({
//       type: "success",
//       title: "Project Updated Successfully!",
//       message: message,
//       details: stats,
//     });
//     setShowNotification(true);

//     setTimeout(() => {
//       setShowNotification(false);
//     }, 5000);
//   };

//   const showErrorNotification = (errorMsg) => {
//     setNotification({
//       type: "error",
//       title: "Failed to Update Project",
//       message: errorMsg || "An error occurred while updating the project.",
//     });
//     setShowNotification(true);

//     setTimeout(() => {
//       setShowNotification(false);
//     }, 5000);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const data = new FormData();
//     Object.keys(formData).forEach((key) => {
//       data.append(key, formData[key]);
//     });

//     data.append("existing_images", JSON.stringify(imagesToKeep));

//     newImages.forEach((image) => {
//       data.append("images", image);
//     });

//     try {
//       const response = await axiosInstance.put(
//         `/api/projects/updateProject/${id}`,
//         data,
//         { headers: { "Content-Type": "multipart/form-data" } },
//       );

//       if (response.data.success) {
//         setMessage({ type: "success", text: "Project updated successfully!" });

//         showSuccessNotification(
//           formData.project_name,
//           response.data.data?.images_updated || {},
//         );

//         setTimeout(() => navigate("/admin/list"), 2000);
//       }
//     } catch (error) {
//       console.log(error);
//       const errorMsg =
//         error.response?.data?.message || "Failed to update project";
//       setMessage({ type: "error", text: errorMsg });
//       showErrorNotification(errorMsg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (
//       !window.confirm(
//         "Are you sure you want to delete this project? This action cannot be undone.",
//       )
//     )
//       return;

//     try {
//       const response = await axiosInstance.delete(
//         `/api/projects/deleteProject/${id}`,
//       );
//       if (response.data.success) {
//         setMessage({ type: "success", text: "Project deleted successfully!" });

//         setNotification({
//           type: "success",
//           title: "Project Deleted",
//           message: `"${formData.project_name}" has been permanently deleted.`,
//         });
//         setShowNotification(true);

//         setTimeout(() => navigate("/admin/list"), 1500);
//       }
//     } catch (error) {
//       setMessage({
//         type: "error",
//         text: error.response?.data?.message || "Failed to delete project",
//       });
//     }
//   };

//   const inputClasses =
//     "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
//   const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

//   if (fetchLoading) {
//     return (
//       <AdminLayout user={user}>
//         <div className="flex justify-center py-20">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </AdminLayout>
//     );
//   }

//   return (
//     <AdminLayout user={user}>
//       {/* Custom Notification */}
//       {showNotification && (
//         <div
//           className={`fixed top-24 right-6 z-50 max-w-md w-full bg-white rounded-xl shadow-2xl border-l-4 ${
//             notification.type === "success"
//               ? "border-green-500"
//               : "border-red-500"
//           } overflow-hidden animate-slide-in`}
//         >
//           <div className="p-4">
//             <div className="flex items-start">
//               <div className="flex-shrink-0">
//                 {notification.type === "success" ? (
//                   <CheckCircle className="w-6 h-6 text-green-500" />
//                 ) : (
//                   <XCircle className="w-6 h-6 text-red-500" />
//                 )}
//               </div>
//               <div className="ml-3 flex-1">
//                 <p className="text-sm font-semibold text-gray-900">
//                   {notification.title}
//                 </p>
//                 <p className="text-sm text-gray-600 mt-1">
//                   {notification.message}
//                 </p>
//                 {notification.details && (
//                   <div className="mt-2 flex gap-2 text-xs">
//                     {notification.details.images_added > 0 && (
//                       <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
//                         +{notification.details.images_added} new
//                       </span>
//                     )}
//                     {notification.details.images_deleted > 0 && (
//                       <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
//                         -{notification.details.images_deleted} removed
//                       </span>
//                     )}
//                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
//                       {notification.details.images_kept || 0} kept
//                     </span>
//                   </div>
//                 )}
//                 <div className="mt-3 flex gap-2">
//                   <button
//                     onClick={() => navigate("/admin/list")}
//                     className="text-sm bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
//                   >
//                     View All Projects
//                   </button>
//                   <button
//                     onClick={() => setShowNotification(false)}
//                     className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
//                   >
//                     Dismiss
//                   </button>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setShowNotification(false)}
//                 className="ml-4 text-gray-400 hover:text-gray-600"
//               >
//                 <X className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//           <div
//             className={`h-1 ${notification.type === "success" ? "bg-green-500" : "bg-red-500"} animate-progress`}
//           />
//         </div>
//       )}

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/admin/list")}
//               className="p-2 hover:bg-gray-100 rounded-lg transition"
//               title="Back to List"
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </button>
//             <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
//           </div>
//           <button
//             onClick={handleDelete}
//             className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
//           >
//             <Trash2 className="w-4 h-4" />
//             Delete Project
//           </button>
//         </div>

//         <AlertMessage
//           message={message.text}
//           type={message.type}
//           onClose={() => setMessage({ type: "", text: "" })}
//         />

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white rounded-xl shadow-lg p-6"
//         >
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Project ID */}
//             <div>
//               <label className={labelClasses}>Project ID *</label>
//               <input
//                 type="number"
//                 name="project_id"
//                 value={formData.project_id}
//                 onChange={handleInputChange}
//                 required
//                 className={inputClasses}
//                 placeholder="Enter project ID"
//               />
//             </div>

//             {/* Project Name */}
//             <div>
//               <label className={labelClasses}>Project Name *</label>
//               <input
//                 type="text"
//                 name="project_name"
//                 value={formData.project_name}
//                 onChange={handleInputChange}
//                 required
//                 className={inputClasses}
//                 placeholder="Enter project name"
//               />
//             </div>

//             {/* Project Type */}
//             <div>
//               <label className={labelClasses}>Project Type</label>
//               <input
//                 type="text"
//                 name="project_type"
//                 value={formData.project_type}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., Villa, Apartment"
//               />
//             </div>

//             {/* Status */}
//             <div>
//               <label className={labelClasses}>Status</label>
//               <select
//                 name="project_status"
//                 value={formData.project_status}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//               >
//                 <option value="">Select Status</option>
//                 <option value="UC">On Going (UC/OG)</option>
//                 <option value="RTM">Ready to Move (RTM)</option>
//                 <option value="EOI">Expression of Interest (EOI)</option>
//               </select>
//             </div>

//             {/* Location */}
//             <div>
//               <label className={labelClasses}>Location</label>
//               <input
//                 type="text"
//                 name="project_location"
//                 value={formData.project_location}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="Enter location"
//               />
//             </div>

//             {/* Total Acres */}
//             <div>
//               <label className={labelClasses}>Total Acres</label>
//               <input
//                 type="text"
//                 name="total_acres"
//                 value={formData.total_acres}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., 12.5"
//               />
//             </div>

//             {/* Number of Units */}
//             <div>
//               <label className={labelClasses}>Number of Units</label>
//               <input
//                 type="number"
//                 name="no_of_units"
//                 value={formData.no_of_units}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., 120"
//               />
//             </div>

//             {/* Club House Size */}
//             <div>
//               <label className={labelClasses}>Club House Size</label>
//               <input
//                 type="text"
//                 name="club_house_size"
//                 value={formData.club_house_size}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., 25000 sq.ft"
//               />
//             </div>

//             {/* Structure */}
//             <div>
//               <label className={labelClasses}>Structure</label>
//               <input
//                 type="text"
//                 name="structure"
//                 value={formData.structure}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., G+3"
//               />
//             </div>

//             {/* Typology */}
//             <div>
//               <label className={labelClasses}>Typology</label>
//               <input
//                 type="text"
//                 name="typology"
//                 value={formData.typology}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., 3 BHK, 4 BHK"
//               />
//             </div>

//             {/* SBA */}
//             <div>
//               <label className={labelClasses}>SBA</label>
//               <input
//                 type="text"
//                 name="sba"
//                 value={formData.sba}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., 2500 - 4500 sq.ft"
//               />
//             </div>

//             {/* Price */}
//             <div>
//               <label className={labelClasses}>Price</label>
//               <input
//                 type="text"
//                 name="price"
//                 value={formData.price}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., 2.5 Cr - 4.5 Cr"
//               />
//             </div>

//             {/* RERA Completion */}
//             <div className="md:col-span-2">
//               <label className={labelClasses}>RERA Completion</label>
//               <input
//                 type="text"
//                 name="rera_completion"
//                 value={formData.rera_completion}
//                 onChange={handleInputChange}
//                 className={inputClasses}
//                 placeholder="e.g., December 2025"
//               />
//             </div>

//             {/* Property Description - NEW FIELD */}
//             <div className="md:col-span-2">
//               <label className={labelClasses}>Property Description</label>
//               <textarea
//                 name="property_description"
//                 value={formData.property_description}
//                 onChange={handleInputChange}
//                 rows="5"
//                 className={`${inputClasses} resize-y`}
//                 placeholder="Enter detailed description of the property, its features, location benefits, amenities, etc."
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Describe the property in detail - this will be displayed on the
//                 property page
//               </p>
//             </div>

//             {/* Existing Images */}
//             {existingImages.length > 0 && (
//               <div className="md:col-span-2">
//                 <label className={labelClasses}>Current Images</label>
//                 <p className="text-sm text-gray-500 mb-2">
//                   Click the X to remove images you don't want to keep
//                 </p>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {existingImages.map((img, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={img.image_url}
//                         alt={`Project ${index + 1}`}
//                         className="w-full h-24 object-cover rounded-lg border border-gray-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveExistingImage(index)}
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
//                         title="Remove image"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-gray-500 mt-2">
//                   {imagesToKeep.length} image(s) will be kept
//                 </p>
//               </div>
//             )}

//             {/* New Images Preview */}
//             {newImages.length > 0 && (
//               <div className="md:col-span-2">
//                 <label className={labelClasses}>New Images to Upload</label>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                   {Array.from(newImages).map((file, index) => (
//                     <div key={index} className="relative group">
//                       <img
//                         src={URL.createObjectURL(file)}
//                         alt={`New ${index + 1}`}
//                         className="w-full h-24 object-cover rounded-lg border-2 border-green-200"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveNewImage(index)}
//                         className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
//                         title="Remove"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                       <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
//                         New
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Upload New Images */}
//             <div className="md:col-span-2">
//               <label className={labelClasses}>Add More Images</label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
//                 <div className="text-center">
//                   <Upload className="mx-auto h-12 w-12 text-gray-400" />
//                   <div className="mt-2">
//                     <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block">
//                       <span>Choose Images</span>
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleImageChange}
//                         className="hidden"
//                       />
//                     </label>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-2">
//                     {newImages.length} new image(s) selected
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//           {/* move to features and other page */}
//           <Link to={`/admin/features/${id}`}>
//             <button
//               type="button"
//               onClick={() => navigate("/admin/list")}
//               className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//             >
//               Update Features and floor details
//             </button>
//           </Link>
//           {/* Submit Button */}
//           <div className="mt-8 flex justify-end gap-4">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/list")}
//               className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center gap-2"
//             >
//               <Save className="w-4 h-4" />
//               {loading ? "Updating..." : "Update Project"}
//             </button>
//           </div>
//         </form>
//       </div>

//       <style jsx>{`
//         @keyframes slideIn {
//           from {
//             transform: translateX(100%);
//             opacity: 0;
//           }
//           to {
//             transform: translateX(0);
//             opacity: 1;
//           }
//         }

//         @keyframes progress {
//           from {
//             width: 100%;
//           }
//           to {
//             width: 0%;
//           }
//         }

//         .animate-slide-in {
//           animation: slideIn 0.3s ease-out;
//         }

//         .animate-progress {
//           animation: progress 5s linear;
//         }
//       `}</style>
//     </AdminLayout>
//   );
// };

// export default EditProject;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Save,
  Upload,
  ArrowLeft,
  Trash2,
  X,
  CheckCircle,
  XCircle,
} from "lucide-react";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import AdminLayout from "../../components/admin/AdminLayout";
import AlertMessage from "../../components/admin/AlertMessage";
import axiosInstance from "../../utils/Instance";

const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  console.log(id)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showNotification, setShowNotification] = useState(false);
  const [notification, setNotification] = useState({
    type: "",
    title: "",
    message: "",
    details: {},
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToKeep, setImagesToKeep] = useState([]);
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
    youtube_video_url:"",
    property_description: "",
  });

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
      const project = response.data.data;

      setFormData({
        project_id: project.project_id || "",
        project_name: project.project_name || "",
        project_type: project.project_type || "",
        project_status: project.project_status || "",
        project_location: project.project_location || "",
        total_acres: project.total_acres || "",
        no_of_units: project.no_of_units || "",
        club_house_size: project.club_house_size || "",
        structure: project.structure || "",
        typology: project.typology || "",
        sba: project.sba || "",
        price: project.price || "",
        rera_completion: project.rera_completion || "",
        youtube_video_url: project.youtube_video_url || "",
        property_description: project.property_description || "",
      });

      const images = project.images || [];
      setExistingImages(images);
      setImagesToKeep(images.map((img) => img.image_url));
    } catch (error) {
      console.log(error);
      setMessage({ type: "error", text: "Failed to fetch project details" });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData({
      ...formData,
      property_description: value,
    });
  };

  const handleInputChange = (e) => {
    console.log(e.target.value)
    console.log(e.target.name)
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    setNewImages([...e.target.files]);
  };

  const handleRemoveExistingImage = (index) => {
    const removedImage = existingImages[index];
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
    setImagesToKeep((prev) =>
      prev.filter((url) => url !== removedImage.image_url),
    );
  };

  const handleRemoveNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const showSuccessNotification = (projectName, stats) => {
    let message = `"${projectName}" has been updated.`;
    if (stats.images_added > 0) {
      message += ` Added ${stats.images_added} new image(s).`;
    }
    if (stats.images_deleted > 0) {
      message += ` Removed ${stats.images_deleted} old image(s).`;
    }

    setNotification({
      type: "success",
      title: "Project Updated Successfully!",
      message: message,
      details: stats,
    });
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 5000);
  };

  const showErrorNotification = (errorMsg) => {
    setNotification({
      type: "error",
      title: "Failed to Update Project",
      message: errorMsg || "An error occurred while updating the project.",
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

    data.append("existing_images", JSON.stringify(imagesToKeep));

    newImages.forEach((image) => {
      data.append("images", image);
    });

    try {
      const response = await axiosInstance.put(
        `/api/projects/updateProject/${id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } },
      );

      if (response.data.success) {
        setMessage({ type: "success", text: "Project updated successfully!" });

        showSuccessNotification(
          formData.project_name,
          response.data.data?.images_updated || {},
        );

        setTimeout(() => navigate("/admin/list"), 2000);
      }
    } catch (error) {
      console.log(error);
      const errorMsg =
        error.response?.data?.message || "Failed to update project";
      setMessage({ type: "error", text: errorMsg });
      showErrorNotification(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this project? This action cannot be undone.",
      )
    )
      return;

    try {
      const response = await axiosInstance.delete(
        `/api/projects/deleteProject/${id}`,
      );
      if (response.data.success) {
        setMessage({ type: "success", text: "Project deleted successfully!" });

        setNotification({
          type: "success",
          title: "Project Deleted",
          message: `"${formData.project_name}" has been permanently deleted.`,
        });
        setShowNotification(true);

        setTimeout(() => navigate("/admin/list"), 1500);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to delete project",
      });
    }
  };

  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClasses = "block text-sm font-medium text-gray-700 mb-1";

  if (fetchLoading) {
    return (
      <AdminLayout user={user}>
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout user={user}>
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
                {notification.details && (
                  <div className="mt-2 flex gap-2 text-xs">
                    {notification.details.images_added > 0 && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                        +{notification.details.images_added} new
                      </span>
                    )}
                    {notification.details.images_deleted > 0 && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                        -{notification.details.images_deleted} removed
                      </span>
                    )}
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      {notification.details.images_kept || 0} kept
                    </span>
                  </div>
                )}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/list")}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Back to List"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Project
          </button>
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

            {/* Project Type */}
            <div>
              <label className={labelClasses}>Project Type</label>
              <input
                type="text"
                name="project_type"
                value={formData.project_type}
                onChange={handleInputChange}
                className={inputClasses}
                placeholder="e.g., Villa, Apartment"
              />
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
                <option value="UC">On Going (UC/OG)</option>
                <option value="RTM">Ready to Move (RTM)</option>
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

            {/* youtube video url */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">
                YouTube Property Video
              </label>
              <input
                type="text"
                name="youtube_video_url"
                value={formData.youtube_video_url || ""}
                onChange={handleInputChange}
                placeholder="Paste YouTube video link"
                className="mt-1 w-full border rounded-lg px-3 py-2"
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
                    "bold",
                    "italic",
                    "heading",
                    "|",
                    "quote",
                    "unordered-list",
                    "ordered-list",
                    "|",
                    "link",
                    "|",
                    "preview",
                    "side-by-side",
                    "fullscreen",
                    "|",
                    "guide",
                  ],
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use formatting tools to create beautiful, structured
                descriptions
              </p>
            </div>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="md:col-span-2">
                <label className={labelClasses}>Current Images</label>
                <p className="text-sm text-gray-500 mb-2">
                  Click the X to remove images you don't want to keep
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={img.image_url}
                        alt={`Project ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {imagesToKeep.length} image(s) will be kept
                </p>
              </div>
            )}

            {/* New Images Preview */}
            {newImages.length > 0 && (
              <div className="md:col-span-2">
                <label className={labelClasses}>New Images to Upload</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from(newImages).map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-green-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImage(index)}
                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-600"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-1 rounded">
                        New
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="md:col-span-2">
              <label className={labelClasses}>Add More Images</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-block">
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
                    {newImages.length} new image(s) selected
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* move to features and other page */}{" "}
          <Link to={`/admin/features/${id}`}>
            {" "}
            <button
              type="button"
              onClick={() => navigate("/admin/list")}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Update Features and floor details
            </button>
          </Link>
          {/* Submit Button */}
          <div className="mt-8 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/list")}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {loading ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>

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

export default EditProject;
