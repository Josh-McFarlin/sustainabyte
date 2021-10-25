import * as React from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import type { Review } from "../../types/Review";

type PropTypes = {
  posts: Review[];
};

const PostGallery: React.FC<PropTypes> = ({ posts }) => {
  console.log("posts", posts);

  const onPress = (review: Review) => {
    console.log(review.id);
  };

  return (
    <FlatList
      style={styles.container}
      data={posts}
      keyExtractor={(i) => i.id}
      numColumns={3}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.post}
          key={item.id}
          onPress={() => onPress(item)}
        >
          <Image
            style={styles.image}
            source={{
              uri: item.photos[0],
            }}
          />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginVertical: 4,
    marginHorizontal: 2,
  },
  post: {
    width: Dimensions.get("screen").width / 3,
    height: Dimensions.get("screen").width / 3,
    padding: 2,
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "#ccc",
  },
});

export default PostGallery;
