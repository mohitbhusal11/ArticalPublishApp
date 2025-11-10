import { setToken } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";
import { ForgotOTPResponse, VerifyOTPResponse } from "../models/AuthModel";
import { fetchUserDetails } from "./userService";

export const login =
  (userName: string, password: string, fcmToken: string | null, deviceId : string) =>
    async (dispatch: AppDispatch) => {
      const response = await axiosInstance.post(Endpoints.AUTH.LOGIN, {
        UserName: userName,
        Password: password,
        // clientType: "mobile",
        // fcmToken: fcmToken,
        // deviceId: deviceId
      });

      console.log("login response: ", response.data);

      const token = response.data.accessToken;

      dispatch(setToken(token));
      await dispatch(fetchUserDetails());

      return response.data;
    };

export const forgotPassword = async (userName: string) => {
  const response = await axiosInstance.post<ForgotOTPResponse>(Endpoints.AUTH.SENDOTP, { userName: userName });
  return response.data
}

export const verifyOtp = async (userName: string, otp: string) => {
  const response = await axiosInstance.post<VerifyOTPResponse>(Endpoints.AUTH.verifyOtp, { userName: userName, otp: otp });
  return response.data
}

export const resetPassword = async (userName: string, newPassword: string) => {
  const response = await axiosInstance.post<VerifyOTPResponse>(Endpoints.AUTH.reset, { userName: userName, NewPassword: newPassword });
  return response.data
}

export const changePassword = async (userName: string, newPassword: string, currentPassword: string) => {
  const response = await axiosInstance.post<VerifyOTPResponse>(Endpoints.AUTH.changePassword, { userName: userName, NewPassword: newPassword, CurrentPassword: currentPassword });
  return response.data
}


export const logout = async () => {
  const response = await axiosInstance.post(Endpoints.AUTH.LOGOUT);
  return response.data
};
