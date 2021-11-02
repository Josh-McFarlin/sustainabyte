import * as React from "react";
import { StyleSheet, View, Text, ListRenderItem } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ListReview } from "../InfoCards";
import type { Review } from "../../types/Review";
import { Restaurant } from "../../types/Restaurant";

type PropTypes = {
  restaurant: Restaurant;
};

export const renderItem: ListRenderItem<Review> = ({ item }) => (
  <ListReview review={item} />
);

export const Header: React.FC<PropTypes> = ({ restaurant }) => {
  const rating = restaurant
    ? restaurant.ratings.sum / restaurant.ratings.count
    : 0;

  return (
    <View style={styles.header}>
      <View
        style={[styles.leaveContainer, styles.hRow, styles.paddingHorizontal]}
      >
        <FontAwesome name="pencil" size={16} color="#3C8D90" />
        <Text style={styles.leaveText}>Leave a review</Text>
      </View>
      <View style={styles.line} />
      <Text style={[styles.headerText, styles.paddingHorizontal]}>
        Ratings & Reviews
      </Text>
      <View
        style={[
          styles.hRow,
          styles.centerAlign,
          styles.marginBottom,
          styles.paddingHorizontal,
        ]}
      >
        <Text style={styles.headerText}>{rating.toFixed(1)}</Text>
        <View style={styles.hRow}>
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
        <Text style={styles.hRow}>({restaurant.ratings.count})</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  paddingHorizontal: {
    paddingHorizontal: 18,
  },
  header: {
    //
  },
  headerText: {
    fontSize: 18,
    color: "#000",
  },
  star: {
    marginHorizontal: 1,
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
  },
  marginBottom: {
    marginBottom: 8,
  },
  centerAlign: {
    alignItems: "center",
  },
  leaveContainer: {
    paddingVertical: 12,
  },
  leaveText: {
    marginLeft: 14,
    fontStyle: "italic",
  },
  line: {
    borderBottomWidth: 2,
    borderColor: "#D8D8D8",
  },
});

export const listProps = {
  style: styles.list,
};
