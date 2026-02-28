// api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://13.61.81.114:5000",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
