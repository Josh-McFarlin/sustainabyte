import axios from "axios";

export const convertImageToBlob = async (imageUri: string): Promise<Blob> => {
  const resp = await fetch(imageUri);

  return resp.blob();
};

export interface ImageUploadInfo {
  url: string;
  fields: {
    key: string;
    acl: string;
    bucket: string;
  };
}

export const uploadImage = async (
  imageUri: string,
  uploadInfo: ImageUploadInfo
): Promise<Response> => {
  const imageBlob = await convertImageToBlob(imageUri);

  const formData = new FormData();
  Object.entries(uploadInfo.fields).forEach(([k, v]) => {
    formData.append(k, v);
  });
  formData.append("file", imageBlob);

  return axios.post(uploadInfo.url, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
