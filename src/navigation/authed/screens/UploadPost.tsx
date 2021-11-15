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
  FlatList,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import {
  MaterialIcons,
  FontAwesome5,
  Ionicons,
  FontAwesome,
} from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { view } from "@risingstack/react-easy-state";
import { createPost } from "../../../actions/post";
import { StackNavParamList } from "../types";
import { hashtags } from "../../../utils/hashtags";
import Hashtag from "../../../components/Hashtag/Hashtag";

const useSelect = Platform.select({ web: true, default: false });

type PropTypes = NativeStackScreenProps<StackNavParamList, "UploadPost">;

const UploadPostScreen: React.FC<PropTypes> = ({ route, navigation }) => {
  const { restaurant } = route.params || {};
  const [picture, setPicture] = React.useState<string | null>(null);
  const [caption, setCaption] = React.useState<string>("");
  const [selTags, setTags] = React.useState<string[]>([]);
  const [tagSearch, setTagSearch] = React.useState<string>("");
  const [showingSearch, setShowingSearchBase] = React.useState<string>("");
  const [uploading, setUploading] = React.useState<boolean>(false);

  const handleUpload = React.useCallback(async () => {
    try {
      setUploading(true);
      const newPost = await createPost({
        ownerType: "User",
        ...(restaurant != null && {
          restaurant: restaurant._id,
        }),
        body: caption,
        photoUrls: [picture],
        tags: selTags,
      });
      navigation.navigate("Post", {
        id: newPost._id,
        post: newPost,
      });
    } catch (error) {
      console.log("Error", error?.message || error);
    } finally {
      setUploading(false);
    }
  }, [navigation, restaurant, picture, caption, selTags]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleUpload} disabled={uploading}>
          Next{" "}
          <ActivityIndicator
            animating={uploading}
            hidesWhenStopped
            size="small"
            color="#0000ff"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleUpload, uploading]);

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
      setPicture(result.uri);
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
      setPicture(result.uri);
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
        {restaurant != null && (
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
        )}
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
                <MaterialIcons name="add-a-photo" size={48} color="#3C8D90" />
                <Text>Take a picture</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        <View style={[styles.section, styles.hRow]}>
          <Ionicons
            style={styles.inputIcon}
            name="md-chatbox"
            size={18}
            color="#3C8D90"
          />
          <TextInput
            style={styles.input}
            onChangeText={setCaption}
            value={caption}
            placeholder="Add a caption"
            placeholderTextColor="#848484"
            multiline
            numberOfLines={6}
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
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
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
    width: Dimensions.get("window").width - 32,
    height: Dimensions.get("window").width - 32,
    resizeMode: "contain",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    minHeight: 32,
    maxHeight: 120,
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
});

export default view(UploadPostScreen);
