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
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome5, FontAwesome } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { view } from "@risingstack/react-easy-state";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { createChallenge } from "../../../actions/challenge";
import { StackNavParamList } from "../types";

dayjs.extend(localizedFormat);

const useSelect = Platform.select({ web: true, default: false });

const iconUrls = [
  require("../../../../assets/icons/healthy.png"),
  require("../../../../assets/icons/leafs.png"),
  require("../../../../assets/icons/sombrero.png"),
  require("../../../../assets/icons/vigilante.png"),
  require("../../../../assets/icons/mountain.png"),
  require("../../../../assets/icons/pin.png"),
];

type PropTypes = NativeStackScreenProps<StackNavParamList, "CreateChallenge">;

const CreateChallenge: React.FC<PropTypes> = ({ navigation }) => {
  const [name, setName] = React.useState<string>("");
  const [body, setBody] = React.useState<string>("");
  const [iconUrl, setIconUrl] = React.useState<string>("");
  const [score, setScore] = React.useState<string>("20");
  const [expiresAt, setExpiresAt] = React.useState<Date>(
    dayjs().add(7, "days").toDate()
  );
  const [pickerOpen, setPickerOpen] = React.useState<boolean>(false);
  const [selImgIndex, setSelImgIndex] = React.useState<number | null>(null);
  const [uploading, setUploading] = React.useState<boolean>(false);

  const handleUpload = React.useCallback(async () => {
    try {
      setUploading(true);
      await createChallenge({
        name,
        body,
        iconUrl,
        score: parseInt(score, 10),
        expiresAt,
      });
      navigation.goBack();
    } catch (error) {
      console.log("Error", error?.message || error);
    } finally {
      setUploading(false);
    }
  }, [navigation, name, body, iconUrl, score, expiresAt]);

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleUpload} disabled={uploading}>
          <View style={[styles.hRow, styles.center]}>
            <Text>Next</Text>
            <ActivityIndicator
              animating={uploading}
              hidesWhenStopped
              size="small"
              color="#0000ff"
            />
          </View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, handleUpload, uploading]);

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
      setIconUrl(result.uri);
      setSelImgIndex(-1);
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
      setIconUrl(result.uri);
      setSelImgIndex(-1);
    }
  };

  const selectType = async (): Promise<void> => {
    if (useSelect) {
      return pickImage();
    }

    return Alert.alert("New Challenge", "Select a Photo", [
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
          value={name}
          onChangeText={setName}
          placeholder="Challenge Name"
          placeholderTextColor="#848484"
        />
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
          value={body}
          onChangeText={setBody}
          placeholder="Challenge Description"
          placeholderTextColor="#848484"
        />
      </View>
      <View style={[styles.section, styles.hRow]}>
        <FontAwesome
          style={styles.inputIcon}
          name="trophy"
          size={18}
          color="#3C8D90"
        />
        <TextInput
          keyboardType="number-pad"
          style={styles.input}
          onChangeText={setScore}
          value={score}
          placeholder="Points to Award"
          placeholderTextColor="#848484"
        />
      </View>
      <View style={[styles.section, styles.hRow]}>
        <FontAwesome
          style={styles.inputIcon}
          name="calendar"
          size={18}
          color="#3C8D90"
        />
        <Pressable
          style={[styles.flex, styles.center]}
          onPress={() => setPickerOpen(true)}
        >
          <View style={[styles.input, styles.center]}>
            <Text>{dayjs(expiresAt).format("LLL")}</Text>
          </View>
        </Pressable>
      </View>
      <ScrollView horizontal>
        {selImgIndex < 0 && (
          <View style={[styles.section, styles.imageSpacer, styles.selected]}>
            <Image style={styles.image} source={{ uri: iconUrl }} />
          </View>
        )}
        {iconUrls.map((picture, index) => (
          <TouchableOpacity
            key={picture}
            style={styles.imageSpacer}
            onPress={() => {
              setIconUrl(Image.resolveAssetSource(picture).uri);
              setSelImgIndex(index);
            }}
          >
            <View
              style={[
                styles.section,
                selImgIndex === index ? styles.selected : styles.section,
              ]}
            >
              <Image style={styles.image} source={picture} />
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
      <DateTimePickerModal
        isVisible={pickerOpen}
        date={expiresAt}
        mode="datetime"
        display="spinner"
        textColor="#000000"
        minimumDate={new Date()}
        onConfirm={(date) => {
          setExpiresAt(date);
          setPickerOpen(false);
        }}
        onCancel={() => {
          setPickerOpen(false);
        }}
      />
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
  selected: {
    borderWidth: 4,
    padding: 6,
  },
  image: {
    width: 75,
    height: 75,
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
  center: {
    justifyContent: "center",
  },
});

export default view(CreateChallenge);
