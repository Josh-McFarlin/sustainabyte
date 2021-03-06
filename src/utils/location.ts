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
import PostalAddress from "i18n-postal-address";
import { AddressType, CoordinatesType, LocationType } from "../types/Location";

export const formatAddress = (address: AddressType): string => {
  if (address == null) {
    throw new Error("Invalid address!");
  }

  return new PostalAddress()
    .setAddress1(address.street)
    .setCity(address.city)
    .setState(address.state)
    .setCountry(address.country)
    .setPostalCode(address.zipCode?.toString() || "")
    .setFormat({
      country: "US",
      type: "business",
      useTransforms: false,
    })
    .toString()
    .replaceAll("\n", ", ");
};

export const lookupAddress = async (
  address: AddressType
): Promise<LocationType> => {
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

export const useLocation = (): CoordinatesType => {
  const [coordinates, setCoordinates] = React.useState<CoordinatesType | null>({
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
): CoordinatesType => {
  const [coordinates, setCoordinates] = React.useState<CoordinatesType | null>({
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

export const distanceBetween = (
  one: CoordinatesType,
  two: CoordinatesType
): number => {
  // https://stackoverflow.com/a/365853
  const lat = (one.latitude * Math.PI) / 180;
  const lon = (two.latitude * Math.PI) / 180;
  const dLat = ((two.latitude - one.latitude) * Math.PI) / 180;
  const dLon = ((two.longitude - one.longitude) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat) * Math.cos(lon) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return c * 3959;
};
