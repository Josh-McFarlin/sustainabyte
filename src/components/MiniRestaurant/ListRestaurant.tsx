import * as React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import type { Restaurant } from "../../types/Restaurant";

type PropTypes = {
  restaurant: Restaurant;
};

const ListRestaurant: React.FC<PropTypes> = ({ restaurant }) => (
  <View style={styles.container}>
    <Image
      style={styles.image}
      source={{
        uri: restaurant.avatarUrl,
      }}
    />
    <View style={styles.restInfo}>
      <Text style={styles.name}>{restaurant.name}</Text>
      <View style={styles.secondaryContainer}>
        <Text style={styles.secondary}>{restaurant.numCrowns}</Text>
        <FontAwesome5 name="crown" size={12} color="#c2a93f" />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 8,
    display: "flex",
    flexDirection: "row",
  },
  image: {
    width: 75,
    height: 75,
    resizeMode: "cover",
    marginRight: 6,
    borderRadius: 12,
  },
  restInfo: {
    //
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

export default ListRestaurant;
