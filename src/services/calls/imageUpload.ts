import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

interface ImageUploadResponse {
    imageUrl: string
}

export const complaintRegisterUploadImage = async (photo: any, unitId: string) => {
    try {
        const formData = new FormData();

        formData.append("file", {
            uri: photo.uri,
            type: photo.type || "image/jpeg",
            name: photo.fileName || "photo.jpg",
        });

        const url = `${Endpoints.IMAGE.imageUploadComplaintRegister}?folderName=complaint&identity=${unitId}`;

        const response = await axiosInstance.post<ImageUploadResponse>(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Image upload failed:", error);
        throw error;
    }
};
