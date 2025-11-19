import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

export interface PostStoryModal {
  headLine: string;
  description: string;
  media?: MediaModal[];
  attachment?: AttachmentModal[];
}

export interface AttachmentModal {
  mediaType: string
  caption: string,
  shotTime: string,
  filePath: string
}

export interface MediaModal {
  mediaType: "Photo" | "Video",
  caption: string,
  shotTime: string,
  filePath: string
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


type StoiesParams = {
  storyId?: number;
  assignmentId?: number;
}

export const postStory = async (payload: PostStoryModal, params?: StoiesParams) => {
  try {
    const response = await axiosInstance.post(Endpoints.Stories.postStory, payload, {
      params: {
        ...(params?.storyId && { storyId: params.storyId }),
        ...(params?.assignmentId && { assignmentId: params.assignmentId }),
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("postStory error:", error?.response?.data || error);
    throw error;
  }
};

export const postDraft = async (payload: PostStoryModal, params?: StoiesParams) => {
  try {

    const response = await axiosInstance.post(Endpoints.Stories.postDraft, payload, {
      params: {
        ...(params?.storyId && { storyId: params.storyId }),
        ...(params?.assignmentId && { assignmentId: params.assignmentId }),
      },
    });
    return response.data;
  } catch (error: any) {
    console.log("postDraft error:", error?.response?.data || error);
    throw error;
  }
};


export const getStories = async ({
  page,
  pageSize,
  status,
  search,
}: {
  page: number;
  pageSize: number;
  status?: string;
  search?: string;
}) => {
  try {
    const response = await axiosInstance.get(Endpoints.Stories.getStory, {
      params: {
        page,
        pageSize,
        status,
        search,
      },
    });

    return response.data;
  } catch (error) {
    console.log("getStories error: ", error);
    throw error;
  }
};
