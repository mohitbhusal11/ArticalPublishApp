import axiosInstance from "../api/axiosInstance";
import { Endpoints } from "../endpoints/endpoints";

interface UploadedFile {
    url: string;
    originalName: string;
    savedAs: string;
    size: number;
    mimetype: string;
    folder: string;
}

interface UploadResponse {
    message: string;
    files: UploadedFile[];
}

interface DeleteFileBody {
    fileKey: string
}


export const fileUpload = async (formData: FormData) => {
    try {
        const url = Endpoints.IMAGE.fileUpload;

        const response = await axiosInstance.post<UploadResponse>(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
};

export const deleteFile = async (payload: DeleteFileBody) => {
    try {
        const response = await axiosInstance.delete(Endpoints.IMAGE.deleteFile, { data: payload });
        console.log("Delete API Response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Delete API Error:", error);
        throw error;
    }
};

