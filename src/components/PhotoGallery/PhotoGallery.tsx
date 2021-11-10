import * as React from "react";
import { ScrollView, View, Image, StyleSheet, Dimensions } from "react-native";

type PropTypes = {
  photos: string[];
};

const PhotoGallery: React.FC<PropTypes> = ({ photos }) => (
  <View style={styles.container}>
    <ScrollView style={styles.scroll} horizontal pagingEnabled>
      {photos.map((photo) => (
        <Image
          key={photo}
          style={styles.image}
          source={{
            uri: photo,
          }}
        />
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
  },
  scroll: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").width,
    resizeMode: "cover",
    backgroundColor: "#ccc",
  },
});

export default PhotoGallery;
