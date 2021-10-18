import * as React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "react-query";
import dayjs from "dayjs";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import TopBar from "./TopBar";
import PhotoGallery from "./PhotoGallery";
import { fetchUser } from "../../actions/user";
import { fetchRestaurant } from "../../actions/restaurant";
import type { User } from "../../types/User";
import type { Review } from "../../types/Review";
import { Restaurant } from "../../types/Restaurant";

type PropTypes = {
  review: Review;
};

const crownColor = (selected: boolean) => (selected ? "#d7bd38" : "#b4b4b4");
const heartColor = (selected: boolean) => (selected ? "#db2f2f" : "#b4b4b4");
const iconColor = "#404040";

const SingleReview: React.FC<PropTypes> = ({ review }) => {
  const {
    user: userId,
    restaurant: restaurantId,
    photos,
    body,
    score,
    createdAt,
    tags,
  } = review;
  const { data: user } = useQuery<User, Error>(["user", userId], fetchUser);
  const { data: restaurant } = useQuery<Restaurant, Error>(
    ["restaurant", restaurantId],
    fetchRestaurant
  );

  const crownImage = React.useCallback(() => {
    console.log("Crowned image");
  }, []);

  const likeImage = React.useCallback(() => {
    console.log("Liked image");
  }, []);

  const shareImage = React.useCallback(() => {
    console.log("Shared image");
  }, []);

  if (!user || !restaurant) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TopBar user={user} />
      <PhotoGallery photos={photos} />
      <View style={styles.bottomBar}>
        <View style={styles.restInfo}>
          <Image
            style={styles.avatar}
            source={{
              uri: restaurant.avatarUrl,
            }}
          />
          <View style={styles.nameTags}>
            <Text style={styles.restName}>{restaurant.name}</Text>
            <ScrollView horizontal>
              {tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text>#{tag}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.button} onPress={crownImage}>
            <FontAwesome5 name="crown" size={24} color={crownColor(true)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={likeImage}>
            <FontAwesome name="heart" size={24} color={heartColor(true)} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={shareImage}>
            <FontAwesome5 name="paper-plane" size={24} color={iconColor} />
          </TouchableOpacity>
          <View style={styles.filler} />
          <FontAwesome5 name="map-marker-alt" size={24} color={iconColor} />
        </View>
        <Text style={styles.scoreRow}>
          Earned {score} sustainabytes * level 6
          <Text style={styles.date}>{dayjs(createdAt).format("MMM D")}</Text>
        </Text>
        <View style={styles.spacer} />
        <View style={styles.bodyRow}>
          <Text>{body}</Text>
        </View>
        <View />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#fff",
    marginBottom: 8,
  },
  bottomBar: {
    // flex: 1,
    padding: 8,
    backgroundColor: "#ffffff",
  },
  restInfo: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 12,
    marginRight: 8,
  },
  nameTags: {
    flex: 1,
  },
  restName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: "#77bd67",
    color: "#000",
    marginHorizontal: 4,
  },
  buttonRow: {
    // flex: 1,
    display: "flex",
    flexDirection: "row",
    marginVertical: 4,
  },
  button: {
    marginHorizontal: 4,
  },
  filler: {
    flex: 1,
  },
  scoreRow: {
    // flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 4,
  },
  date: {
    position: "absolute",
    right: 8,
  },
  spacer: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 4,
  },
  bodyRow: {
    // flex: 1,
    fontSize: 14,
    marginVertical: 4,
  },
});

export default SingleReview;