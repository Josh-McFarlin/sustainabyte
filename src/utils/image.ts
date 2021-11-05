export const convertImageToBlob = async (imageUri: string): Promise<Blob> => {
  const resp = await fetch(imageUri);

  return resp.blob();
};

export const uploadImage = async (
  imageUri: string,
  uploadUrl: string
): Promise<Response> => {
  const imageBlob = await convertImageToBlob(imageUri);

  return fetch(uploadUrl, {
    method: "PUT",
    body: imageBlob,
  });
};
