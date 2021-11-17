import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";
import mime from "mime";
import { authRequest } from "./request";
import urls from "./urls";

export interface ImageUploadInfo {
  url: string;
  fields: {
    key: string;
    acl: string;
    bucket: string;
  };
}

export const getContentType = (fileUri: string): string =>
  fileUri.startsWith("data:")
    ? fileUri.substring(fileUri.indexOf(":") + 1, fileUri.indexOf(";"))
    : mime.getType(fileUri);

export const requestUpload = async (
  contentTypes: string[]
): Promise<
  {
    fileUrl: string;
    uploadUrl: ImageUploadInfo;
  }[]
> => {
  const { data: json } = await authRequest.get(`${urls.api}/image`, {
    params: {
      contentTypes,
    },
  });

  return json.photoUrls;
};

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
