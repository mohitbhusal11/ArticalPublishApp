import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

export interface AssignmentsResponse {
  data: Assignment[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface Assignment {
  id: number;
  assignmentCode: string;
  title: string;
  brief: string;
  geoLocation: string | null;
  dueBy: string | null;
  proposedBy: string | null;
  postedTo: string | null;
  statusId: number | null;
  createdAt: string;
  reporterStatusId: number;
  status: string;
  isAccepted: boolean;
  acceptedAt: string | null;
}

export interface GetAssignmentsParams {
  page?: number;
  pageSize?: number;
  status?: "Pending" | "Accepted" | "Submited" | "Rejected";
  search?: string;
}

export const getAssignments = async (params: GetAssignmentsParams = {}) => {
  try {
    const response = await axiosInstance.get<AssignmentsResponse>(Endpoints.Assignment.assignment, {
      params: {
        page: params.page ?? 1,
        pageSize: params.pageSize ?? 10,
        status: params.status ?? "",
        search: params.search ?? "",
      },
    });

    return response.data;
  } catch (error) {
    console.log("getAssignments error:", error);
    throw error;
  }
};