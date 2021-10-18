import * as React from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Alert,
  FlatList,
  TouchableWithoutFeedback,
  SafeAreaView,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import * as Location from "expo-location";
import { useAuth } from "../../../utils/auth";
import { fetchRestaurants } from "../../../actions/restaurant";
import type { AuthedNavParamList } from "../types";
import { Coordinates } from "../../../types/Location";
import { Restaurant } from "../../../types/Restaurant";
import {
  ListRestaurant,
  GalleryRestaurant,
  GalleryOffer,
} from "../../../components/MiniRestaurant";
import LocationBar from "../../../components/LocationBar";
import { Offer } from "../../../types/Offer";
import { fetchOffers } from "../../../actions/offer";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Home">;

const HomeScreen: React.FC<PropTypes> = () => {
  const { user } = useAuth();
  const [coordinates, setCoordinates] = React.useState<Coordinates | null>(
    null
  );

  React.useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission to access location was denied!");
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});

      setCoordinates({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
    })();
  }, []);

  const { data: offers } = useQuery<Offer[], Error>(
    ["offers", coordinates],
    fetchOffers,
    {
      enabled: coordinates != null,
    }
  );
  const { data: restaurants } = useQuery<Restaurant[], Error>(
    ["restaurants", coordinates],
    fetchRestaurants,
    {
      enabled: coordinates != null,
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

  return (
    <SafeAreaView style={styles.container}>
      <LocationBar />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.group}>
          <Text style={styles.title}>Trending Near You</Text>
          <FlatList
            horizontal
            data={offers}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <GalleryOffer
                key={item.id}
                offer={item}
                onPress={() => onPressOffer(item)}
              />
            )}
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Try Something New</Text>
          <FlatList
            horizontal
            data={restaurants}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => onPress(item)}
              >
                <GalleryRestaurant restaurant={item} />
              </TouchableWithoutFeedback>
            )}
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>Top Sustainabytes</Text>
          <FlatList
            horizontal
            data={restaurants}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => onPress(item)}
              >
                <GalleryRestaurant restaurant={item} />
              </TouchableWithoutFeedback>
            )}
          />
        </View>
        <View style={styles.group}>
          <Text style={styles.title}>All Sustainabytes</Text>
          <FlatList
            data={restaurants}
            keyExtractor={(i) => i.id}
            renderItem={({ item }) => (
              <TouchableWithoutFeedback
                key={item.id}
                onPress={() => onPress(item)}
              >
                <ListRestaurant restaurant={item} />
              </TouchableWithoutFeedback>
            )}
          />
        </View>
      </ScrollView>
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
