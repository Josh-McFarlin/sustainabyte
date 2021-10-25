import * as React from "react";
import { Image, ScrollView, Text, View, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Restaurant } from "../../types/Restaurant";

interface PropTypes {
  restaurant: Restaurant;
}

const SheetContents: React.FC<PropTypes> = ({ restaurant }) => {
  const rating = restaurant.ratings.sum / restaurant.ratings.count;

  return (
    <View>
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
            {restaurant.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text>#{tag}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
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
  restInfo: {
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
  image: {
    flex: 1,
    resizeMode: "cover",
    marginBottom: 6,
    borderRadius: 16,
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

export default SheetContents;
