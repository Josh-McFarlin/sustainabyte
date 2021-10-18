import * as React from "react";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Marker as MarkerBase,
} from "react-native-maps";
import {
  Alert,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  Text,
  View,
  Image,
  ScrollView,
} from "react-native";
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
const Marker = MarkerBase || (MapView as any).Marker;

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
      if (event?.nativeEvent?.action === "marker-press") {
        return;
      }

      // setRestaurant(null);
      sheetRef.current.close();
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
          distanceInterval: 2000,
        },
        ({ coords }) => {
          setMapRegion({
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.04,
            longitudeDelta: 0.05,
          });

          mapRef?.current?.animateToRegion({
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

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        style={styles.sheet}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {selectedRest != null && (
            <View>
              <View style={styles.restInfo}>
                <Image
                  style={styles.avatar}
                  source={{
                    uri: selectedRest.avatarUrl,
                  }}
                />
                <View style={styles.nameTags}>
                  <Text style={styles.restName}>{selectedRest.name}</Text>
                  <ScrollView horizontal>
                    {selectedRest.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text>#{tag}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
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
    padding: 8,
    backgroundColor: "#ffffff",
  },
  restInfo: {
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 8,
  },
  nameTags: {
    flex: 1,
  },
  restName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#77bd67",
    color: "#000",
    marginHorizontal: 4,
  },
});

export default RestaurantMapScreen;
