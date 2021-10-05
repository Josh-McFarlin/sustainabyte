import * as React from "react";
import MapView, { PROVIDER_GOOGLE, Region, Marker } from "react-native-maps";
import { Alert, Dimensions, StyleSheet, View, Text } from "react-native";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import * as Location from "expo-location";
import { LocationAccuracy } from "expo-location";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { fetchRestaurants } from "../../../actions/restaurant";
import { AuthedNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import { mapStyle } from "../../../utils/map";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "RestaurantMap">;

const RestaurantMapScreen: React.FC<PropTypes> = () => {
  const [mapRegion, setMapRegion] = React.useState<Region>({
    latitude: 33.7695028,
    longitude: -84.385734,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });
  const [selectedRest, setRestaurant] = React.useState<Restaurant | null>(null);
  const sheetRef = React.useRef<BottomSheet>(null);
  const mapRef = React.useRef<MapView>(null);
  const snapPoints = React.useMemo(() => ["25%", "60%"], []);

  const handleMarkerPress = React.useCallback(
    (restaurant) => {
      setRestaurant(restaurant);
      // sheetRef.current.expand();
      sheetRef.current.snapToIndex(0);
    },
    [sheetRef, setRestaurant]
  );

  const handleMapPress = React.useCallback(
    (event) => {
      if (event.nativeEvent.action !== "marker-press") {
        // setRestaurant(null);
        sheetRef.current.close();
      }
    },
    [sheetRef]
  );

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied!");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: LocationAccuracy.Balanced,
          distanceInterval: 20,
        },
        ({ coords }) => {
          setMapRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          });

          mapRef.current.animateToRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          });
        }
      );
    })();
  }, []);

  const { data: restaurants } = useQuery<Restaurant[], Error>(
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
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        initialRegion={mapRegion}
        onRegionChangeComplete={setMapRegion}
        onPress={handleMapPress}
      >
        {restaurants?.map((restaurant) => (
          <Marker
            key={restaurant.id}
            coordinate={restaurant.coordinates}
            title={restaurant.name}
            onPress={() => handleMarkerPress(restaurant)}
          />
        ))}
      </MapView>
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        style={styles.sheet}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          <View>
            <Text>Sel Rest: {selectedRest?.name}</Text>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
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
  sheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
});

export default RestaurantMapScreen;
