import * as React from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useRef } from "react";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "react-query";
import SettingsSheet from "../../../components/SettingsSheet";
import PostGallery from "../../../components/PostGallery";
import { Review } from "../../../types/Review";
import { fetchReviews } from "../../../actions/review";
import { CheckIn } from "../../../types/CheckIn";
import { fetchCheckIns } from "../../../actions/checkIn";
import CheckInHistory from "../../../components/CheckInHistory";
import { TabNavParamList } from "../types";
import { fetchRestaurant } from "../../../actions/restaurant";
import { Restaurant } from "../../../types/Restaurant";
import OffersModal from "../../../components/OffersModal";
import { Offer } from "../../../types/Offer";
import { fetchOffers } from "../../../actions/offer";
import { CircleOffer } from "../../../components/InfoCards";

type PropTypes = BottomTabScreenProps<TabNavParamList, "Profile">;

enum TabTypes {
  GALLERY,
  CHECKINS,
  SAVED,
}

const RestaurantScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { id, isOwnProfile, isFollowing } = route.params;
  const [selOffer, setSelOffer] = React.useState<number | null>(null);

  const { data: restaurant } = useQuery<Restaurant, Error>(
    ["restaurant", id],
    fetchRestaurant
  );
  const { data: offers } = useQuery<Offer[], Error>(
    ["offers", [0, 0]],
    fetchOffers,
    {
      enabled: restaurant != null,
      initialData: [],
    }
  );
  const settingsSheetRef = useRef<BottomSheet>();
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.GALLERY);
  const { data: reviews } = useQuery<Review[], Error>(
    ["reviews"],
    fetchReviews,
    {
      initialData: [],
    }
  );
  const { data: checkIns } = useQuery<CheckIn[], Error>(
    ["checkIns"],
    fetchCheckIns,
    {
      initialData: [],
    }
  );

  const openSheet = React.useCallback(() => {
    settingsSheetRef.current.expand();
  }, [settingsSheetRef]);

  const tabs = React.useMemo(
    () => ({
      [TabTypes.GALLERY]: {
        type: TabTypes.GALLERY,
        icon: ({ ...props }) => <Ionicons name="grid" {...props} />,
        renderItem: <PostGallery posts={reviews} />,
      },
      [TabTypes.CHECKINS]: {
        type: TabTypes.CHECKINS,
        icon: ({ ...props }) => <FontAwesome5 name="map-pin" {...props} />,
        renderItem: <CheckInHistory checkIns={checkIns} />,
      },
      [TabTypes.SAVED]: {
        type: TabTypes.SAVED,
        icon: ({ ...props }) => <Ionicons name="bookmark" {...props} />,
        renderItem: <PostGallery posts={reviews} />,
      },
    }),
    [checkIns, reviews]
  );

  const goForwardOffer = React.useCallback(
    () => setSelOffer((prevState) => prevState + 1),
    []
  );
  const goBackOffer = React.useCallback(
    () => setSelOffer((prevState) => prevState - 1),
    []
  );
  const handleCloseOffer = React.useCallback(() => setSelOffer(null), []);

  React.useEffect(() => {
    if (restaurant != null) {
      navigation.setOptions({
        headerTitle: restaurant.name,
      });
    }
  }, [restaurant, navigation]);

  if (restaurant == null) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.vRow}>
        <View
          style={[
            styles.hRow,
            isOwnProfile ? styles.spaceBetween : styles.center,
            styles.hPadding,
            styles.topPadding,
            styles.marginBottom,
          ]}
        >
          {isOwnProfile && (
            <View style={styles.hRow}>
              <TouchableOpacity>
                <FontAwesome
                  style={styles.icon}
                  name="plus-square-o"
                  size={36}
                  color="#3C8D90"
                />
              </TouchableOpacity>
              <View style={styles.icon} />
            </View>
          )}
          <Image style={styles.avatar} source={{ uri: restaurant.avatarUrl }} />
          {isOwnProfile && (
            <View style={styles.hRow}>
              <TouchableOpacity>
                <FontAwesome
                  style={styles.icon}
                  name="bell"
                  size={32}
                  color="#3C8D90"
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome
                  style={styles.icon}
                  name="bars"
                  size={32}
                  color="#3C8D90"
                  onPress={openSheet}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={[styles.hRow, styles.center, styles.marginBottom]}>
          <Text style={styles.name}>{restaurant.name}</Text>
        </View>
        <View style={[styles.hRow, styles.spaceAround, styles.marginBottom]}>
          <View style={[styles.vRow, styles.center]}>
            <FontAwesome name="map-pin" size={32} color="#3C8D90" />
            <Text style={styles.statsText}>348</Text>
            <Text style={styles.statsDetails}>Check ins</Text>
          </View>
          <View style={[styles.vRow, styles.center]}>
            <FontAwesome name="square" size={32} color="#3C8D90" />
            <Text style={styles.statsText}>1520</Text>
            <Text style={styles.statsDetails}>Posts</Text>
          </View>
          <View style={[styles.vRow, styles.center]}>
            <FontAwesome
              name="user"
              size={32}
              color={isFollowing ? "#3C8D90" : "#9EC1C3"}
            />
            <Text style={styles.statsText}>439</Text>
            <Text style={styles.statsDetails}>Followers</Text>
          </View>
        </View>
      </View>
      <View style={[styles.hRow, styles.center, styles.marginBottom]}>
        <Text style={styles.bio}>Tap to add a bio</Text>
      </View>
      <View style={[styles.hRow, styles.marginBottom, styles.hPadding]}>
        <FlatList
          data={offers}
          horizontal
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.spacerH} />}
          renderItem={({ item, index }) => (
            <TouchableOpacity key={item.id} onPress={() => setSelOffer(index)}>
              <CircleOffer offer={item as unknown as Offer} />
            </TouchableOpacity>
          )}
        />
      </View>
      <View style={[styles.hRow, styles.border, styles.noPadding]}>
        {Object.values(tabs).map((tab) => (
          <TouchableOpacity
            key={tab.type}
            style={[
              styles.fullFlex,
              curTab === tab.type ? styles.activeBorder : styles.iconBorder,
              styles.center,
            ]}
            onPress={() => setCurTab(tab.type)}
          >
            <View style={[styles.center, styles.bottomPadding]}>
              <tab.icon
                size={24}
                color={curTab === tab.type ? "#3C8D90" : "#9EC1C3"}
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {tabs[curTab].renderItem}
      <SettingsSheet ref={settingsSheetRef} />
      <OffersModal
        offer={offers?.[selOffer]}
        goForward={goForwardOffer}
        goBack={goBackOffer}
        handleClose={handleCloseOffer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  vRow: {
    display: "flex",
    flexDirection: "column",
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
  icon: {
    width: 36,
    height: 36,
    marginHorizontal: 8,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#717171",
  },
  hPadding: {
    paddingHorizontal: 16,
  },
  topPadding: {
    paddingTop: 32,
  },
  bottomPadding: {
    paddingBottom: 16,
  },
  noPadding: {
    paddingBottom: 0,
  },
  marginBottom: {
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statsText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statsDetails: {
    textAlign: "center",
    fontSize: 14,
    color: "#717171",
  },
  bio: {
    textAlign: "center",
    fontSize: 15,
    color: "#717171",
  },
  border: {
    paddingVertical: 16,
    borderTopWidth: 2,
    borderColor: "#dbdbdb",
  },
  iconBorder: {
    borderBottomWidth: 2,
    borderColor: "#dbdbdb",
  },
  activeBorder: {
    borderBottomWidth: 2,
    borderColor: "#3C8D90",
  },
  fullFlex: {
    flex: 1,
  },
  spacerH: {
    marginRight: 16,
  },
  spacerV: {
    marginBottom: 16,
  },
});

export default RestaurantScreen;