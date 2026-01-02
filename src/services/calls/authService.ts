import { setToken } from "../../redux/slices/authSlice";
import { AppDispatch } from "../../redux/store";
import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";
import { VerifyOTPResponse } from "../models/AuthModel";
import { fetchUserDetails } from "./userService";


interface VerifyEmailOtpModel {
  statusCode: number;
  message: string;
  resetToken: string;
}

export const login =
  (userName: string, password: string, fcmToken: string | null, deviceId : string) =>
    async (dispatch: AppDispatch) => {
      const response = await axiosInstance.post(Endpoints.AUTH.LOGIN, {
        UserName: userName,
        Password: password,
        // platform: "APP",
        // fcmToken: fcmToken,
        // deviceId: deviceId
      });

      console.log("login response: ", response.data);

      const token = response.data.accessToken;

      dispatch(setToken(token));
      await dispatch(fetchUserDetails());

      return response.data;
    };

// Update your authService.ts with better error handling

export const forgotPassword = async (email: string): Promise<any> => {
  console.log("body email: ", email);
  
  try {
    const response = await axiosInstance.post(
      Endpoints.AUTH.emailOtp, 
      { email: email }
    );
    return response.data;
  } catch (error: any) {
    console.error('Forgot password error:', error);
    throw error;
  }
}

export const verifyEmailOtp = async (email: string, otp: string): Promise<any> => {
  console.log('=== DEBUG VERIFY OTP ===');
  console.log('Email:', email);
  console.log('OTP:', otp);
  console.log('Endpoint:', Endpoints.AUTH.verifyEmailOtp);
  console.log('Full URL:', axiosInstance.defaults.baseURL + Endpoints.AUTH.verifyEmailOtp);
  
  try {
    const response = await axiosInstance.post<VerifyEmailOtpModel>(
      Endpoints.AUTH.verifyEmailOtp, 
      { 
        email: email, 
        otp: otp 
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error response:', error.response);
    throw error;
  }
}

export const resetPassword = async (resetToken: string, newPassword: string) => {
  const response = await axiosInstance.post(Endpoints.AUTH.reset, { token: resetToken, newPassword: newPassword });
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
