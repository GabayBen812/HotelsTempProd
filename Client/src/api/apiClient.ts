import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_BASE_API || "http://localhost:3101";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default apiClient;
