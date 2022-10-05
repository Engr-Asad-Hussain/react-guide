import axios from "axios";

const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error.response.data)
);

export default axiosInstance;
