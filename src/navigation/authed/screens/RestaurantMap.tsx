import * as React from "react";
import MapView from "react-native-maps";
import { StyleSheet, View, Dimensions, Alert } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import * as Location from "expo-location";
import { fetchRestaurants } from "../../../actions/restaurant";
import { AuthedNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import { Coordinates } from "../../../types/Location";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "RestaurantMap">;

const RestaurantMapScreen: React.FC<PropTypes> = () => {
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
      <MapView style={styles.map} />
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
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default RestaurantMapScreen;
