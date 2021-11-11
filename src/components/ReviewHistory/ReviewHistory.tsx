import * as React from "react";
import {
  StyleSheet,
  View,
  Text,
  ListRenderItem,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { ListReview } from "../InfoCards";
import type { ReviewType } from "../../types/Review";
import { RestaurantType } from "../../types/Restaurant";
import { AuthNavigationProp } from "../../navigation/authed/types";

export const renderItem: ListRenderItem<ReviewType> = ({ item }) => (
  <View style={styles.item}>
    <ListReview review={item} />
  </View>
);

type PropTypes = {
  restaurant: RestaurantType;
  avgRating: number;
  totalReviews: number;
  stars: [number, number, number, number, number];
  tags: string[];
};

export const Header: React.FC<PropTypes> = ({
  restaurant,
  avgRating,
  totalReviews,
  stars,
  tags,
}) => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("UploadReview", {
            restaurant,
          })
        }
      >
        <View
          style={[styles.leaveContainer, styles.hRow, styles.paddingHorizontal]}
        >
          <FontAwesome name="pencil" size={16} color="#3C8D90" />
          <Text style={styles.leaveText}>Leave a review</Text>
        </View>
      </TouchableOpacity>
      <View style={[styles.line, styles.marginBottom]} />
      <Text
        style={[
          styles.headerText,
          styles.paddingHorizontal,
          styles.marginBottom,
        ]}
      >
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
        <Text style={[styles.secondaryText, styles.marginRight]}>
          {avgRating.toFixed(1)}
        </Text>
        <View style={[styles.hRow]}>
          {Array.from(Array(5)).map((_, i) => (
            <FontAwesome
              key={i}
              name="star"
              size={17}
              color={avgRating >= i + 1 ? "#3C8D90" : "#8B8B8B"}
              style={styles.star}
            />
          ))}
        </View>
        <Text style={[styles.minorText, styles.textEnd]}>({totalReviews})</Text>
      </View>
      <View
        style={[
          styles.paddingHorizontal,
          styles.barContainer,
          styles.marginBottom,
        ]}
      >
        {stars.map((percent, index) => (
          <View key={`${index} ${percent}`} style={styles.outerBar}>
            <View
              style={[
                styles.innerBar,
                {
                  width: `${percent * 100}%`,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <Text
        style={[
          styles.headerText,
          styles.paddingHorizontal,
          styles.marginBottom,
        ]}
      >
        People often mention
      </Text>
      <View style={[styles.marginBottom, styles.paddingHorizontal]}>
        <ScrollView horizontal>
          {tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </ScrollView>
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
    paddingHorizontal: 24,
  },
  header: {
    //
  },
  headerText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "700",
  },
  secondaryText: {
    fontSize: 18,
    color: "#000",
    fontWeight: "600",
  },
  minorText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  marginRight: {
    marginRight: 4,
  },
  star: {
    marginHorizontal: 2,
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
  barContainer: {
    maxWidth: 360,
  },
  outerBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#A2A2A2",
    marginBottom: 8,
    overflow: "hidden",
    borderRadius: 8,
  },
  innerBar: {
    height: "100%",
    backgroundColor: "#3C8D90",
    borderRadius: 8,
  },
  textEnd: {
    flex: 1,
    textAlign: "right",
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    color: "#000",
    marginRight: 4,
    borderColor: "#A7A4A4",
    borderWidth: 1,
  },
  tagText: {
    fontWeight: "500",
  },
  item: {
    marginBottom: 12,
    paddingHorizontal: 24,
  },
});

export const listProps = {
  style: styles.list,
};
