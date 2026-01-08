import { AppDispatch } from "../../redux/store";
import { setUserDetails, clearUserDetails } from "../../redux/slices/userSlice";
import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";
import { DeleteUserResponse, User } from "../types/User";
import axios from "axios";

export interface ReporterResponse {
  id: number
  reporterCode: string
  fullName: string
  fatherName: string
  zipcode: number
  dob: string
  imageUrl: string
  primaryMobile: string
  secondaryMobile: string
  email: string

  stateId: number
  rateCardDetailsId: number
  divisionId: number
  districtId: number
  beatId: number
  repoterTypeId: number
  entityTypeId: number

  kycCompleted: boolean
  trainingCompleted: boolean

  accountNumber: string
  bankName: string
  branchName: string
  ifscCode: string

  presentAddress: string
  permanentAddress: string
  education: string
  experience: string
  designation: string

  eSignStatusId: number | null
  trainingCompletedOn: string | null
  isDeviceBound: boolean
  performanceSnapshot: string

  createdAt: string | null
  userId: number

  kycDocuments: KycDocument[]
}

export interface UpdateReporterRequest {
  fatherName?: string | null
  zipcode?: number | null
  dob?: string | null
  imageUrl?: string | null
  secondaryMobile?: string | null
  email?: string | null

  accountNumber?: string | null
  bankName?: string | null
  branchName?: string | null
  ifscCode?: string | null

  presentAddress?: string | null
  permanentAddress?: string | null
  education?: string | null
  experience?: string | null

  // 🔴 backend requires this ALWAYS
  kycDocuments: KycDocument[]
}

export interface KycDocument {
  id?: number
  DocumentName: string
  DocumentNumber: string
  DocumentUrl: string
}

export interface KycTypeItem {
  id: number
  type: number
  code: string
  value: string
  deleted: boolean
  isActive: boolean
  unitId: number | null
}

export interface KycTypeResponse {
  data: KycTypeItem[]
  page: number
  pageSize: number
  total: number
  totalPages: number
}

export interface IfscResponse {
  BANK: string
  BRANCH: string
  IFSC: string
  CITY: string
  STATE: string
}

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

export const getReporterDetails = async (): Promise<ReporterResponse> => {
  try {
    const response = await axiosInstance.get(
      Endpoints.USER.REPORTER
    )

    console.log('GET reporter details:', response.data)
    return response.data
  } catch (error: any) {
    console.log(
      'getReporterDetails error:',
      error?.response?.data || error
    )
    throw error
  }
}

export const putReporterDetails = async (
  body: UpdateReporterRequest
): Promise<ReporterResponse> => {
  try {
    const response = await axiosInstance.put(
      Endpoints.USER.REPORTER,
      body
    )

    console.log('PUT reporter response:', response.data)
    return response.data
  } catch (error: any) {
    console.log(
      'putReporterDetails error:',
      error?.response?.data || error
    )
    throw error
  }
}



export const getRequiredKycTypes = async (): Promise<KycTypeResponse> => {
  const response = await axiosInstance.get(Endpoints.USER.KYC_MASTER)
  console.log('GET KYC types:', response.data)
  return response.data
}

export const fetchBankByIfsc = async (
  ifsc: string
): Promise<IfscResponse> => {
  const response = await axios.get(
    `https://ifsc.razorpay.com/${ifsc}`
  )
  return response.data
}