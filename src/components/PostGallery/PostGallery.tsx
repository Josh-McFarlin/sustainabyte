import * as React from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  View,
} from "react-native";
import type { Review } from "../../types/Review";

type PropTypes = {
  posts: Review[];
};

const numColumns = 3;

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
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View key={item.id} style={styles.post}>
          <TouchableOpacity style={styles.button} onPress={() => onPress(item)}>
            <Image
              style={styles.image}
              source={{
                uri: item.photos[0],
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const screenWidth = Dimensions.get("window").width;
const padding = 4;
const tileSize = screenWidth / numColumns;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginVertical: 4,
    marginHorizontal: 2,
  },
  post: {
    width: tileSize,
    height: tileSize,
    padding,
  },
  button: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "#ccc",
    borderRadius: 8,
  },
});

export default PostGallery;
