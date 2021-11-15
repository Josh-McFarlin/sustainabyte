import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  RefreshControl,
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
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { view } from "@risingstack/react-easy-state";
import SettingsSheet from "../../../components/SettingsSheet";
import PostGallery from "../../../components/PostGallery";
import { ReviewSummaryType, ReviewType } from "../../../types/Review";
import { fetchReviewSummary } from "../../../actions/review";
import { CheckInType } from "../../../types/CheckIn";
import { fetchCheckIns } from "../../../actions/checkIn";
import CheckInHistory from "../../../components/CheckInHistory";
import { StackNavParamList, TabNavParamList } from "../types";
import OffersModal from "../../../components/OffersModal";
import { OfferType } from "../../../types/Offer";
import { fetchOffers } from "../../../actions/offer";
import { CircleOffer } from "../../../components/InfoCards";
import { getOpenStatus, formatOpenHours } from "../../../utils/date";
import VisitModal from "../../../components/VisitModal";
import ReviewHistory from "../../../components/ReviewHistory";
import { useLocation } from "../../../utils/location";
import { fetchPosts } from "../../../actions/post";
import type { PostType } from "../../../types/Post";
import restaurantsStore from "../../../utils/restaurantData";
import { RestaurantType } from "../../../types/Restaurant";
import { useAuth } from "../../../utils/auth";

type PropTypes = CompositeScreenProps<
  BottomTabScreenProps<TabNavParamList, "Profile">,
  NativeStackScreenProps<StackNavParamList>
>;

enum TabTypes {
  GALLERY,
  MENU,
  REVIEWS,
}

const RestaurantScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { id } = route.params;
  const { user: authedUser } = useAuth();
  const isOwnProfile = id === authedUser._id;
  const isFollowing = isOwnProfile || authedUser.following.has(id);
  const coordinates = useLocation();
  const restaurant = restaurantsStore.getFull(id);
  const [selOffer, setSelOffer] = React.useState<number | null>(null);
  const [visitOpen, setVisitOpen] = React.useState<boolean>(false);
  const settingsSheetRef = React.useRef<BottomSheet>();
  const [curTab, setCurTab] = React.useState<TabTypes>(TabTypes.GALLERY);

  const { data: offers } = useQuery<OfferType[], Error>(
    ["offers", coordinates, { restaurant: restaurant?._id }],
    fetchOffers,
    {
      enabled: id != null,
      initialData: [],
    }
  );
  const {
    data: posts,
    refetch: refetchPosts,
    isLoading: isRefetchingPosts,
  } = useQuery<PostType[], Error>(["posts", { restaurant: id }], fetchPosts, {
    enabled: id != null,
    initialData: [],
  });
  const {
    data: reviewSummary,
    refetch: refetchReviews,
    isLoading: isRefetchingReviews,
  } = useQuery<ReviewSummaryType, Error>(["reviews", id], fetchReviewSummary, {
    enabled: id != null,
    initialData: {
      _id: null,
      avgRating: 0,
      totalReviews: 0,
      stars: [0, 0, 0, 0, 0],
      reviews: [],
      tags: [],
    },
  });
  const {
    data: checkIns,
    refetch: refetchCheckIns,
    isLoading: isRefetchingCheckIns,
  } = useQuery<CheckInType[], Error>(
    ["checkIns", { restaurant: id }],
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

  const openStatus = React.useMemo(
    () =>
      restaurant && "openHours" in restaurant
        ? getOpenStatus(restaurant.openHours)
        : null,
    [restaurant]
  );
  const hoursFormatted = React.useMemo(
    () =>
      restaurant && "openHours" in restaurant
        ? formatOpenHours(restaurant.openHours)
        : null,
    [restaurant]
  );

  const tabs = React.useMemo(
    () => ({
      [TabTypes.GALLERY]: {
        type: TabTypes.GALLERY,
        icon: (props) => <Ionicons name="grid" {...props} />,
        data: posts,
        listProps: PostGallery.listProps,
        Header: () => null,
        renderItem: (i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Post", {
                id: i.item._id,
                post: i.item,
              })
            }
          >
            {PostGallery.renderItem(i)}
          </TouchableOpacity>
        ),
        refetch: refetchPosts,
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
        refetch: refetchCheckIns,
      },
      [TabTypes.REVIEWS]: {
        type: TabTypes.REVIEWS,
        icon: (props) => <MaterialIcons name="rate-review" {...props} />,
        data: reviewSummary.reviews,
        listProps: ReviewHistory.listProps,
        Header: () => (
          <ReviewHistory.Header
            restaurant={restaurant as RestaurantType}
            avgRating={reviewSummary.avgRating}
            totalReviews={reviewSummary.totalReviews}
            stars={reviewSummary.stars}
            tags={reviewSummary.tags}
          />
        ),
        renderItem: (i) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Review", {
                id: i.item._id,
                review: i.item,
              })
            }
          >
            {ReviewHistory.renderItem(i)}
          </TouchableOpacity>
        ),
        refetch: refetchReviews,
      },
    }),
    [
      navigation,
      checkIns,
      posts,
      reviewSummary,
      restaurant,
      refetchReviews,
      refetchCheckIns,
      refetchPosts,
    ]
  );

  if (restaurant == null) {
    return null;
  }

  const { data, Header, renderItem, listProps, refetch } = tabs[curTab];

  return (
    <View style={styles.container}>
      <FlatList<PostType | ReviewType | CheckInType>
        style={styles.container}
        data={data}
        keyExtractor={(i) => i._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={
              isRefetchingReviews || isRefetchingPosts || isRefetchingCheckIns
            }
            onRefresh={refetch}
          />
        }
        refreshing={
          isRefetchingReviews || isRefetchingPosts || isRefetchingCheckIns
        }
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
                  <Text style={styles.statsText}>{checkIns?.length || 0}</Text>
                  <Text style={styles.statsDetails}>Check ins</Text>
                </View>
                <View style={[styles.vRow, styles.center]}>
                  <FontAwesome name="square" size={32} color="#3C8D90" />
                  <Text style={styles.statsText}>{posts?.length || 0}</Text>
                  <Text style={styles.statsDetails}>Posts</Text>
                </View>
                <View style={[styles.vRow, styles.center]}>
                  <FontAwesome name="star" size={32} color="#3C8D90" />
                  <Text style={styles.statsText}>
                    {reviewSummary.avgRating.toFixed(1)}
                  </Text>
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
                  {openStatus?.open ? "Open Now" : "Currently Closed"}
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
          restaurant={restaurant as RestaurantType}
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

export default view(RestaurantScreen);
