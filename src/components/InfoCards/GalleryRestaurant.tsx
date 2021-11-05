/* eslint-disable react/no-array-index-key */
import * as React from "react";
import { View, Image, StyleSheet, Text, ViewStyle } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import type { RestaurantType } from "../../types/Restaurant";

type PropTypes = {
  // eslint-disable-next-line react/require-default-props
  style?: ViewStyle;
  restaurant: RestaurantType;
};

const GalleryRestaurant: React.FC<PropTypes> = ({ restaurant, style }) => {
  const rating = restaurant.ratings.sum / restaurant.ratings.count;

  return (
    <View style={[styles.container, style]}>
      <Image
        style={styles.image}
        source={{
          uri: restaurant.headerUrl,
        }}
      />
      <View style={styles.primaryContainer}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <FontAwesome5 name="heart" size={16} color="#585858" />
      </View>
      <View style={styles.secondaryContainer}>
        <Text style={styles.secondary}>{rating.toFixed(1)}</Text>
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
        <Image
          style={styles.vegan}
          source={require("../../../assets/icons/vegan.png")}
        />
        <Text style={styles.secondary}>{restaurant.sustainability.vegan}%</Text>
        <Image
          style={styles.healthy}
          source={require("../../../assets/icons/healthy.png")}
        />
        <Text style={styles.secondary}>
          {restaurant.sustainability.vegetarian}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    width: 300,
    height: 200,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    marginBottom: 6,
    borderRadius: 16,
    backgroundColor: "#888",
  },
  primaryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 8,
  },
  secondaryContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  secondary: {
    fontSize: 13,
    marginRight: 4,
  },
  vegan: {
    width: 18,
    height: 14,
    resizeMode: "contain",
  },
  healthy: {
    width: 18,
    height: 14,
    resizeMode: "contain",
  },
});

export default GalleryRestaurant;
