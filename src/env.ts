import { BASE_URL, BASE_URL_DEV, X_API_KEY } from "@env";


console.log("BASE_URL:", BASE_URL);
console.log("BASE_URL_DEV:", BASE_URL_DEV);
console.log("X_API_KEY:", X_API_KEY);

export const API_BASE_URL = __DEV__
  ? BASE_URL_DEV ?? ""
  : BASE_URL ?? "";

export const API_KEY = X_API_KEY ?? "";
