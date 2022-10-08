import axios from "axios";

const axiosInstance = axios.create();
export default axiosInstance;

// axiosInstance.interceptors.response.use(
//   (response) => response.data,
//   (error) => Promise.reject(error.response.data)
// );s