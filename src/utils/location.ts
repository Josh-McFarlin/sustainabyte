import * as React from "react";
import { Alert } from "react-native";
import {
  geocodeAsync,
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
  LocationAccuracy,
  watchPositionAsync,
  LocationOptions,
} from "expo-location";
import { Address, Coordinates, Location } from "../types/Location";

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

export const useLocation = (): Coordinates => {
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>({
    latitude: 33.7695028,
    longitude: -84.385734,
  });

  React.useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied!");
        return;
      }

      const { coords } = await getCurrentPositionAsync({});

      setCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  return coordinates;
};

export const useCurrentLocation = (
  options: LocationOptions = {
    accuracy: LocationAccuracy.Balanced,
    timeInterval: 60000,
    distanceInterval: 200,
  }
): Coordinates => {
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>({
    latitude: 33.7695028,
    longitude: -84.385734,
  });

  React.useEffect(() => {
    (async () => {
      const { status } = await requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied!");
        return;
      }

      await watchPositionAsync(options, ({ coords }) => {
        setCoordinates({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      });
    })();
  }, [options]);

  return coordinates;
};
