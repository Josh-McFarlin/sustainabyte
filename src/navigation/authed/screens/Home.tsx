import * as React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import * as Location from "expo-location";
import { useAuth } from "../../../utils/auth";
import { fetchRestaurants } from "../../../actions/restaurant";
import type { AuthedNavParamList } from "../types";
import { Coordinates } from "../../../types/Location";
import { Restaurant } from "../../../types/Restaurant";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Home">;

const HomeScreen: React.FC<PropTypes> = () => {
  const { user } = useAuth();
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>(
    null
  );

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied!");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});

      setCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  const {
    isLoading,
    isError,
    data: restaurants,
    error,
  } = useQuery<Restaurant[], Error>(
    ["restaurants", coordinates],
    fetchRestaurants,
    {
      enabled: coordinates != null,
    }
  );

  return (
    <View style={styles.container}>
      <Text>Home Screen</Text>
      <Text>Hello {user.email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default HomeScreen;
