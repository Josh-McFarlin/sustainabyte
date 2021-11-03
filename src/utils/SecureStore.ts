import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

if (Platform.OS === "web") {
  console.error(
    "WARNING:\n" +
      "SecureStore has been imported within a web context.\n" +
      "This is not a secure operation, and should be used for local testing only!\n" +
      "This should not be released within a production environment."
  );
}

export const setItemAsync = async (
  key: string,
  value: string,
  options?: SecureStore.SecureStoreOptions
): Promise<void> => {
  if (Platform.OS === "web") {
    return AsyncStorage.setItem(key, value);
  }

  return SecureStore.setItemAsync(key, value, options);
};

export const getItemAsync = async (
  key: string,
  options?: SecureStore.SecureStoreOptions
): Promise<string> => {
  if (Platform.OS === "web") {
    return AsyncStorage.getItem(key);
  }

  return SecureStore.getItemAsync(key, options);
};

export const deleteItemAsync = async (
  key: string,
  options?: SecureStore.SecureStoreOptions
): Promise<void> => {
  if (Platform.OS === "web") {
    return AsyncStorage.removeItem(key);
  }

  return SecureStore.deleteItemAsync(key, options);
};
