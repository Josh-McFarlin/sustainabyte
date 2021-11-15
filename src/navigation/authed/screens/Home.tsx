import * as React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  View,
  Image,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
  ViewStyle,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { view } from "@risingstack/react-easy-state";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import type { TabNavParamList } from "../types";
import { RestaurantType } from "../../../types/Restaurant";
import {
  GalleryRestaurant,
  CircleOffer,
  GallerySocialGroup,
} from "../../../components/InfoCards";
import type { OfferType } from "../../../types/Offer";
import type { SocialGroupType } from "../../../types/SocialGroup";
import { fetchOffers } from "../../../actions/offer";
import { fetchSocialGroups } from "../../../actions/socialGroup";
import { useAuth } from "../../../utils/auth";
import OffersModal from "../../../components/OffersModal";
import { hashtagsToIcons } from "../../../utils/hashtags";
import { StackNavParamList } from "../types";

enum SectionType {
  LIST_RESTAURANT,
  GALLERY_RESTAURANT,
  GALLERY_OFFER,
  CIRCLE_OFFER,
  GALLERY_SOCIAL_GROUP,
}

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const showStyle: ViewStyle = {
  display: "flex",
};

const hideStyle: ViewStyle = {
  height: 0,
};

type PropTypes = CompositeScreenProps<
  BottomTabScreenProps<TabNavParamList, "Home">,
  NativeStackScreenProps<StackNavParamList>
>;

const HomeScreen: React.FC<PropTypes> = ({ navigation }) => {
  const { user } = useAuth();
  const coordinates = useLocation();
  const flatlistRef = React.useRef<FlatList>();
  const [selOffer, setSelOffer] = React.useState<number | null>(null);
  const [filtering, setFiltering] = React.useState<string | null>(null);
  const [showSection, setShowSection] = React.useState<number | null>(null);

  const { data: offers } = useQuery<OfferType[], Error>(
    ["offers", coordinates],
    fetchOffers,
    {
      enabled: coordinates != null,
      initialData: [],
    }
  );
  const { data: restaurants } = useQuery<RestaurantType[], Error>(
    [
      "restaurants",
      coordinates,
      {
        ...(filtering != null && {
          tags: [filtering],
        }),
      },
    ],
    fetchRestaurants,
    {
      enabled: coordinates != null,
      initialData: [],
    }
  );
  const { data: socialGroups } = useQuery<SocialGroupType[], Error>(
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

  const onPressSection = React.useCallback(
    (section: number) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFiltering(null);
      setShowSection((prevState) => (prevState === section ? null : section));
      flatlistRef.current.scrollToOffset({
        offset: 0,
      });
    },
    [flatlistRef]
  );

  const onPressCategory = React.useCallback((category: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFiltering((prevState) => {
      const nextVal = prevState === category ? null : category;

      setShowSection(nextVal != null ? 3 : null);

      return nextVal;
    });
  }, []);

  const data = React.useMemo(
    () => [
      {
        title: "You might like to follow",
        key: "1",
        data: socialGroups,
        type: SectionType.GALLERY_SOCIAL_GROUP,
        horizontal: true,
      },
      {
        title: "We thought you may like",
        key: "2",
        data: restaurants,
        type: SectionType.GALLERY_RESTAURANT,
        horizontal: true,
      },
      {
        title: "Top updates for you",
        subtitle: "Promoted offers from restaurants near you",
        key: "3",
        data: offers,
        type: SectionType.CIRCLE_OFFER,
        horizontal: true,
      },
      {
        title: "All Sustainabytes",
        key: "4",
        data: restaurants,
        type: SectionType.GALLERY_RESTAURANT,
        horizontal: false,
      },
    ],
    [restaurants, offers, socialGroups]
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatlistRef}
        style={styles.container}
        data={data}
        keyExtractor={(section) => section.key}
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
              {Object.entries(hashtagsToIcons).map(([category, icon]) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => onPressCategory(category)}
                >
                  <View
                    style={[
                      styles.category,
                      filtering === category
                        ? styles.selected
                        : styles.notSelected,
                    ]}
                  >
                    <Image style={styles.categoryIcon} source={icon} />
                    <Text style={styles.categoryText}>{category}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        renderItem={({ item: section, index }) => (
          <View
            style={[
              styles.section,
              showSection == null || showSection === index
                ? showStyle
                : hideStyle,
            ]}
          >
            <View>
              <View style={[styles.hRow, styles.center, styles.spaceBetween]}>
                <Text style={styles.title}>{section.title}</Text>
                <TouchableOpacity onPress={() => onPressSection(index)}>
                  <FontAwesome5
                    name="arrow-circle-right"
                    size={24}
                    color="#4b9193"
                  />
                </TouchableOpacity>
              </View>
              {section.subtitle && (
                <Text style={styles.subtitle}>{section.subtitle}</Text>
              )}
            </View>
            <FlatList<RestaurantType | OfferType | SocialGroupType>
              style={styles.singleList}
              data={section.data}
              horizontal={section.horizontal}
              keyExtractor={(item) => item._id}
              ItemSeparatorComponent={() => (
                <View
                  style={section.horizontal ? styles.spacerH : styles.spacerV}
                />
              )}
              renderItem={({ item, index: itemIndex }) => {
                switch (section.type) {
                  case SectionType.GALLERY_RESTAURANT: {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("RestaurantProfile" as any, {
                            id: item._id,
                            isFollowing: false,
                            isOwnProfile: false,
                          })
                        }
                      >
                        <GalleryRestaurant
                          style={
                            section.horizontal ? styles.hRest : styles.vRest
                          }
                          restaurant={item as RestaurantType}
                        />
                      </TouchableOpacity>
                    );
                  }
                  case SectionType.GALLERY_SOCIAL_GROUP: {
                    return (
                      <TouchableOpacity>
                        <GallerySocialGroup group={item as SocialGroupType} />
                      </TouchableOpacity>
                    );
                  }
                  case SectionType.CIRCLE_OFFER: {
                    return (
                      <TouchableOpacity onPress={() => setSelOffer(itemIndex)}>
                        <CircleOffer offer={item as OfferType} />
                      </TouchableOpacity>
                    );
                  }
                  default: {
                    return null;
                  }
                }
              }}
            />
          </View>
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
  selected: {
    borderBottomWidth: 2,
    borderColor: "#4b9193",
    paddingBottom: 4,
  },
  notSelected: {
    borderBottomWidth: 2,
    borderColor: "transparent",
    paddingBottom: 4,
  },
  section: {
    overflow: "hidden",
  },
});

export default view(HomeScreen);
