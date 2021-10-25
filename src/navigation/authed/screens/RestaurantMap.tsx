import * as React from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Marker as MarkerBase,
} from "react-native-maps";
import { Dimensions, StyleSheet, SafeAreaView, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import BottomSheet from "@gorhom/bottom-sheet";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import RestaurantSheet from "../../../components/RestaurantSheet";
import { TabNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import type { Coordinates } from "../../../types/Location";
import { mapStyle } from "../../../utils/map";

type PropTypes = BottomTabScreenProps<TabNavParamList, "RestaurantMap">;
const Marker = MarkerBase || (MapView as any).Marker;

const RestaurantMapScreen: React.FC<PropTypes> = () => {
  const coordinates = useLocation();
  const [mapRegion, setMapRegion] = React.useState<Region>({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });
  const [searchRegion, setSearchRegion] = React.useState<Coordinates>({
    latitude: mapRegion.latitude,
    longitude: mapRegion.longitude,
  });
  const [selectedRest, setRestaurant] = React.useState<Restaurant | null>(null);
  const sheetRef = React.useRef<BottomSheet>(null);
  const mapRef = React.useRef<MapView>(null);

  const { data: restaurants, refetch } = useQuery<Restaurant[], Error>(
    ["restaurants", searchRegion],
    fetchRestaurants,
    {
      initialData: [],
    }
  );

  React.useEffect(() => {
    mapRef?.current?.animateToRegion({
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: 0.04,
      longitudeDelta: 0.05,
    });
  }, [coordinates.latitude, coordinates.longitude]);

  const handleMarkerPress = React.useCallback(
    (restaurant) => {
      setRestaurant(restaurant);
      sheetRef.current.snapToIndex(0);
    },
    [sheetRef, setRestaurant]
  );

  const handleMapPress = React.useCallback(
    (event) => {
      if (event?.nativeEvent?.action === "marker-press") {
        return;
      }

      // setRestaurant(null);
      sheetRef.current.close();
    },
    [sheetRef]
  );

  const handleSearchPress = React.useCallback(() => {
    setSearchRegion(mapRegion);
    refetch();
  }, [mapRegion, refetch]);

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        initialRegion={mapRegion}
        onRegionChangeComplete={setMapRegion}
        onPress={handleMapPress}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        options={{
          disableDefaultUI: true,
        }}
      >
        {restaurants?.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={restaurant.coordinates}
            onPress={() => handleMarkerPress(restaurant)}
          />
        ))}
      </MapView>
      {(mapRegion.longitude !== searchRegion.longitude ||
        mapRegion.latitude !== searchRegion.latitude) && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleSearchPress}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Search This Area</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <RestaurantSheet ref={sheetRef} restaurant={selectedRest} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
    position: "relative",
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    position: "absolute",
    left: 0,
    top: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    backgroundColor: "#fff",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 32,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#000",
  },
});

export default RestaurantMapScreen;
