import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import SingleReview from "../../../components/Review";
import type { TabNavParamList } from "../types";
import { fetchReviews } from "../../../actions/review";
import type { Review } from "../../../types/Review";

type PropTypes = BottomTabScreenProps<TabNavParamList, "Discover">;

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
    <SafeAreaView style={styles.container}>
      <FlatList
        data={reviews}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback key={item.id} onPress={() => onPress(item)}>
            <SingleReview review={item} />
          </TouchableWithoutFeedback>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DiscoverScreen;
