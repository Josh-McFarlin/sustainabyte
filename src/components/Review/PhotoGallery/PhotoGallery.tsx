import * as React from "react";
import { View, Image, StyleSheet, Dimensions } from "react-native";

type PropTypes = {
  photos: string[];
};

const PhotoGallery: React.FC<PropTypes> = ({ photos }) => {
  const [index, setIndex] = React.useState<number>(0);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{
          uri: photos[index],
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: "#fff",
    backgroundColor: "#06d953",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    flex: 1,
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").width,
    maxWidth: 500,
    maxHeight: 500,
    resizeMode: "cover",
  },
});

export default PhotoGallery;
