import axios from "axios";

const baseApiUrl = import.meta.env.VITE_API_URL || "/api";

export const axiosInstance = axios.create({
  baseURL: baseApiUrl,
  withCredentials: true,
});