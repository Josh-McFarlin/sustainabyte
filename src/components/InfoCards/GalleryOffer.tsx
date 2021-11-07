import * as React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import type { OfferType } from "../../types/Offer";

type PropTypes = {
  offer: OfferType;
  onPress: () => void;
};

const bgColors = [
  "#6EAC88",
  "#98D1D3",
  "#CC998D",
  "#586994",
  "#E3655B",
  "#694F5D",
  "#0081A7",
  "#E0A458",
  "#7D5BA6",
  "#F2C57C",
];

const GalleryOffer: React.FC<PropTypes> = ({ offer, onPress }) => (
  <View
    style={[
      styles.container,
      {
        backgroundColor: bgColors[Math.floor(Math.random() * bgColors.length)],
      },
    ]}
  >
    <View style={styles.restInfo}>
      <Text style={styles.title}>{offer.title}</Text>
      <Text>{offer.body}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{offer.prompt || "Order Now"}</Text>
      </TouchableOpacity>
    </View>
    <Image
      style={styles.image}
      source={{
        uri: offer.photoUrl,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: Math.min(360, Dimensions.get("window").width * 0.8),
    height: 150,
    display: "flex",
    flexDirection: "row",
  },
  restInfo: {
    flex: 1,
    margin: 12,
    alignItems: "flex-start",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 50,
    marginTop: "auto",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: "#888",
  },
});

export default GalleryOffer;
