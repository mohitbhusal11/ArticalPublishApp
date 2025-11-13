import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

export interface PostStoryModal {
    headLine: string;
    description: string;
}

export interface Story {
  id: number;
  storyCode: string;
  reporterId: number;
  headline: string;
  description: string;
  categoryId: number;
  divisionId: number;
  districtId: number;
  statusId: number;
  version: string;

  amendmentReason?: string | null;
  verificationLevel?: number | null;
  verificationNote?: string | null;

  legalSensitivity?: boolean;
  legalMandatory?: boolean;
  legalMaskIdentity?: boolean;
  legalDecision?: string | null;

  duplicateFlag?: boolean;
  claimedBy?: number | null;

  releasedAt?: string | null;
  usedAt?: string | null;
  archivalLock?: boolean;
  createdAt?: string
  updatedAt?: string
  status?: string
}

export interface PaginatedStories {
  data: Story[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}


export const postStory = async (payload: PostStoryModal) => {
    try {
        const response = await axiosInstance.post(Endpoints.Stories.postStory, payload);
        return response.data;
    } catch (error: any) {
        console.log("postStory error:", error?.response?.data || error);
        throw error;
    }
};


export const getStories = async () => {
    try {
        const response = await axiosInstance.get<PaginatedStories>(Endpoints.Stories.getStory);
        return response.data
    } catch (error) {
        console.log("getStories error: ", error);
        throw error;
    }
}