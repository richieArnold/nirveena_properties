// api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "https://api.nirveena.com/",
  baseURL: "http://localhost:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
