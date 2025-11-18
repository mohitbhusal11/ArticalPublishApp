import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

export const getAssignments = async ({
  page = 1,
  pageSize = 10,
  status = "",
  search = ""
}: {
  page?: number;
  pageSize?: number;
  status?: string;
  search?: string;
} = {}) => {
  try {
    const response = await axiosInstance.get(Endpoints.Assignment.assignment, {
      params: {
        page,
        pageSize,
        status,
        search,
      },
    });

    return response.data;
  } catch (error) {
    console.log("getAssignments error: ", error);
    throw error;
  }
};