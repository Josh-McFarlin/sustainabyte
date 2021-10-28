import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { useQuery } from "react-query";
import SingleReview from "../../../components/Review";
import type { TabNavParamList } from "../types";
import { fetchReviews } from "../../../actions/review";
import type { Review } from "../../../types/Review";
import SearchBar from "../../../components/SearchBar";

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

  const handleSearch = (search: string, tags: string[]) => {
    console.log(search, tags);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar onChange={handleSearch} />
      <FlatList
        style={styles.list}
        data={reviews}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback key={item.id} onPress={() => onPress(item)}>
            <SingleReview review={item} />
          </TouchableWithoutFeedback>
        )}
        ItemSeparatorComponent={() => <View style={styles.spacer} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  spacer: {
    height: 8,
    backgroundColor: "#D8D8D8",
  },
  list: {
    flex: 1,
  },
});

export default DiscoverScreen;
