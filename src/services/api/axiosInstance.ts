import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { persistor, store } from "../../redux/store";
import { clearToken } from "../../redux/slices/authSlice";
import { clearUserDetails } from "../../redux/slices/userSlice";
import ToastUtils from "../../utils/toast";

const baseURL = __DEV__
  ? "http://172.168.0.14:7200/api/v1.0/"
  // ? "http://172.168.0.14:7200/"
  : "http://172.168.0.14:7200/api/v1.0/";


export const imageBaseURL = __DEV__ ? "http://172.168.0.14:8089" : "https://assets.rajfacilitymanagement.com";

const axiosInstance = axios.create({
  baseURL,
  // timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    "X-Client-Type": "mobile",
    "x-api-key": "cyezieny2h"
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.url?.includes("/auth/login")) {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleApiError = async (error: AxiosError) => {
  if (error.code === "ECONNABORTED") {
    ToastUtils.error("Request timed out. Please try again.");
    return;
  }

  const status = error.response?.status;

  switch (status) {
    case 400:
      ToastUtils.error("Bad request. Please check your input.");
      break;
    case 401:
      store.dispatch(clearToken());
      store.dispatch(clearUserDetails());
      await persistor.purge();
      ToastUtils.error("Session expired. Please log in again.");
      break;
    case 403:
      ToastUtils.error("You don’t have permission to perform this action.");
      break;
    case 404:
      ToastUtils.error("Requested resource not found.");
      break;
    case 409:
      ToastUtils.error({
        message: 'Log out from other device or contact IT support',
        title: 'Account active on another device',
        duration: 5000,
        numberOfLines: 0
      });
      break;
    case 500:
      ToastUtils.info("Internal server error. Please try later.");
      break;
    default:
      console.error("API Error:", error.message || status || "Unknown error");
      ToastUtils.error("Something went wrong. Please try again.");
      break;
  }
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    await handleApiError(error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
