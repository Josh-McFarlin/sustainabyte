import * as React from "react";
import { View, StyleSheet, FlatList, TouchableHighlight } from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import SingleReview from "../../../components/Review";
import type { AuthedNavParamList } from "../types";
import { fetchReviews } from "../../../actions/review";
import type { Review } from "../../../types/Review";

type PropTypes = BottomTabScreenProps<AuthedNavParamList, "Discover">;

const DiscoverScreen: React.FC<PropTypes> = () => {
  const { data: reviews } = useQuery<Review[], Error>(
    ["reviews"],
    fetchReviews,
    {
      initialData: [],
    }
  );

  console.log("reviews", reviews);

  const onPress = (review: Review) => {
    console.log(review.id);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableHighlight key={item.id} onPress={() => onPress(item)}>
            <SingleReview review={item} />
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DiscoverScreen;
