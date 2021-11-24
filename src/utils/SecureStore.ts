import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

if (Platform.OS === "web") {
  /*
  Previous commits said this should never be used in production
  It is ok to use in production since it is only being used for storing
  JWTs and localstorage is an acceptable place to store JWTs
  (especially since the JWT does not contain any PII)
   */
  console.info(
    "WARNING:\n" +
      "SecureStore has been imported within a web context.\n" +
      "Please pay attention to the context it is used within!"
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
