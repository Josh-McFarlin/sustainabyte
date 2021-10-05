import * as React from "react";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";
import { Alert, Dimensions, StyleSheet, View } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import { fetchRestaurants } from "../../../actions/restaurant";
import { AuthedNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import { mapStyle } from "../../../utils/map";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "RestaurantMap">;

const RestaurantMapScreen: React.FC<PropTypes> = () => {
  const [mapRegion, setMapRegion] = React.useState<Region>({
    latitude: 33.773506,
    longitude: -84.388854,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied!");
        return;
      }

      await Location.watchPositionAsync(
        { accuracy: LocationAccuracy.Balanced },
        ({ coords }) => {
          setMapRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          });
        }
      );
    })();
  }, []);

  const {
    isLoading,
    isError,
    data: restaurants,
    error,
  } = useQuery<Restaurant[], Error>(
    [
      "restaurants",
      {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude,
      },
    ],
    fetchRestaurants,
    {
      initialData: [],
    }
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        region={mapRegion}
        onRegionChangeComplete={setMapRegion}
      >
        {restaurants?.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={restaurant.coordinates}
            title={restaurant.name}
          />
        ))}
      </MapView>
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
