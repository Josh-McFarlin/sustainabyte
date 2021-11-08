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
  TouchableWithoutFeedback,
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { createReview } from "../../../actions/review";
import { hashtags } from "../../../utils/tags";
import { StackNavParamList } from "../types";

const useSelect = Platform.select({ web: true, default: false });

type PropTypes = NativeStackScreenProps<StackNavParamList, "UploadPost">;

const UploadReviewScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { restaurant } = route.params;
  const [pictures, setPictures] = React.useState<string[]>([]);
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
        photoUrls: pictures,
      });
      navigation.navigate("RestaurantProfile", {
        isOwnProfile: false,
        isFollowing: false,
        id: restaurant._id,
      });
    } catch (error) {
      console.log("Error", error?.message || error);
    }
  }, [navigation, restaurant._id, pictures, caption, selTags, rating]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleUpload}>
          <Text>Next</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleUpload]);

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
    });

    if (result?.cancelled === false) {
      setPictures((prevState) => [...prevState, result?.uri]);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result.cancelled === false) {
      setPictures((prevState) => [...prevState, result?.uri]);
    }
  };

  const selectType = async (): Promise<void> => {
    if (useSelect) {
      return pickImage();
    }

    return Alert.alert("New Post", "Select a Photo", [
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
            multiline
            numberOfLines={3}
            onChangeText={setCaption}
            value={caption}
            placeholder="Share your experience"
            placeholderTextColor="#848484"
          />
        </View>
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
        <ScrollView horizontal>
          {pictures.map((picture, index) => (
            <TouchableOpacity
              key={picture}
              style={styles.imageSpacer}
              onPress={() =>
                setPictures((prevState) =>
                  prevState.filter((_, i) => i !== index)
                )
              }
            >
              <View style={styles.section}>
                <Image
                  style={styles.image}
                  source={{
                    uri: picture,
                  }}
                />
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={selectType} style={styles.imageSpacer}>
            <View style={styles.section}>
              <View style={styles.image}>
                <MaterialIcons name="add-a-photo" size={48} color="#3C8D90" />
                <Text>Take a picture</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScrollView>
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
    width: 200,
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    minHeight: 32,
    maxHeight: 60,
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
  imageSpacer: {
    marginRight: 8,
  },
});

export default UploadReviewScreen;
