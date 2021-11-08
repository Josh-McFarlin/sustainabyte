import * as React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Platform,
  TextInput,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { createReview } from "../../actions/review";
import { hashtags } from "../../utils/tags";
import { RestaurantType } from "../../types/Restaurant";

interface PropTypes {
  open: boolean;
  handleClose: () => void;
  restaurant: RestaurantType;
}

const ReviewModal: React.FC<PropTypes> = ({
  open,
  handleClose,
  restaurant,
}) => {
  const [picture, setPicture] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState<string>("");
  const [selTags, setTags] = React.useState<string[]>([]);
  const [tagSearch, setTagSearch] = React.useState<string>("");
  const [showingSearch, setShowingSearchBase] = React.useState<string>("");
  const [rating, setRating] = React.useState<number>(3);

  const handleUpload = React.useCallback(async () => {
    try {
      await createReview({
        restaurant: restaurant._id,
        stars: rating,
        body: caption,
        tags: selTags,
        photoUrls: [picture],
      });
      handleClose();
    } catch (error) {
      console.log("Error", error?.message || error);
    }
  }, [handleClose, restaurant._id, picture, caption, selTags, rating]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debChange = React.useCallback(debounce(setTagSearch, 500), [
    setTagSearch,
  ]);

  const setShowingSearch = (text: string) => {
    setShowingSearchBase(text);
    debChange(text);
  };

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Error",
            "Sorry, we need camera roll permissions to make this work!"
          );
        }
      }
    })();
  }, []);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result?.cancelled === false) {
      setPicture(result?.uri);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (result.cancelled === false) {
      setPicture(result.uri);
    }
  };

  const selectType = () => {
    Alert.alert("New Post", "Select a Photo", [
      {
        text: "Pick from Gallery",
        onPress: pickImage,
      },
      {
        text: "Take a Photo",
        onPress: takePhoto,
      },
    ]);
  };

  const toggleTag = React.useCallback(
    (item: string) =>
      setTags((prevState) => {
        const newTags = new Set(prevState);

        if (newTags.has(item)) {
          newTags.delete(item);
        } else {
          newTags.add(item);
        }

        return [...newTags];
      }),
    []
  );

  const orderedTags = React.useMemo(() => {
    const selSet = new Set(selTags);
    const lowerSearch = tagSearch.toLowerCase();

    return [
      ...selTags,
      ...hashtags.filter(
        (i) =>
          !selSet.has(i) && (tagSearch.length === 0 || i.includes(lowerSearch))
      ),
    ];
  }, [selTags, tagSearch]);

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.flex}>
        <ScrollView style={styles.scroll}>
          <KeyboardAvoidingView style={styles.container} behavior="position">
            <View style={[styles.section, styles.hRow]}>
              <FontAwesome5
                style={styles.inputIcon}
                name="map-pin"
                size={18}
                color="#3C8D90"
              />
              <TextInput
                style={styles.input}
                value={restaurant.name}
                placeholder="Check into a restaurant"
                placeholderTextColor="#848484"
              />
            </View>
            <TouchableOpacity onPress={selectType}>
              <View style={styles.section}>
                {picture ? (
                  <Image
                    style={styles.image}
                    source={{
                      uri: picture,
                    }}
                  />
                ) : (
                  <View style={styles.image}>
                    <MaterialIcons
                      name="add-a-photo"
                      size={48}
                      color="#3C8D90"
                    />
                    <Text>Take a picture</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <View style={styles.bigMargin}>
              <View style={[styles.hRow, styles.section, styles.smallMargin]}>
                <FontAwesome5
                  style={styles.inputIcon}
                  name="hashtag"
                  size={18}
                  color="#3C8D90"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setShowingSearch}
                  value={showingSearch}
                  placeholder="Search & Add hashtags"
                  placeholderTextColor="#848484"
                />
                {showingSearch.length > 0 && (
                  <FontAwesome
                    style={styles.inputIcon}
                    name="close"
                    size={18}
                    color="#3C8D90"
                    onPress={() => {
                      setTagSearch("");
                      setShowingSearchBase("");
                    }}
                  />
                )}
              </View>
              <FlatList
                horizontal
                data={orderedTags}
                keyExtractor={(i) => i}
                renderItem={({ item }) => (
                  <TouchableWithoutFeedback onPress={() => toggleTag(item)}>
                    <View
                      style={[
                        styles.touchable,
                        styles.selectableItem,
                        selTags.includes(item)
                          ? styles.itemSelected
                          : styles.itemUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          selTags.includes(item)
                            ? styles.whiteText
                            : styles.blackText,
                        ]}
                      >
                        #{item}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                )}
              />
            </View>
            <View>
              <Text style={[styles.sectionHeader, styles.smallMargin]}>
                Rate & Review
              </Text>
              <View style={[styles.hRow, styles.smallMargin]}>
                {Array.from(Array(5)).map((_, i) => (
                  <FontAwesome
                    style={styles.star}
                    key={i}
                    name="star"
                    size={24}
                    color={i < rating ? "#cbb131" : "#585858"}
                    onPress={() => setRating(i + 1)}
                  />
                ))}
              </View>
              <View style={[styles.section, styles.hRow]}>
                <FontAwesome
                  style={styles.inputIcon}
                  name="pencil"
                  size={18}
                  color="#3C8D90"
                />
                <TextInput
                  style={styles.input}
                  onChangeText={setCaption}
                  value={caption}
                  placeholder="Share your experience"
                  placeholderTextColor="#848484"
                />
              </View>
            </View>
            <View style={[styles.section, styles.hRow]}>
              <TouchableOpacity onPress={handleUpload}>
                <Text>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 8,
    // backgroundColor: "red",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#ffffff",
    // backgroundColor: "green",
  },
  section: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#707070",
    marginBottom: 16,
  },
  image: {
    width: Dimensions.get("screen").width - 32,
    height: Dimensions.get("screen").width - 32,
    resizeMode: "contain",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    minHeight: 32,
    flex: 1,
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    marginRight: 8,
  },
  selectableItem: {
    borderWidth: 1,
    borderColor: "#3C8D90",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemSelected: {
    backgroundColor: "#3C8D90",
  },
  itemUnselected: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
  },
  whiteText: {
    color: "#fff",
  },
  blackText: {
    color: "#000",
  },
  touchable: {
    marginRight: 8,
  },
  smallMargin: {
    marginBottom: 8,
  },
  bigMargin: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
  },
  star: {
    marginHorizontal: 3,
  },
});

export default ReviewModal;
