import axios from "axios";

const axiosInstance = axios.create();
export default axiosInstance;

// axiosInstance.interceptors.response.use(
//   (response) => response.data,
//   (error) => Promise.reject(error.response.data)
// );s

/**
 * We are going to attach something called interceptors to this axios private
 * That will actually attach the jwt tokens for us
 * And even retry when we get failure the first time. The failure will come back with a status of 403 which is forbidden
 * These interceptors are going to work with jwt tokens to refresh the token if our initial request is denied due to an expired token
 * So this all works in the background and it wouldn't impact the users inside the app they wouldn't see whats happening
 * But it will keep every thing secure and will continue to refresh tokens on a set schedules
 * 
 * Following will attached to every request from axios private instance
 */
export const axiosPrivate = axios.create({
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true,
})