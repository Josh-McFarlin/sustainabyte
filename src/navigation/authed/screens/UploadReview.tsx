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
  FlatList,
  ScrollView,
  ActivityIndicator,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { view } from "@risingstack/react-easy-state";
import { createReview } from "../../../actions/review";
import { hashtags } from "../../../utils/hashtags";
import { StackNavParamList } from "../types";
import StarRating from "../../../components/StarRating";
import Hashtag from "../../../components/Hashtag/Hashtag";
import { RestaurantType } from "../../../types/Restaurant";
import { fetchRestaurants } from "../../../actions/restaurant";
import {
  distanceBetween,
  formatAddress,
  useLocation,
} from "../../../utils/location";

const useSelect = Platform.select({ web: true, default: false });

type PropTypes = NativeStackScreenProps<StackNavParamList, "UploadPost">;

const UploadReviewScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const location = useLocation();
  const [restaurant, setRestaurant] = React.useState<RestaurantType>(
    route?.params?.restaurant as RestaurantType
  );
  const [pictures, setPictures] = React.useState<string[]>([]);
  const [caption, setCaption] = React.useState<string>("");
  const [selTags, setTags] = React.useState<string[]>([]);
  const [tagSearch, setTagSearch] = React.useState<string>("");
  const [rating, setRating] = React.useState<number>(3);
  const [uploading, setUploading] = React.useState<boolean>(false);
  const [restaurants, setRestaurants] = React.useState<RestaurantType[]>(
    restaurant != null ? [restaurant] : []
  );
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const [searchText, setSearchText] = React.useState<string>(
    restaurant?.name || ""
  );
  const [orderedTags, setOrderedTagsBase] = React.useState<string[]>(hashtags);

  const handleUpload = React.useCallback(async () => {
    try {
      setUploading(true);

      if (restaurant == null || pictures == null || caption.length === 0) {
        throw new Error("Please provide all fields!");
      }

      await createReview({
        restaurant: restaurant._id,
        stars: rating,
        body: caption,
        tags: selTags,
        photoUrls: pictures,
      });
      navigation.navigate("RestaurantProfile", {
        id: restaurant._id,
      });
    } catch (error) {
      console.log("Error", error?.message || error);
      Alert.alert("Error", error?.message);
      console.error(error);
    } finally {
      setUploading(false);
    }
  }, [navigation, restaurant._id, pictures, caption, selTags, rating]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.hRow}>
          <TouchableOpacity onPress={handleUpload} disabled={uploading}>
            <Text>Next </Text>
          </TouchableOpacity>
          <ActivityIndicator
            animating={uploading}
            hidesWhenStopped
            size="small"
            color="#0000ff"
          />
        </View>
      ),
    });
  }, [navigation, handleUpload, uploading]);

  const debChange = React.useCallback(
    debounce(async (name: string) => {
      try {
        const rests = await fetchRestaurants({
          queryKey: [
            "restSearch",
            location,
            {
              name,
            },
          ],
          meta: {},
        });

        setRestaurants(rests);
      } catch (error) {
        console.error("Error", error?.message || error);
        Alert.alert("Error", "Failed to search for restaurants!");
      }
    }, 500),
    []
  );

  const setRestaurantSearch = (text: string) => {
    setSearchText(text);
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

        const { status: camStatus } =
          await ImagePicker.requestCameraPermissionsAsync();

        if (camStatus !== "granted") {
          Alert.alert(
            "Error",
            "Sorry, we need camera permissions to make this work!"
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

  const setOrderedTags = React.useCallback(
    debounce((selSet: Set<string>, search: string) => {
      const lowerSearch = search.toLowerCase();

      setOrderedTagsBase([
        ...selSet,
        ...hashtags.filter(
          (i) =>
            !selSet.has(i) && (search.length === 0 || i.includes(lowerSearch))
        ),
      ]);
    }, 100),
    []
  );

  const toggleTag = React.useCallback(
    (item: string) =>
      setTags((prevState) => {
        const newTags = new Set(prevState);

        if (newTags.has(item)) {
          newTags.delete(item);
        } else {
          newTags.add(item);
        }

        setOrderedTags(newTags, tagSearch);
        return [...newTags];
      }),
    [tagSearch]
  );

  if (isSearching) {
    return (
      <View style={styles.scroll}>
        <KeyboardAvoidingView style={styles.container}>
          <View style={[styles.section, styles.hRow]}>
            <FontAwesome5
              style={styles.inputIcon}
              name="map-pin"
              size={18}
              color="#3C8D90"
            />
            <TextInput
              autoFocus
              style={styles.input}
              value={searchText}
              onChangeText={setRestaurantSearch}
              placeholder="Check into a restaurant"
              placeholderTextColor="#848484"
            />
          </View>
          <FlatList
            data={restaurants}
            keyExtractor={(i) => i._id}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  setRestaurant(item);
                  setIsSearching(false);
                }}
              >
                <View style={[styles.restListItem, styles.hRow]}>
                  <View style={styles.center}>
                    <View style={styles.bigCircle}>
                      <FontAwesome5
                        name="map-marker-alt"
                        color="#727272"
                        size={24}
                      />
                    </View>
                    <Text style={styles.distText}>
                      {distanceBetween(location, {
                        latitude: item.coordinates.coordinates[0],
                        longitude: item.coordinates.coordinates[1],
                      }).toFixed(1)}{" "}
                      mi
                    </Text>
                  </View>
                  <View style={styles.restListText}>
                    <Text
                      style={styles.restListTitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                    <Text
                      style={styles.restListSubtitle}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {formatAddress(item.address)}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={() => (
              <View style={[styles.restListItem, styles.hRow]}>
                <View style={styles.center}>
                  <View style={styles.bigCircle}>
                    <FontAwesome5
                      name="map-marker-alt"
                      color="#727272"
                      size={24}
                    />
                  </View>
                  <Text style={styles.distText}>0 mi</Text>
                </View>
                <View style={styles.restListText}>
                  <Text
                    style={styles.restListTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    No restaurants found
                  </Text>
                  <Text
                    style={styles.restListSubtitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Please search a different restaurant!
                  </Text>
                </View>
              </View>
            )}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
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
      <StarRating
        style={styles.smallMargin}
        rating={rating}
        size={24}
        primaryColor="#cbb131"
        secondaryColor="#585858"
        onPress={setRating}
      />
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
            onChangeText={(text) => {
              setTagSearch(text);
              setOrderedTags(new Set(selTags), text);
            }}
            value={tagSearch}
            placeholder="Search & Add hashtags"
            placeholderTextColor="#848484"
          />
          {tagSearch.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setTagSearch("");
                setOrderedTags(new Set(selTags), "");
              }}
            >
              <FontAwesome
                style={styles.inputIcon}
                name="close"
                size={16}
                color="#727272"
              />
            </TouchableOpacity>
          )}
        </View>
        <FlatList
          horizontal
          data={orderedTags}
          keyExtractor={(i) => i}
          renderItem={({ item }) => (
            <Pressable onPress={() => toggleTag(item)}>
              <Hashtag
                style={styles.touchable}
                hashtag={item}
                selected={selTags.includes(item)}
              />
            </Pressable>
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
    </KeyboardAwareScrollView>
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
  },
  scroll: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  bigCircle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: "#D1D1D1",
    justifyContent: "center",
    alignItems: "center",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  distText: {
    textAlign: "center",
    color: "#727272",
    fontSize: 12,
    marginTop: 4,
  },
  restListItem: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#DBDBDB",
    alignItems: "center",
  },
  restListText: {
    marginLeft: 8,
    flex: 1,
  },
  restListTitle: {
    color: "#5C5C5C",
    fontSize: 16,
    fontWeight: "bold",
  },
  restListSubtitle: {
    color: "#727272",
    fontSize: 14,
    marginTop: 4,
  },
});

export default view(UploadReviewScreen);
