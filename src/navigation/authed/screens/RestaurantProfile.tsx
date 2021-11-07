import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  FontAwesome,
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { useQuery } from "react-query";
import SettingsSheet from "../../../components/SettingsSheet";
import PostGallery from "../../../components/PostGallery";
import { ReviewType } from "../../../types/Review";
import { fetchReviews } from "../../../actions/review";
import { CheckInType } from "../../../types/CheckIn";
import { fetchCheckIns } from "../../../actions/checkIn";
import CheckInHistory from "../../../components/CheckInHistory";
import { TabNavParamList } from "../types";
import { fetchRestaurant } from "../../../actions/restaurant";
import { RestaurantType } from "../../../types/Restaurant";
import OffersModal from "../../../components/OffersModal";
import { OfferType } from "../../../types/Offer";
import { fetchOffers } from "../../../actions/offer";
import { CircleOffer } from "../../../components/InfoCards";
import { getOpenStatus, formatOpenHours } from "../../../utils/date";
import VisitModal from "../../../components/VisitModal";
import ReviewHistory from "../../../components/ReviewHistory";

type PropTypes = BottomTabScreenProps<TabNavParamList, "Profile">;

enum TabTypes {
  GALLERY,
  MENU,
  REVIEWS,
}

const RestaurantScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { id, isOwnProfile, isFollowing } = route.params;
  const [selOffer, setSelOffer] = React.useState<number | null>(null);
  const [visitOpen, setVisitOpen] = React.useState<boolean>(false);
  const settingsSheetRef = React.useRef<BottomSheet>();
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.GALLERY);

  const { data: restaurant } = useQuery<RestaurantType, Error>(
    ["restaurant", id],
    fetchRestaurant
  );
  const { data: offers } = useQuery<OfferType[], Error>(
    ["offers", [0, 0]],
    fetchOffers,
    {
      enabled: restaurant != null,
      initialData: [],
    }
  );
  const { data: reviews } = useQuery<ReviewType[], Error>(
    ["reviews"],
    fetchReviews,
    {
      enabled: id != null,
      initialData: [],
    }
  );
  const { data: checkIns } = useQuery<CheckInType[], Error>(
    ["checkIns"],
    fetchCheckIns,
    {
      enabled: id != null,
      initialData: [],
    }
  );

  React.useEffect(() => {
    if (restaurant != null) {
      navigation.setOptions({
        headerTitle: restaurant.name,
      });
    }
  }, [restaurant, navigation]);

  const openSheet = React.useCallback(() => {
    settingsSheetRef.current.expand();
  }, [settingsSheetRef]);

  const goForwardOffer = React.useCallback(
    () => setSelOffer((prevState) => prevState + 1),
    []
  );
  const goBackOffer = React.useCallback(
    () => setSelOffer((prevState) => prevState - 1),
    []
  );
  const handleCloseOffer = React.useCallback(() => setSelOffer(null), []);

  const rating = restaurant
    ? restaurant.ratings.sum / restaurant.ratings.count
    : 0;
  const openStatus = React.useMemo(
    () => (restaurant ? getOpenStatus(restaurant.openHours) : null),
    [restaurant]
  );
  const hoursFormatted = React.useMemo(
    () => (restaurant ? formatOpenHours(restaurant.openHours) : null),
    [restaurant]
  );

  const tabs = React.useMemo(
    () => ({
      [TabTypes.GALLERY]: {
        type: TabTypes.GALLERY,
        icon: (props) => <Ionicons name="grid" {...props} />,
        data: reviews,
        listProps: PostGallery.listProps,
        Header: () => null,
        renderItem: PostGallery.renderItem,
      },
      [TabTypes.MENU]: {
        type: TabTypes.MENU,
        icon: (props) => (
          <View>
            <MaterialCommunityIcons name="comment-outline" {...props} />
            <MaterialCommunityIcons
              name="food"
              {...props}
              style={styles.innerIcon}
              size={14}
            />
          </View>
        ),
        data: checkIns,
        listProps: CheckInHistory.listProps,
        Header: () => null,
        renderItem: CheckInHistory.renderItem,
      },
      [TabTypes.REVIEWS]: {
        type: TabTypes.REVIEWS,
        icon: (props) => <MaterialIcons name="rate-review" {...props} />,
        data: reviews,
        listProps: ReviewHistory.listProps,
        Header: () => <ReviewHistory.Header restaurant={restaurant} />,
        renderItem: ReviewHistory.renderItem,
      },
    }),
    [checkIns, reviews, restaurant]
  );

  if (restaurant == null) {
    return null;
  }

  const { data, Header, renderItem, listProps } = tabs[curTab];

  return (
    <View style={styles.container}>
      <FlatList<ReviewType | CheckInType>
        style={styles.container}
        data={data}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.vRow}>
              <View
                style={[
                  styles.hRow,
                  styles.spaceBetween,
                  styles.hPadding,
                  styles.topPadding,
                  styles.marginBottom,
                ]}
              >
                {isOwnProfile ? (
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
                ) : (
                  <View style={styles.hRow}>
                    <View style={styles.icon} />
                    <View style={styles.icon} />
                  </View>
                )}
                <Image
                  style={styles.avatar}
                  source={{ uri: restaurant.avatarUrl }}
                />
                {isOwnProfile ? (
                  <View style={styles.hRow}>
                    <TouchableOpacity>
                      <FontAwesome
                        style={styles.icon}
                        name="bell"
                        size={32}
                        color="#3C8D90"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={openSheet}>
                      <FontAwesome
                        style={styles.icon}
                        name="bars"
                        size={32}
                        color="#3C8D90"
                      />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.hRow}>
                    <TouchableOpacity onPress={() => setVisitOpen(true)}>
                      <FontAwesome
                        style={styles.icon}
                        name="plus-square-o"
                        size={36}
                        color="#3C8D90"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <FontAwesome
                        style={styles.icon}
                        name={isFollowing ? "bookmark" : "bookmark-o"}
                        size={32}
                        color="#3C8D90"
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View style={[styles.hRow, styles.center, styles.marginBottom]}>
                <Text style={styles.name}>{restaurant.name}</Text>
              </View>
              <View style={[styles.hRow, styles.marginBottom, styles.hPadding]}>
                <FlatList
                  data={offers}
                  horizontal
                  keyExtractor={(item) => item._id}
                  ItemSeparatorComponent={() => <View style={styles.spacerH} />}
                  renderItem={({ item, index }) => (
                    <TouchableOpacity
                      key={item._id}
                      onPress={() => setSelOffer(index)}
                    >
                      <CircleOffer offer={item} />
                    </TouchableOpacity>
                  )}
                />
              </View>
              <View
                style={[styles.hRow, styles.spaceAround, styles.marginBottom]}
              >
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
                  <FontAwesome name="star" size={32} color="#3C8D90" />
                  <Text style={styles.statsText}>{rating.toFixed(1)}</Text>
                  <Text style={styles.statsDetails}>Rating</Text>
                </View>
              </View>
            </View>
            <View style={[styles.vRow, styles.marginBottom, styles.hPadding]}>
              <View style={[styles.hRow]}>
                <Text style={styles.bio}>$$</Text>
                <View style={styles.bullet} />
                <Text style={styles.bio}>{restaurant.tags.join(", ")}</Text>
                <View style={styles.bullet} />
                <Text style={[styles.bio, styles.openText]}>
                  {openStatus.open ? "Open Now" : "Currently Closed"}
                </Text>
              </View>
              <View style={[styles.hRow]}>
                <Text style={styles.bio}>{hoursFormatted}</Text>
              </View>
            </View>
            <View style={[styles.hRow, styles.border]}>
              {Object.values(tabs).map((tab) => (
                <TouchableOpacity
                  key={tab.type}
                  style={[
                    styles.fullFlex,
                    curTab === tab.type
                      ? styles.activeBorder
                      : styles.iconBorder,
                    styles.center,
                  ]}
                  onPress={() => setCurTab(tab.type)}
                >
                  <View style={[styles.center, styles.bottomPadding]}>
                    <tab.icon
                      size={28}
                      color={curTab === tab.type ? "#3C8D90" : "#9EC1C3"}
                      style={styles.icon}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
            <Header />
          </View>
        )}
        key={curTab}
        {...listProps}
      />
      <SettingsSheet ref={settingsSheetRef} />
      <OffersModal
        offer={offers?.[selOffer]}
        goForward={goForwardOffer}
        goBack={goBackOffer}
        handleClose={handleCloseOffer}
      />
      {!isOwnProfile && (
        <VisitModal
          restaurant={restaurant}
          open={visitOpen}
          handleClose={() => setVisitOpen(false)}
        />
      )}
    </View>
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
    fontSize: 16,
    color: "#717171",
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 10,
    backgroundColor: "#717171",
    marginHorizontal: 6,
    alignSelf: "center",
  },
  openText: {
    color: "#3C8D90",
  },
  border: {
    paddingTop: 16,
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
  icon: {
    width: 36,
    marginHorizontal: 8,
    textAlign: "center",
  },
  innerIcon: {
    position: "absolute",
    top: 4,
    alignSelf: "center",
  },
});

export default RestaurantScreen;
