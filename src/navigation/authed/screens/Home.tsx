import * as React from "react";
import {
  Text,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
  SectionList,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import { useLocation } from "../../../utils/location";
import { fetchRestaurants } from "../../../actions/restaurant";
import type { AuthedNavParamList } from "../types";
import { Restaurant } from "../../../types/Restaurant";
import {
  ListRestaurant,
  GalleryRestaurant,
  GalleryOffer,
} from "../../../components/MiniRestaurant";
import { Offer } from "../../../types/Offer";
import { fetchOffers } from "../../../actions/offer";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Home">;

enum SectionType {
  LIST_RESTAURANT,
  GALLERY_RESTAURANT,
  GALLERY_OFFER,
}

const HomeScreen: React.FC<PropTypes> = () => {
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
        data: [restaurants],
        type: SectionType.GALLERY_RESTAURANT,
        horizontal: true,
      },
      {
        title: "We thought you may like",
        key: "2",
        data: [restaurants],
        type: SectionType.GALLERY_RESTAURANT,
        horizontal: true,
      },
      {
        title: "Top updates for you",
        key: "3",
        data: [offers],
        type: SectionType.GALLERY_OFFER,
        horizontal: true,
      },
      {
        title: "All Sustainabytes",
        key: "4",
        data: [restaurants],
        type: SectionType.LIST_RESTAURANT,
        horizontal: false,
      },
    ],
    [restaurants, offers]
  );

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        style={styles.container}
        sections={data as any}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.title}>{title}</Text>
        )}
        renderItem={({ item: sectionData, section }) => (
          <FlatList
            data={sectionData}
            horizontal={section.horizontal}
            keyExtractor={(_, index) => section.key + index}
            renderItem={({ item }) => {
              if (section.type === SectionType.LIST_RESTAURANT) {
                return (
                  <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => onPress(item)}
                  >
                    <ListRestaurant restaurant={item} />
                  </TouchableWithoutFeedback>
                );
              }
              if (section.type === SectionType.GALLERY_RESTAURANT) {
                return (
                  <TouchableWithoutFeedback
                    key={item.id}
                    onPress={() => onPress(item)}
                  >
                    <GalleryRestaurant restaurant={item} />
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
    padding: 8,
  },
  scrollContainer: {
    padding: 8,
  },
  group: {
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
});

export default HomeScreen;
