import { AppDispatch } from "../../redux/store";
import { setUserDetails, clearUserDetails } from "../../redux/slices/userSlice";
import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";
import { DeleteUserResponse, User } from "../types/User";

export const fetchUserDetails = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axiosInstance.get<User>(Endpoints.USER.PROFILE);
    console.log("user details response: ", response.data);
    dispatch(setUserDetails(response.data));
    return response.data;
  } catch (error: any) {
    console.log("fetchUserDetails error:", error?.response?.data || error);
    dispatch(clearUserDetails());
    throw error;
  }
};

export const clearUser = () => (dispatch: AppDispatch) => {
  dispatch(clearUserDetails());
};

export const deleteUserDetails = async (id: number) => {
    const response = await axiosInstance.delete<DeleteUserResponse>(`${Endpoints.DeleteUser.DeleteUser}/${id}`)
    return response.data
}