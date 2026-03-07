import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const getProperties = async () => {
  const response = await api.get("/api/projects");
  return response.data.data; 
};
export const addProject = async (formData) => await api.post('/projects/addProject', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});

