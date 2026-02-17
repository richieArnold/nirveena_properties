const handlePropertyClick = async (prop) => {
  try {
    setLoading(true);

    const res = await axiosInstance.get(`/api/projects/${prop.slug}`);

    setSelectedProp(res.data.data); // full project
    setIsDetailModalOpen(true);
  } catch (err) {
    console.error("Failed to fetch project details:", err);
  } finally {
    setLoading(false);
  }
};

export default handlePropertyClick;