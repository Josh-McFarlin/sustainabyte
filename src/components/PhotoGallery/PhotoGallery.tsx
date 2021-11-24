import * as React from "react";
import {
  ScrollView,
  View,
  Image,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

type PropTypes = {
  photos: string[];
};

const PhotoGallery: React.FC<PropTypes> = ({ photos }) => {
  const window = useWindowDimensions();

  return (
    <View
      style={[
        styles.container,
        {
          width: window.width,
          height: window.width,
        },
      ]}
    >
      <ScrollView
        style={styles.scroll}
        horizontal
        pagingEnabled
        bounces={false}
        overScrollMode="never"
      >
        {photos.map((photo) => (
          <Image
            key={photo}
            style={[
              styles.image,
              {
                width: window.width,
                height: window.width,
              },
            ]}
            source={{
              uri: photo,
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    backgroundColor: "#ccc",
  },
});

export default PhotoGallery;
