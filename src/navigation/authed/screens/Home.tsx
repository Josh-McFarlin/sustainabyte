import * as React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  SectionList,
  View,
  Image,
  ScrollView,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import type { TabNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import {
  GalleryRestaurant,
  CircleOffer,
  GallerySocialGroup,
} from "../../../components/InfoCards";
import type { Offer } from "../../../types/Offer";
import type { SocialGroup } from "../../../types/SocialGroup";
import { fetchOffers } from "../../../actions/offer";
import { fetchSocialGroups } from "../../../actions/socialGroup";
import { useAuth } from "../../../utils/auth";
import OffersModal from "../../../components/OffersModal";

type PropTypes = BottomTabScreenProps<TabNavParamList, "Home">;

enum SectionType {
  LIST_RESTAURANT,
  GALLERY_RESTAURANT,
  GALLERY_OFFER,
  CIRCLE_OFFER,
  GALLERY_SOCIAL_GROUP,
}

const categories = [
  {
    name: "Italian",
    icon: require("../../../../assets/icons/italian.png"),
  },
  {
    name: "Mexican",
    icon: require("../../../../assets/icons/mexican.png"),
  },
  {
    name: "Indian",
    icon: require("../../../../assets/icons/indian.png"),
  },
  {
    name: "Lebanese",
    icon: require("../../../../assets/icons/lebanese.png"),
  },
  {
    name: "Asian",
    icon: require("../../../../assets/icons/asian.png"),
  },
  {
    name: "American",
    icon: require("../../../../assets/icons/american.png"),
  },
];

const HomeScreen: React.FC<PropTypes> = ({ navigation }) => {
  const { user } = useAuth();
  const coordinates = useLocation();
  const [selOffer, setSelOffer] = React.useState<number | null>(null);

  const { data: offers } = useQuery<Offer[], Error>(
    ["offers", coordinates],
    fetchOffers,
    {
      enabled: coordinates != null,
      initialData: [],
    }
  );
  const { data: restaurants } = useQuery<Restaurant[], Error>(
    ["restaurants", coordinates],
    fetchRestaurants,
    {
      enabled: coordinates != null,
      initialData: [],
    }
  );
  const { data: socialGroups } = useQuery<SocialGroup[], Error>(
    ["socialGroups"],
    fetchSocialGroups,
    {
      initialData: [],
    }
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

  const onPressCategory = React.useCallback((category: string) => {
    console.log(category);
  }, []);

  console.log("offers:", offers);
  console.log("restaurants:", restaurants);
  console.log("seloffer num:", selOffer);

  const data = React.useMemo(
    () => [
      {
        title: "You might like to follow",
        key: "1",
        data: ["1", socialGroups],
        type: SectionType.GALLERY_SOCIAL_GROUP,
        horizontal: true,
      },
      {
        title: "We thought you may like",
        key: "2",
        data: ["2", restaurants],
        type: SectionType.GALLERY_RESTAURANT,
        horizontal: true,
      },
      {
        title: "Top updates for you",
        subtitle: "Promoted offers from restaurants near you",
        key: "3",
        data: ["3", offers],
        type: SectionType.CIRCLE_OFFER,
        horizontal: true,
      },
      {
        title: "All Sustainabytes",
        key: "4",
        data: ["4", restaurants],
        type: SectionType.GALLERY_RESTAURANT,
        horizontal: false,
      },
    ],
    [restaurants, offers, socialGroups]
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        stickySectionHeadersEnabled={false}
        style={styles.container}
        sections={data as any}
        keyExtractor={(item) => item[0]}
        ListHeaderComponent={() => (
          <View>
            <View style={styles.header}>
              <View style={styles.headerText}>
                <Text style={styles.headerName}>Hi, {user.name}</Text>
                <Text style={styles.headerTitle}>Welcome back!</Text>
              </View>
              <Image
                style={styles.userAvatar}
                source={{
                  uri: user.avatarUrl,
                }}
              />
            </View>
            <ScrollView style={styles.categories} horizontal>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.name}
                  onPress={() => onPressCategory(category.name)}
                >
                  <View style={styles.category}>
                    <Image style={styles.categoryIcon} source={category.icon} />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        renderSectionHeader={({ section: { title, subtitle } }) => (
          <View>
            <View style={[styles.hRow, styles.center, styles.spaceBetween]}>
              <Text style={styles.title}>{title}</Text>
              <FontAwesome5
                name="arrow-circle-right"
                size={24}
                color="#4b9193"
              />
            </View>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}
        renderItem={({ item: sectionData, section }) => (
          <FlatList
            style={styles.singleList}
            data={sectionData.slice(1)}
            horizontal={section.horizontal}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={() => (
              <View
                style={section.horizontal ? styles.spacerH : styles.spacerV}
              />
            )}
            renderItem={({ item, index }) => {
              if (section.type === SectionType.GALLERY_RESTAURANT) {
                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={() =>
                      navigation.navigate("RestaurantProfile" as any, {
                        id: item.id,
                        isFollowing: false,
                        isOwnProfile: false,
                      })
                    }
                  >
                    <GalleryRestaurant
                      key={item.id}
                      style={section.horizontal ? styles.hRest : styles.vRest}
                      restaurant={item}
                    />
                  </TouchableOpacity>
                );
              }
              if (section.type === SectionType.GALLERY_SOCIAL_GROUP) {
                return (
                  <TouchableOpacity key={item.id}>
                    <GallerySocialGroup group={item} />
                  </TouchableOpacity>
                );
              }
              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => setSelOffer(index)}
                >
                  <CircleOffer offer={item as unknown as Offer} />
                </TouchableOpacity>
              );
            }}
          />
        )}
      />
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
    padding: 16,
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  center: {
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 4,
    color: "#3C8D90",
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
  },
  singleList: {
    paddingBottom: 16,
  },
  spacerH: {
    marginRight: 16,
  },
  spacerV: {
    marginBottom: 16,
  },
  hRest: {
    width: 300,
    height: 200,
  },
  vRest: {
    width: undefined,
    height: 240,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    //
  },
  headerName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
  },
  headerTitle: {
    fontSize: 22,
    color: "#4b9193",
  },
  userAvatar: {
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
    borderRadius: 50,
  },

  noMargin: {
    margin: 0,
  },
  categories: {
    borderTopWidth: 3,
    borderBottomWidth: 3,
    borderColor: "#d7d7d7",
    paddingVertical: 8,
    marginHorizontal: -16,
    marginBottom: 16,
  },
  category: {
    // width: 90,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "bold",
  },
  marginBottom: {
    marginBottom: 8,
  },
});

export default HomeScreen;
