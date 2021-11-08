import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

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
): Promise<void> => {
  if (Platform.OS === "web") {
    const imageBlob = await fetch(imageUri).then((res) => res.blob());

    const formData = new FormData();
    Object.entries(uploadInfo.fields).forEach(([k, v]) => {
      formData.append(k, v);
    });
    formData.append("file", imageBlob);

    await fetch(uploadInfo.url, {
      method: "POST",
      body: formData,
    });
  } else {
    await FileSystem.uploadAsync(uploadInfo.url, imageUri, {
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
      parameters: uploadInfo.fields,
    });
  }
};
