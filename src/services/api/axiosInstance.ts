import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { persistor, store } from "../../redux/store";
import { clearToken } from "../../redux/slices/authSlice";
import { clearUserDetails } from "../../redux/slices/userSlice";
import ToastUtils from "../../utils/toast";
import RNBlobUtil from 'react-native-blob-util';
import { Endpoints } from "../endpoints/endpoints";

const baseURL = __DEV__
  ? "https://rensapi.rajexpress.com/api/v1.0/"
  : "https://rensapi.rajexpress.com/api/v1.0/";

  // ? "http://172.168.0.14:7200/api/v1.0/"
  // : "http://172.168.0.14:7200/api/v1.0/";

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


export const uploadWithBlobUtil = async (file: any) => {
  const realPath = await getRealPath(file.uri, file.name);

  try {
    const response = await RNBlobUtil
      .config({
        timeout: 1000 * 60 * 5,
      })
      .fetch(
        'POST',
        baseURL + Endpoints.IMAGE.fileUpload,
        {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${store.getState().auth.token}`,
        },
        [
          {
            name: 'file',
            filename: file.name,
            type: file.type,
            data: RNBlobUtil.wrap(realPath),
          },
        ],
      );

    const status = response.info().status;
    if (status < 200 || status >= 300) {
      throw new Error(`Upload failed with status ${status}`);
    }

    const data = response.data ? JSON.parse(response.data) : { files: [] };

    await RNBlobUtil.fs.unlink(realPath).catch(() => {});

    return data;
  } catch (err) {
    throw err;
  }
};

const getRealPath = async (uri: string, fileName: string) => {
  await cleanOldTempFiles();

  if (uri.startsWith('file://')) {
    return uri.replace('file://', '');
  }

  const destPath =
    RNBlobUtil.fs.dirs.CacheDir +
    '/upload_' +
    Date.now() +
    '_' +
    fileName;

  await RNBlobUtil.fs.cp(uri, destPath);

  return destPath;
};


const cleanOldTempFiles = async () => {
  try {
    const cacheDir = RNBlobUtil.fs.dirs.CacheDir;
    const files = await RNBlobUtil.fs.ls(cacheDir);

    for (const file of files) {
      if (file.startsWith('upload_')) {
        await RNBlobUtil.fs.unlink(`${cacheDir}/${file}`).catch(() => {});
      }
    }
  } catch {}
};