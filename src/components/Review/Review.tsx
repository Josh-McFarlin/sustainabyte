import * as React from "react";
import { View, ScrollView, Text, Image, StyleSheet } from "react-native";
import { useQuery } from "react-query";
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

const SingleReview: React.FC<PropTypes> = ({ review }) => {
  const {
    user: userId,
    restaurant: restaurantId,
    photos,
    body,
    score,
    stars,
    tags,
  } = review;
  const { data: user } = useQuery<User, Error>(["user", userId], fetchUser);
  const { data: restaurant } = useQuery<Restaurant, Error>(
    ["restaurant", restaurantId],
    fetchRestaurant
  );

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
                <Text key={tag} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <Text>buttons</Text>
        </View>
        <Text style={styles.scoreRow}>
          Earned {score} sustainabytes * level 6
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
    marginVertical: 8,
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
    marginVertical: 4,
  },
  scoreRow: {
    // flex: 1,
    fontWeight: "bold",
    fontSize: 12,
    marginVertical: 4,
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
