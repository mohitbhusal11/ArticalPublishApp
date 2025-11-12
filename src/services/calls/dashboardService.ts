import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

export interface DashboardResponse {
    payload: DashboardCategory[];
    success: boolean;
    statusCode: number;
}

export interface DashboardCategory {
    id: number;
    title: string;
    icon: string;
    data: DashboardItem[];
}

export interface DashboardItem {
    id: number;
    title: string;
    count: number;
    discount: number;
    discountColor: string;
    icon: string;
    iconBgColor: string;
    redirectionScreen: string;
}


export const fetchDashboard = async (): Promise<DashboardResponse> => {
  try {
    const response = await axiosInstance.get<DashboardResponse>(Endpoints.Home.dashboard);
    console.log("user details response: ", response.data);
    return response.data;
  } catch (error: any) {
    console.log("fetchDashboard error:", error?.response?.data || error);
    throw error;
  }
};
