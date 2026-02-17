import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const getProperties = async () => {
  const response = await api.get("/api/projects");
  return response.data.data; // ✅ return only the array
};

