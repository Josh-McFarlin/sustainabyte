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
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
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
import { hashtagsToIcons } from "../../../utils/tags";

type PropTypes = BottomTabScreenProps<TabNavParamList, "Home">;

enum SectionType {
  LIST_RESTAURANT,
  GALLERY_RESTAURANT,
  GALLERY_OFFER,
  CIRCLE_OFFER,
  GALLERY_SOCIAL_GROUP,
}

const HomeScreen: React.FC<PropTypes> = ({ navigation }) => {
  const { user } = useAuth();
  const coordinates = useLocation();
  const [selOffer, setSelOffer] = React.useState<number | null>(null);
  const [filtering, setFiltering] = React.useState<string | null>(null);

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

  const onPressCategory = React.useCallback((category: string) => {
    setFiltering((prevState) => (prevState === category ? null : category));
  }, []);

  const data = React.useMemo(
    () =>
      filtering
        ? [
            {
              title: "All Sustainabytes",
              key: "5",
              data: restaurants,
              type: SectionType.GALLERY_RESTAURANT,
              horizontal: false,
            },
          ]
        : [
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
    [filtering, restaurants, offers, socialGroups]
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
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
        renderItem={({ item: section }) => (
          <View>
            <View>
              <View style={[styles.hRow, styles.center, styles.spaceBetween]}>
                <Text style={styles.title}>{section.title}</Text>
                <FontAwesome5
                  name="arrow-circle-right"
                  size={24}
                  color="#4b9193"
                />
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
              renderItem={({ item, index }) => {
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
                      <TouchableOpacity onPress={() => setSelOffer(index)}>
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
});

export default HomeScreen;
