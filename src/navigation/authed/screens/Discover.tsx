import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import MapView, {
  PROVIDER_GOOGLE,
  Region,
  Marker as MarkerBase,
} from "react-native-maps";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { view } from "@risingstack/react-easy-state";
import DiscoverItem from "../../../components/DiscoverItem";
import type { TabNavParamList } from "../types";
import SearchBar from "../../../components/SearchBar";
import { RestaurantType } from "../../../types/Restaurant";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import { fetchRecent } from "../../../actions/recent";
import RestaurantSheet from "../../../components/RestaurantSheet";
import { mapStyle } from "../../../utils/map";
import { RecentType } from "../../../types/Recent";
import { StackNavParamList } from "../types";
import { BasicUserType, UserType } from "../../../types/User";
import { fetchUsers } from "../../../actions/user";
import usersStore from "../../../utils/userData";

const Marker = MarkerBase || (MapView as any).Marker;

enum TabTypes {
  RECENT,
  SEARCH,
}

enum ContentTypes {
  MAP,
  USER,
}

type PropTypes = CompositeScreenProps<
  BottomTabScreenProps<TabNavParamList, "Discover">,
  NativeStackScreenProps<StackNavParamList>
>;

const DiscoverScreen: React.FC<PropTypes> = () => {
  const window = useWindowDimensions();
  const coordinates = useLocation();
  const sheetRef = React.useRef<BottomSheetModal>(null);
  const mapRef = React.useRef<MapView>(null);
  const [curContent, setCurContent] = React.useState<ContentTypes>(
    ContentTypes.MAP
  );
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.RECENT);
  const [wasMoved, setWasMoved] = React.useState<boolean>(false);
  const [selectedRest, setRestaurant] = React.useState<RestaurantType | null>(
    null
  );
  const [filteringText, setFilteringText] = React.useState<string | null>(null);
  const [filteringTags, setFilteringTags] = React.useState<string[] | null>(
    null
  );
  const [searchRegion, setSearchRegion] = React.useState<Region>({
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
    latitudeDelta: 0.04,
    longitudeDelta: 0.05,
  });
  const { data: restaurants } = useQuery<RestaurantType[], Error>(
    [
      "restaurants",
      searchRegion,
      {
        ...(filteringText != null &&
          filteringText.length > 0 && {
            name: filteringText,
          }),
        ...(filteringTags != null &&
          filteringTags.length > 0 && {
            tags: filteringTags,
          }),
      },
    ],
    fetchRestaurants,
    {
      initialData: [],
      onSuccess: () => setWasMoved(false),
    }
  );
  const { data: recent } = useQuery<RecentType[], Error>(
    ["recent", searchRegion],
    fetchRecent,
    {
      initialData: [],
    }
  );
  const { data: users } = useQuery<UserType[], Error>(
    [
      "users",
      {
        username: filteringText,
      },
    ],
    fetchUsers,
    {
      initialData: [],
    }
  );
  const recentUsers = usersStore.recentUsers.map((userId) =>
    usersStore.get(userId)
  );

  const handleMarkerPress = React.useCallback(
    (restaurant) => {
      setRestaurant(restaurant);
      sheetRef.current.present();
    },
    [sheetRef, setRestaurant]
  );

  const handleSearch = React.useCallback((search: string, tags: string[]) => {
    if (search.length > 0 || tags.length > 0) {
      sheetRef.current.dismiss();
      setFilteringTags(tags);
      setFilteringText(search);
      setCurTab(TabTypes.SEARCH);
    } else {
      sheetRef.current.dismiss();
      setCurTab(TabTypes.RECENT);
      setFilteringTags(null);
      setFilteringText(null);
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

  const renderUserRecent = React.useCallback(
    curContent === ContentTypes.MAP
      ? ({ item }) => <DiscoverItem item={item as RecentType} />
      : ({ item }) => <DiscoverItem user={item as UserType} />,
    [curContent]
  );

  const showingUsers = React.useMemo(
    () =>
      filteringText != null && filteringText.length > 0 ? users : recentUsers,
    [filteringText, users, recentUsers]
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.hRow, styles.spaceAround, styles.marginVertical]}>
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => setCurContent(ContentTypes.MAP)}
        >
          <View
            style={
              curContent === ContentTypes.MAP
                ? styles.selectedSpan
                : styles.spanContainer
            }
          >
            <Text
              style={
                curContent === ContentTypes.MAP
                  ? styles.selectedText
                  : styles.spanText
              }
            >
              Search Map
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.typeButton}
          onPress={() => setCurContent(ContentTypes.USER)}
        >
          <View
            style={
              curContent === ContentTypes.USER
                ? styles.selectedSpan
                : styles.spanContainer
            }
          >
            <Text
              style={
                curContent === ContentTypes.USER
                  ? styles.selectedText
                  : styles.spanText
              }
            >
              Search Users
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <SearchBar
        onChange={handleSearch}
        placeholder={
          curContent === ContentTypes.MAP ? `Search "Curry"` : `Search User`
        }
        showTags={curContent === ContentTypes.MAP}
      />
      {curContent === ContentTypes.USER || curTab === TabTypes.RECENT ? (
        <FlatList<UserType | RecentType | BasicUserType>
          style={styles.list}
          data={curContent === ContentTypes.USER ? showingUsers : recent}
          keyExtractor={(i) => i._id}
          renderItem={renderUserRecent}
          ItemSeparatorComponent={() => <View style={styles.spacer} />}
        />
      ) : (
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
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          options={{
            disableDefaultUI: true,
          }}
        >
          {restaurants?.map((restaurant) => (
            <Marker
              key={restaurant._id}
              coordinate={{
                latitude: restaurant.coordinates.coordinates[0],
                longitude: restaurant.coordinates.coordinates[1],
              }}
              onPress={() => handleMarkerPress(restaurant)}
            />
          ))}
        </MapView>
      )}
      {curTab === TabTypes.SEARCH && wasMoved && (
        <View
          style={[
            styles.buttonContainer,
            {
              width: window.width,
            },
          ]}
        >
          <TouchableOpacity onPress={handleSearchArea}>
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
    backgroundColor: "#ffffff",
  },
  spacer: {
    height: 3,
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
    width: "100%",
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
  hRow: {
    display: "flex",
    flexDirection: "row",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  spaceAround: {
    justifyContent: "space-around",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  alignEnd: {
    alignItems: "flex-end",
  },
  selectedSpan: {
    borderBottomWidth: 3,
    borderBottomColor: "#3C8D90",
    alignItems: "center",
    paddingBottom: 8,
  },
  spanContainer: {
    borderBottomWidth: 3,
    borderBottomColor: "#A0A0A0",
    alignItems: "center",
    paddingBottom: 8,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#3C8D90",
    textAlign: "center",
  },
  spanText: {
    fontSize: 16,
    color: "#A0A0A0",
    textAlign: "center",
  },
  title: {
    fontSize: 32,
    color: "#fff",
    textAlign: "center",
    marginVertical: 16,
  },
  marginVertical: {
    marginVertical: 12,
  },
  typeButton: {
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    margin: 8,
    backgroundColor: "#ccc",
  },
});

export default view(DiscoverScreen);
