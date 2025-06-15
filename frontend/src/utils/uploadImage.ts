import { API_PATHS } from "./apiPaths";
import axiosInstance from "./axios";

interface UploadResponse {
  imageUrl: string;
}

const uploadImage = async (imageFile: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  try {
    const response = await axiosInstance.post<UploadResponse>(
      API_PATHS.IMAGE.UPLOAD_IMAGE,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading the image", error);
    throw error;
  }
};

export default uploadImage;
