/* eslint-disable react/no-array-index-key */
import * as React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import type { Restaurant } from "../../types/Restaurant";

type PropTypes = {
  restaurant: Restaurant;
};

const ListRestaurant: React.FC<PropTypes> = ({ restaurant }) => {
  const rating = restaurant.ratings.sum / restaurant.ratings.count;

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: restaurant.avatarUrl,
        }}
      />
      <View style={styles.restInfo}>
        <View style={styles.primaryContainer}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <FontAwesome5 name="heart" size={16} color="#585858" />
        </View>
        <View style={styles.secondaryContainer}>
          <Text style={styles.secondary}>{rating}.0</Text>
          <View style={styles.secondaryContainer}>
            {Array.from(Array(5)).map((_, i) => (
              <FontAwesome
                key={i}
                name="star"
                size={13}
                color={i < rating ? "#cbb131" : "#585858"}
              />
            ))}
          </View>
          <Text style={styles.secondary}>({restaurant.ratings.count})</Text>
          <FontAwesome5 name="crown" size={12} color="#585858" />
          <Text style={styles.secondary}>
            {restaurant.sustainability.vegan}%
          </Text>
          <FontAwesome5 name="crown" size={12} color="#585858" />
          <Text style={styles.secondary}>
            {restaurant.sustainability.vegetarian}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    shadowColor: "#000",
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
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
  primaryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
  },
});

export default ListRestaurant;
