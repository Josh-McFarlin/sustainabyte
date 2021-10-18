import { geocodeAsync } from "expo-location";
import { Address, Location } from "../types/Location";

const formatAddress = (address: Address): string => {
  if (address == null) {
    throw new Error("Invalid address!");
  }

  return `${address.street}, ${address.city}, ${address.state} ${address.zipCode}`;
};

export const lookupAddress = async (address: Address): Promise<Location> => {
  try {
    const formatted = formatAddress(address);
    const results = await geocodeAsync(formatted);

    if (results.length === 0) {
      throw new Error("Address does not exist!");
    }

    return {
      address,
      coordinates: {
        latitude: results[0].latitude,
        longitude: results[0].longitude,
      },
    };
  } catch (error) {
    throw new Error("Failed to lookup address!");
  }
};
