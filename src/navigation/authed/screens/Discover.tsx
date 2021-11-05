import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Marker as MarkerBase,
} from "react-native-maps";
import BottomSheet from "@gorhom/bottom-sheet";
import SingleReview from "../../../components/Review";
import type { TabNavParamList } from "../types";
import { fetchReviews } from "../../../actions/review";
import type { ReviewType } from "../../../types/Review";
import SearchBar from "../../../components/SearchBar";
import { RestaurantType } from "../../../types/Restaurant";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import RestaurantSheet from "../../../components/RestaurantSheet";
import { mapStyle } from "../../../utils/map";

const Marker = MarkerBase || (MapView as any).Marker;

enum TabTypes {
  RECENT,
  SEARCH,
}

type PropTypes = BottomTabScreenProps<TabNavParamList, "Discover">;

const DiscoverScreen: React.FC<PropTypes> = () => {
  const coordinates = useLocation();
  const sheetRef = React.useRef<BottomSheet>(null);
  const mapRef = React.useRef<MapView>(null);
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.RECENT);
  const [wasMoved, setWasMoved] = React.useState<boolean>(false);
  const [selectedRest, setRestaurant] = React.useState<RestaurantType | null>(
    null
  );
  const [searchRegion, setSearchRegion] = React.useState<Region>({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });
  const { data: reviews } = useQuery<ReviewType[], Error>(
    ["reviews"],
    fetchReviews,
    {
      initialData: [],
    }
  );
  const { data: restaurants } = useQuery<RestaurantType[], Error>(
    ["restaurants", searchRegion],
    fetchRestaurants,
    {
      initialData: [],
      onSuccess: () => setWasMoved(false),
    }
  );

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

  const handleSearch = React.useCallback((search: string, tags: string[]) => {
    console.log(search, tags);
    if (search.length > 0 || tags.length > 0) {
      setCurTab(TabTypes.SEARCH);
    } else {
      sheetRef.current.close();
      setCurTab(TabTypes.RECENT);
    }
  }, []);

  const onRegionChangeComplete = React.useCallback(() => setWasMoved(true), []);
  const handleSearchArea = React.useCallback(async () => {
    const cam = await mapRef.current.getCamera();
    setSearchRegion((prevState) => ({
      ...prevState,
      ...cam.center,
    }));
  }, [mapRef]);

  const tabs = React.useMemo(
    () => ({
      [TabTypes.RECENT]: {
        type: TabTypes.RECENT,
        title: "Recent",
        Content: () => (
          <FlatList
            style={styles.list}
            data={reviews}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => {
                  console.log(item.id);
                }}
              >
                <SingleReview review={item} />
              </TouchableWithoutFeedback>
            )}
            ItemSeparatorComponent={() => <View style={styles.spacer} />}
          />
        ),
      },
      [TabTypes.SEARCH]: {
        type: TabTypes.SEARCH,
        title: "Search",
        Content: () => (
          <>
            <MapView
              ref={mapRef}
              showsUserLocation
              showsPointsOfInterest={false}
              loadingEnabled
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              customMapStyle={mapStyle}
              initialRegion={searchRegion}
              onRegionChangeComplete={onRegionChangeComplete}
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
            {wasMoved && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={handleSearchArea}>
                  <View style={styles.button}>
                    <Text style={styles.buttonText}>Search This Area</Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </>
        ),
      },
    }),
    [
      searchRegion,
      reviews,
      handleMapPress,
      handleMarkerPress,
      wasMoved,
      restaurants,
      onRegionChangeComplete,
      handleSearchArea,
    ]
  );

  const { Content } = tabs[curTab];

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar onChange={handleSearch} />
      <Content />
      <RestaurantSheet ref={sheetRef} restaurant={selectedRest} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  spacer: {
    height: 8,
    backgroundColor: "#D8D8D8",
  },
  list: {
    flex: 1,
  },
  map: {
    flex: 1,
    position: "relative",
  },
  buttonContainer: {
    width: Dimensions.get("window").width,
    position: "absolute",
    left: 0,
    top: 200,
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

export default React.memo(DiscoverScreen);
