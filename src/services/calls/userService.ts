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

  fatherName: string | null
  spouseName: string | null
  husbandName: string | null

  firstChildName: string | null
  secondChildName: string | null
  thirdChildName: string | null

  zipcode: number | null
  dob: string | null
  imageUrl: string | null

  primaryMobile: string | null
  secondaryMobile: string | null
  email: string | null

  presentAddress: string | null
  permanentAddress: string | null
  education: string | null

  experience: string | null
  designation: string | null
  currentCompany: string | null
  jobLocation: string | null

  // 🔹 Bank
  bankDetails : BankDetailsResponse

  // 🔹 System / Mapping IDs
  stateId: number
  rateCardDetailsId: number | null
  divisionId: number
  districtId: number
  beatId: number
  repoterTypeId: number
  entityTypeId: number

  // 🔹 Flags
  kycCompleted: boolean
  trainingCompleted: boolean
  agreementSigned: boolean
  isDeviceBound: boolean

  // 🔹 Dates
  dateOfJoining: string | null
  trainingCompletedOn: string | null
  agreementSignedDate: string | null

  eSignStatusId: number | null
  performanceSnapshot: any | null

  createdAt: any
  userId: number

  // 🔴 REQUIRED
  kycDocuments: KycDocument[]
}

export interface BankDetailsResponse {
  accountNumber: string | null
  bankCode: string | null
  bankName: string | null
  branchName: string | null
  createdAt: string | null
  ifscCode: string | null
  phonePeNo: string | null
  status: string | null
  statusId: number | null
  verifiedAt: string | null
}

export interface UpdateReporterRequest {
  fatherName?: string | null
  zipcode?: number | null
  dob?: string | null
  imageUrl?: string | null
  secondaryMobile?: string | null
  email?: string | null

  spouseName?: string | null
  husbandName?: string | null
  firstChildName?: string | null
  secondChildName?: string | null
  thirdChildName?: string | null

  jobLocation?: string | null
  experience?: string | null
  designation?: string | null
  currentCompany?: string | null

  phonePeNo?: string | null

  accountNumber?: string | null
  bankName?: string | null
  branchName?: string | null
  ifscCode?: string | null

  presentAddress?: string | null
  permanentAddress?: string | null
  education?: string | null

  kycDocuments: KycDocument[]
}


export interface KycDocument {
  id: number
  reporterId: number
  documentName: string
  documentNumber: string
  documentUrl: string

  statusId: number
  statusCode: number
  status: 'Pending' | 'Approved' | 'Rejected'

  verifiedByUserId: number | null
  verifiedAt: string | null
  rejectionReason: string | null

  createdAt: any
  updatedAt: any
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
  console.log(body);
  
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