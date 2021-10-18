import * as React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import type { Restaurant } from "../../types/Restaurant";

type PropTypes = {
  restaurant: Restaurant;
};

const GalleryRestaurant: React.FC<PropTypes> = ({ restaurant }) => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={{
        uri: restaurant.avatarUrl,
      }}
    />
    <Text style={styles.name}>{restaurant.name}</Text>
    <View style={styles.secondaryContainer}>
      <Text style={styles.secondary}>{restaurant.numCrowns}</Text>
      <FontAwesome5 name="crown" size={12} color="#c2a93f" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginRight: 8,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "cover",
    marginBottom: 6,
  },
  secondaryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  secondary: {
    fontSize: 12,
    marginRight: 4,
  },
});

export default GalleryRestaurant;
