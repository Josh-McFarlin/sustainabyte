import * as React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  SectionList,
  View,
  Image,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { FontAwesome5 } from "@expo/vector-icons";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import type { AuthedNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import {
  GalleryRestaurant,
  GalleryOffer,
  GallerySocialGroup,
} from "../../../components/InfoCards";
import type { Offer } from "../../../types/Offer";
import type { SocialGroup } from "../../../types/SocialGroup";
import { fetchOffers } from "../../../actions/offer";
import { fetchSocialGroups } from "../../../actions/socialGroup";
import { useAuth } from "../../../utils/auth";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Home">;

enum SectionType {
  LIST_RESTAURANT,
  GALLERY_RESTAURANT,
  GALLERY_OFFER,
  GALLERY_SOCIAL_GROUP,
}

const HomeScreen: React.FC<PropTypes> = () => {
  const { user } = useAuth();
  const coordinates = useLocation();

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

  const onPressOffer = (offer: Offer) => {
    console.log(offer.id);
  };

  const onPress = (restaurant: Restaurant) => {
    console.log(restaurant.id);
  };

  console.log("offers:", offers);
  console.log("restaurants:", restaurants);

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
        key: "3",
        data: ["3", offers],
        type: SectionType.GALLERY_OFFER,
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
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={[styles.title, styles.noMargin]}>{title}</Text>
            <FontAwesome5 name="arrow-circle-right" size={24} color="#4b9193" />
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
            renderItem={({ item }) => {
              if (section.type === SectionType.GALLERY_RESTAURANT) {
                return (
                  <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => onPress(item)}
                  >
                    <GalleryRestaurant
                      style={section.horizontal ? styles.hRest : styles.vRest}
                      restaurant={item}
                    />
                  </TouchableWithoutFeedback>
                );
              }
              if (section.type === SectionType.GALLERY_SOCIAL_GROUP) {
                return (
                  <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => onPress(item)}
                  >
                    <GallerySocialGroup group={item} />
                  </TouchableWithoutFeedback>
                );
              }
              return (
                <GalleryOffer
                  key={item.id}
                  offer={item as unknown as Offer}
                  onPress={() => onPressOffer(item as unknown as Offer)}
                />
              );
            }}
          />
        )}
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
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
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
  sectionHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noMargin: {
    margin: 0,
  },
});

export default HomeScreen;
