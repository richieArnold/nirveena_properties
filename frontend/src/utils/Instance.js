// api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://d1guf7qylta6z5.cloudfront.net/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
