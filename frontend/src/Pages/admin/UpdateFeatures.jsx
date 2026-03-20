import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/Instance";
import AdminLayout from "../../components/admin/AdminLayout";
import { ArrowLeft, Trash2, Plus, Upload } from "lucide-react";

const UpdateFeatures = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [features, setFeatures] = useState([]);
  const [project, setProject] = useState(null);
  const [availableIcons, setAvailableIcons] = useState([]);
  const [showIconPicker, setShowIconPicker] = useState(null);
  const [configurations, setConfigurations] = useState([]);
  const [floorPlans, setFloorPlans] = useState([]);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [connectivity, setConnectivity] = useState([]);

  const [newFloorPlan, setNewFloorPlan] = useState({
    title: "",
    area: "",
    configuration_id: "",
    image: null,
  });

  const fetchConnectivity = async () => {
    try {
      const res = await axiosInstance.get(
        `/api/projects/connectivity/${project.project_id}`,
      );

      // Transform API → UI format
      const grouped = {};

      res.data.data.forEach((item) => {
        if (!grouped[item.category]) {
          grouped[item.category] = [];
        }
        grouped[item.category].push(item.description);
      });

      const formatted = Object.keys(grouped).map((cat) => ({
        category: cat,
        items: grouped[cat],
      }));

      setConnectivity(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FETCH PROJECT ---------------- */

  useEffect(() => {
    if (id) fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const res = await axiosInstance.get(`/api/projects/getProject/${id}`);
      setProject(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------------- FETCH DEPENDENT DATA ---------------- */

  useEffect(() => {
    if (project?.project_id) {
      fetchAllData();
    }
  }, [project]);

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchFeatures(),
        fetchIcons(),
        fetchConfigurations(),
        fetchFloorPlans(),
        fetchConnectivity(),
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchFeatures = async () => {
    const res = await axiosInstance.get(
      `/api/projects/${project.project_id}/features`,
    );
    setFeatures(res.data.data || []);
  };

  const fetchIcons = async () => {
    const res = await axiosInstance.get(`/api/projects/icons`);
    setAvailableIcons(res.data.data || []);
  };

  const fetchConfigurations = async () => {
    const res = await axiosInstance.get(
      `/api/projects/${project.project_id}/getProjectConfigurations`,
    );
    setConfigurations(res.data.data || []);
  };

  const fetchFloorPlans = async () => {
    const res = await axiosInstance.get(
      `/api/projects/${project.project_id}/floorplans`,
    );
    setFloorPlans(res.data.data || []);
  };

  /* ---------------- FEATURES ---------------- */

  const addFeatureGroup = () => {
    setFeatures([...features, { feature_name: "", items: [] }]);
  };

  const updateFeatureName = (index, value) => {
    const updated = [...features];
    updated[index].feature_name = value;
    setFeatures(updated);
  };

  const addFeatureItem = (groupIndex) => {
    const updated = [...features];
    updated[groupIndex].items.push({
      label: "",
      icon_url: "",
      description: "",
    });
    setFeatures(updated);
  };

  const updateFeatureItem = (groupIndex, itemIndex, value) => {
    const updated = [...features];
    updated[groupIndex].items[itemIndex].label = value;
    setFeatures(updated);
  };

  const removeFeatureItemLocal = (groupIndex, itemIndex) => {
    const updated = [...features];
    updated[groupIndex].items.splice(itemIndex, 1);
    setFeatures(updated);
  };

  const uploadIcon = async (file, groupIndex, itemIndex) => {
    const formData = new FormData();
    formData.append("icon", file);

    try {
      const res = await axiosInstance.post(
        "/api/projects/upload/icon",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      const updated = [...features];
      updated[groupIndex].items[itemIndex].icon_url = res.data.icon_url;
      setFeatures(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const saveFeatures = async () => {
    try {
      for (const feature of features) {
        if (feature.id) {
          await axiosInstance.put(`/api/projects/features/${feature.id}`, {
            feature_name: feature.feature_name,
            items: feature.items,
          });
        } else {
          await axiosInstance.post(
            `/api/projects/${project.project_id}/features`,
            {
              feature_name: feature.feature_name,
              items: feature.items.map((item) => ({
                label: item.label || "",
                icon_url: item.icon_url || null,
                description: item.description || "",
              })),
            },
          );
        }
      }

      alert("Features updated");
      fetchFeatures();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFeature = async (featureId) => {
    await axiosInstance.delete(`/api/projects/features/${featureId}`);
    fetchFeatures();
  };

  const deleteFeatureItem = async (itemId) => {
    await axiosInstance.delete(`/api/projects/feature-item/${itemId}`);
    fetchFeatures();
  };

  /* ---------------- CONFIGURATIONS ---------------- */

  const addConfiguration = () => {
    setConfigurations([
      ...configurations,
      { configuration: "", size_range: "", price: "" },
    ]);
  };

  const updateConfiguration = (index, field, value) => {
    const updated = [...configurations];
    updated[index][field] = value;
    setConfigurations(updated);
  };

  const saveConfigurations = async () => {
    try {
      for (const config of configurations) {
        if (!config.id) {
          await axiosInstance.post(
            `/api/projects/${project.project_id}/addConfiguration`,
            config,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
        }
      }

      alert("Configurations saved");
      fetchConfigurations();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteConfiguration = async (id) => {
    await axiosInstance.delete(`/api/projects/configuration/${id}`);
    fetchConfigurations();
  };

  /* ---------------- FLOOR PLAN ---------------- */

  const handleFloorPlanImage = (file) => {
    setNewFloorPlan({ ...newFloorPlan, image: file });
  };

  const uploadFloorPlan = async () => {
    const formData = new FormData();

    formData.append("title", newFloorPlan.title);
    formData.append("area", newFloorPlan.area);
    formData.append("configuration_id", newFloorPlan.configuration_id);
    formData.append("image", newFloorPlan.image);

    try {
      await axiosInstance.post(
        `/api/projects/${project.project_id}/floorplans`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert("Floor plan uploaded");
      fetchFloorPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFloorPlan = async (id) => {
    await axiosInstance.delete(`/api/projects/floorplan/${id}`);
    fetchFloorPlans();
  };
  const addConnectivityGroup = () => {
    setConnectivity([...connectivity, { category: "", items: [""] }]);
  };

  const updateConnectivityCategory = (index, value) => {
    const updated = [...connectivity];
    updated[index].category = value;
    setConnectivity(updated);
  };

  const addConnectivityItem = (groupIndex) => {
    const updated = [...connectivity];
    updated[groupIndex].items.push("");
    setConnectivity(updated);
  };

  const updateConnectivityItem = (groupIndex, itemIndex, value) => {
    const updated = [...connectivity];
    updated[groupIndex].items[itemIndex] = value;
    setConnectivity(updated);
  };

  const removeConnectivityItem = (groupIndex, itemIndex) => {
    const updated = [...connectivity];
    updated[groupIndex].items.splice(itemIndex, 1);
    setConnectivity(updated);
  };

  const saveConnectivity = async () => {
    try {
      await axiosInstance.post("/api/projects/addConnectivity", {
        project_id: project.project_id,
        connectivity,
      });

      alert("Connectivity updated");
      fetchConnectivity();
    } catch (err) {
      console.error(err);
    }
  };
  /* ---------------- UI ---------------- */

  if (fetchLoading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-2xl font-bold">Update Project Amenities</h1>
        </div>

        {/* ================= FEATURES ================= */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Amenities / Features</h2>

          <button
            onClick={addFeatureGroup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
          >
            <Plus size={16} />
            Add Feature Category
          </button>

          <div className="space-y-6">
            {features.map((feature, groupIndex) => (
              <div key={groupIndex} className="border rounded-xl p-5 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={feature.feature_name}
                    placeholder="Category Name"
                    onChange={(e) =>
                      updateFeatureName(groupIndex, e.target.value)
                    }
                    className="w-full px-3 py-2 border rounded-lg"
                  />

                  {feature.id && (
                    <button
                      onClick={() => deleteFeature(feature.id)}
                      className="ml-3 text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                {feature.items?.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3 mb-3">
                    {item.icon_url ? (
                      <img src={item.icon_url} className="w-8 h-8" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded" />
                    )}

                    <div className="flex flex-col flex-1 gap-1">
                      <input
                        value={item.label || ""}
                        placeholder="Feature"
                        onChange={(e) =>
                          updateFeatureItem(
                            groupIndex,
                            itemIndex,
                            e.target.value,
                          )
                        }
                        className="border px-3 py-2 rounded"
                      />

                      <input
                        value={item.description || ""}
                        placeholder="Description"
                        onChange={(e) => {
                          const updated = [...features];
                          updated[groupIndex].items[itemIndex].description =
                            e.target.value;
                          setFeatures(updated);
                        }}
                        className="border px-3 py-2 rounded text-sm"
                      />
                    </div>

                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-2 rounded flex items-center gap-2">
                      <Upload size={14} />
                      Upload
                      <input
                        type="file"
                        hidden
                        onChange={(e) =>
                          uploadIcon(e.target.files[0], groupIndex, itemIndex)
                        }
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setShowIconPicker(`${groupIndex}-${itemIndex}`)
                      }
                      className="bg-gray-100 px-3 py-2 rounded text-sm"
                    >
                      Choose Icon
                    </button>

                    {showIconPicker === `${groupIndex}-${itemIndex}` && (
                      <div className="grid grid-cols-8 gap-2 mt-3 p-3 border rounded-lg bg-gray-50">
                        {availableIcons.map((icon, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              const updated = [...features];
                              updated[groupIndex].items[itemIndex].icon_url =
                                icon.url;
                              setFeatures(updated);
                              setShowIconPicker(null);
                            }}
                          >
                            <img src={icon.url} className="w-6 h-6" />
                          </button>
                        ))}
                      </div>
                    )}

                    {item.id ? (
                      <button
                        onClick={() => deleteFeatureItem(item.id)}
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          removeFeatureItemLocal(groupIndex, itemIndex)
                        }
                        className="text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                ))}

                <button
                  onClick={() => addFeatureItem(groupIndex)}
                  className="text-blue-600 text-sm"
                >
                  + Add Item
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={saveFeatures}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
          >
            Save Features
          </button>
        </div>

        {/* ================= CONFIG ================= */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Configurations</h2>

          {configurations.map((config, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-3">
              <input
                value={config.configuration}
                placeholder="Configuration"
                onChange={(e) =>
                  updateConfiguration(index, "configuration", e.target.value)
                }
                className="border px-3 py-2 rounded"
              />

              <input
                value={config.size_range}
                placeholder="Size Range"
                onChange={(e) =>
                  updateConfiguration(index, "size_range", e.target.value)
                }
                className="border px-3 py-2 rounded"
              />

              <input
                value={config.price}
                placeholder="Price"
                onChange={(e) =>
                  updateConfiguration(index, "price", e.target.value)
                }
                className="border px-3 py-2 rounded"
              />

              <button
                onClick={() => deleteConfiguration(config.id)}
                className="text-red-500"
              >
                <Trash2 />
              </button>
            </div>
          ))}

          <div className="flex gap-4 mt-4">
            <button
              onClick={addConfiguration}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus size={16} />
              Add Configuration
            </button>

            <button
              onClick={saveConfigurations}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Save Configurations
            </button>
          </div>
        </div>

        {/* ================= FLOOR ================= */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Floor Plans</h2>

          <div className="border p-4 rounded bg-white mb-6 space-y-3">
            <input
              placeholder="Title"
              value={newFloorPlan.title}
              onChange={(e) =>
                setNewFloorPlan({ ...newFloorPlan, title: e.target.value })
              }
              className="border px-3 py-2 rounded w-full"
            />

            <input
              placeholder="Area"
              value={newFloorPlan.area}
              onChange={(e) =>
                setNewFloorPlan({ ...newFloorPlan, area: e.target.value })
              }
              className="border px-3 py-2 rounded w-full"
            />

            <select
              value={newFloorPlan.configuration_id}
              onChange={(e) =>
                setNewFloorPlan({
                  ...newFloorPlan,
                  configuration_id: e.target.value,
                })
              }
              className="border px-3 py-2 rounded w-full"
            >
              <option value="">Select Configuration</option>
              {configurations.map((config) => (
                <option key={config.id} value={config.id}>
                  {config.configuration}
                </option>
              ))}
            </select>

            <input
              type="file"
              onChange={(e) => handleFloorPlanImage(e.target.files[0])}
            />

            <button
              onClick={uploadFloorPlan}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Upload Floor Plan
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {floorPlans.map((plan) => (
              <div key={plan.id} className="border rounded p-3 bg-white">
                <img src={plan.image_url} className="h-40 w-full mb-2" />
                <p>{plan.title}</p>
                <p>{plan.area}</p>
                <button
                  onClick={() => deleteFloorPlan(plan.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* ================= CONNECTIVITY ================= */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Connectivity</h2>

          <button
            onClick={addConnectivityGroup}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
          >
            <Plus size={16} />
            Add Category
          </button>

          <div className="space-y-6">
            {connectivity.map((group, groupIndex) => (
              <div key={groupIndex} className="border rounded-xl p-5 bg-white">
                <input
                  type="text"
                  value={group.category}
                  placeholder="Category (e.g. Strategic Connectivity)"
                  onChange={(e) =>
                    updateConnectivityCategory(groupIndex, e.target.value)
                  }
                  className="w-full px-3 py-2 border rounded-lg mb-4"
                />

                {group.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex gap-3 mb-2">
                    <input
                      value={item}
                      placeholder="e.g. Sarjapur Road – 2 mins"
                      onChange={(e) =>
                        updateConnectivityItem(
                          groupIndex,
                          itemIndex,
                          e.target.value,
                        )
                      }
                      className="flex-1 border px-3 py-2 rounded"
                    />

                    <button
                      onClick={() =>
                        removeConnectivityItem(groupIndex, itemIndex)
                      }
                      className="text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => addConnectivityItem(groupIndex)}
                  className="text-blue-600 text-sm mt-2"
                >
                  + Add Item
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={saveConnectivity}
            className="mt-4 bg-green-600 text-white px-5 py-2 rounded"
          >
            Save Connectivity
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UpdateFeatures;
