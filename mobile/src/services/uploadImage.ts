import { ImagePickerAsset } from "expo-image-picker";
import { Platform } from "react-native";

import { api } from "@/services/api";

export async function uploadImage(asset: ImagePickerAsset) {
  const formData = new FormData();

  if (Platform.OS === "web" && asset.file) {
    formData.append("image", asset.file);
  } else {
    formData.append(
      "image",
      {
        uri: asset.uri,
        name: asset.fileName || `image-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      } as unknown as Blob,
    );
  }

  const response = await api.post("/uploads/images", formData, {
    timeout: 30000,
  });

  return response.data.data.url as string;
}
