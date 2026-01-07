import { BASE_URL, BASE_URL_DEV, X_API_KEY } from "@env";


console.log("BASE_URL:", BASE_URL);
console.log("BASE_URL_DEV:", BASE_URL_DEV);
console.log("X_API_KEY:", X_API_KEY);

export const API_BASE_URL = "http://172.168.5.173:7200/api/v1.0/"
  // ? BASE_URL_DEV ?? ""
  // : BASE_URL ?? "";

export const API_KEY = X_API_KEY ?? "";
