import * as React from "react";
import { Image, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { hashtagsToIcons } from "../../utils/tags";
import { RestaurantType } from "../../types/Restaurant";

interface PropTypes {
  restaurant: RestaurantType;
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
          <View style={styles.hRow}>
            {restaurant.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      <View style={[styles.secondaryContainer, styles.marginBottom]}>
        <Text style={styles.secondary}>{rating.toFixed(1)}</Text>
        <View style={styles.secondaryContainer}>
          {Array.from(Array(5)).map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={14}
              color={i < rating ? "#3C8D90" : "#8B8B8B"}
              style={styles.star}
            />
          ))}
        </View>
        <Text style={styles.secondary}>({restaurant.ratings.count})</Text>
        {restaurant.tags.map((tag) => (
          <React.Fragment key={tag}>
            {Object.prototype.hasOwnProperty.call(hashtagsToIcons, tag) ? (
              <Image style={styles.tagIcon} source={hashtagsToIcons[tag]} />
            ) : (
              <Text style={styles.tagIcon}>{tag.charAt(0).toUpperCase()}</Text>
            )}
            {Object.prototype.hasOwnProperty.call(
              restaurant.menuPercents,
              tag
            ) && (
              <Text style={styles.secondary}>
                {restaurant.menuPercents[tag]}%
              </Text>
            )}
          </React.Fragment>
        ))}
        <Text style={styles.secondary}>•</Text>
        <Text style={styles.secondary}>$$</Text>
        <Text style={styles.secondary}>•</Text>
        <Text style={styles.secondary}>0.5mi</Text>
      </View>
      <View style={[styles.secondaryContainer, styles.marginBottom]}>
        <Text style={styles.secondary}>Open</Text>
        <Text style={styles.secondary}>•</Text>
        <Text style={styles.secondary}>Closes 2:30PM</Text>
        <Text style={styles.secondary}>•</Text>
        <Text style={styles.secondary}>Reopens 5:30PM</Text>
      </View>
      <View style={[styles.secondaryContainer, styles.marginBottom]}>
        <Text style={styles.secondary}>Dine-in</Text>
        <Text style={styles.secondary}>•</Text>
        <Text style={styles.secondary}>Takeout</Text>
        <Text style={styles.secondary}>•</Text>
        <Text style={styles.secondary}>Delivery</Text>
      </View>
      <View style={[styles.secondaryContainer, styles.spaceBetween]}>
        <TouchableOpacity style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Reserve A Table</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonContainer}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Order Online</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  restInfo: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: "#ccc",
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
    marginRight: 8,
  },
  tagText: {
    fontSize: 15,
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
    fontSize: 15,
    marginRight: 4,
    color: "#7C9293",
  },
  tagIcon: {
    width: 18,
    height: 14,
    resizeMode: "contain",
  },
  star: {
    marginHorizontal: 1,
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  buttonContainer: {
    flex: 1,
    paddingHorizontal: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: "#3B8D90",
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
  },
  buttonText: {
    color: "#3B8D90",
    fontSize: 16,
  },
  marginBottom: {
    marginBottom: 8,
  },
  hRow: {
    flexDirection: "row",
  },
});

export default SheetContents;
