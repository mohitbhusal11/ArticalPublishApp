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
  deadlineAt: string;
  reporterStatusId: number;
  status: string;
  isAccepted: boolean;
  acceptedAt: string | null;
}

export interface UpdateAssignmentResponse {
  message: string,
  assignment : AssignmentUpdate
}
export interface AssignmentUpdate {
  reporterId?: number;
  assignmentId?: number;
  acceptedAt?: number;
  isAccepted?: boolean;
  statusId?: number;

} 

export interface GetAssignmentsParams {
  page?: number;
  pageSize?: number;
  status?: "Pending" | "Accepted" | "Submited" | "Rejected";
  search?: string;
}

export interface UpdateAssignmentModal {
  assignmentId: number;
  isAccepted: boolean
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

export const updateAssignment = async (payload: UpdateAssignmentModal) => {
  try {
    const response = await axiosInstance.post<UpdateAssignmentResponse>(Endpoints.Assignment.statusUpdate, payload);
    return response.data;
  } catch (error) {
    console.log("getAssignments error:", error);
    throw error;
  }
}; 