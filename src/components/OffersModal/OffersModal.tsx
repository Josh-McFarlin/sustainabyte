import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { view } from "@risingstack/react-easy-state";
import type { OfferType } from "../../types/Offer";
import { AuthNavigationProp } from "../../navigation/authed/types";
import restaurantsStore from "../../utils/restaurantData";

dayjs.extend(relativeTime);

type PropTypes = {
  offer: OfferType | null;
  goForward: () => void;
  goBack: () => void;
  handleClose: () => void;
};

const OffersModal: React.FC<PropTypes> = ({
  offer,
  goForward,
  goBack,
  handleClose,
}) => {
  const navigation = useNavigation<AuthNavigationProp>();
  const restaurant =
    offer?.restaurant != null ? restaurantsStore.get(offer.restaurant) : null;

  const handlePrompt = React.useCallback(() => {
    navigation.navigate("RestaurantProfile", {
      id: offer.restaurant,
      isOwnProfile: false,
      isFollowing: false,
    });
    handleClose();
  }, [navigation, offer, handleClose]);

  return (
    <Modal
      visible={offer != null}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.content}>
        <SafeAreaView style={styles.content}>
          <ImageBackground
            source={{ uri: offer?.photoUrl }}
            resizeMode="cover"
            style={styles.image}
          >
            <View style={styles.header}>
              <Image
                style={styles.restAvatar}
                source={{ uri: restaurant?.avatarUrl }}
              />
              <View style={styles.restInfo}>
                <Text style={styles.restText}>{restaurant?.name}</Text>
                <Text style={styles.restText}>
                  Expires {dayjs().to(offer?.expiresAt)}
                </Text>
              </View>
              <Pressable style={styles.button} onPress={handleClose}>
                <FontAwesome name="close" size={20} color="#fff" />
              </Pressable>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={goBack}>
                <View style={styles.button} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={goForward}>
                <View style={styles.button} />
              </TouchableOpacity>
            </View>
            <View style={styles.offerDetails}>
              <View style={styles.bg}>
                <Text style={styles.offerTitle}>{offer?.title}</Text>
                <Text style={styles.offerBody}>{offer?.body}</Text>
              </View>
            </View>
            <Pressable onPress={handlePrompt}>
              <View style={styles.prompt}>
                <FontAwesome5 name="chevron-up" size={24} color="#fff" />
                <Text style={styles.promptText}>{offer?.prompt}</Text>
              </View>
            </Pressable>
          </ImageBackground>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    backgroundColor: "#ccc",
  },
  image: {
    flex: 1,
    backgroundColor: "#ccc",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#00000050",
  },
  buttonContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
  },
  button: {
    flex: 1,
    backgroundColor: "#00000001",
  },
  restAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 8,
    backgroundColor: "#ccc",
  },
  restInfo: {
    flex: 1,
  },
  restText: {
    fontSize: 16,
    color: "#fff",
  },
  offerDetails: {
    // flex: 1,
  },
  offerTitle: {
    fontSize: 24,
    color: "#fff",
    paddingHorizontal: 16,
  },
  offerBody: {
    fontSize: 18,
    color: "#fff",
    paddingHorizontal: 16,
  },
  prompt: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#00000050",
    paddingTop: 16,
  },
  promptText: {
    marginVertical: 4,
    fontSize: 18,
    color: "#fff",
  },
  bg: {
    backgroundColor: "#00000050",
    paddingVertical: 64,
  },
});

export default view(OffersModal);
