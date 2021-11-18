import * as React from "react";
import {
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Platform,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FontAwesome5 } from "@expo/vector-icons";
import { view } from "@risingstack/react-easy-state";
import * as ImagePicker from "expo-image-picker";
import type { StackNavParamList } from "../types";
import { useAuth } from "../../../utils/auth";
import { updateUser } from "../../../actions/user";

const useSelect = Platform.select({ web: true, default: false });

type PropTypes = NativeStackScreenProps<StackNavParamList, "UpdateProfile">;

const UpdateProfileScreen: React.FC<PropTypes> = ({ navigation }) => {
  const { user } = useAuth();
  const [name, setName] = React.useState<string>(user.name || "");
  const [email, setEmail] = React.useState<string>(user.email || "");
  const [bio, setBio] = React.useState<string>(user.bio || "");
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (result?.cancelled === false) {
      setAvatarUrl(result.uri);
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
      setAvatarUrl(result.uri);
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

  const handleSubmit = async () => {
    await updateUser(user._id, {
      name,
      email,
      bio,
      ...(avatarUrl != null && {
        avatarUrl,
      }),
    });

    navigation.navigate("Tabs", {
      screen: "Profile",
    } as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={[styles.hRow, styles.center]}>
          <TouchableOpacity onPress={selectType}>
            <Image
              style={styles.avatar}
              source={{ uri: avatarUrl || user.avatarUrl }}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.section, styles.hRow]}>
          <FontAwesome5
            style={styles.inputIcon}
            name="user"
            size={18}
            color="#3C8D90"
          />
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Name"
            placeholderTextColor="#848484"
          />
        </View>
        <View style={[styles.section, styles.hRow]}>
          <FontAwesome5
            style={styles.inputIcon}
            name="envelope"
            size={18}
            color="#3C8D90"
          />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#848484"
          />
        </View>
        <View style={[styles.section, styles.hRow]}>
          <FontAwesome5
            style={styles.inputIcon}
            name="quote-right"
            size={18}
            color="#3C8D90"
          />
          <TextInput
            style={styles.input}
            value={bio}
            onChangeText={setBio}
            placeholder="Bio"
            placeholderTextColor="#848484"
          />
        </View>

        <TouchableOpacity onPress={handleSubmit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Submit</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  section: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#707070",
    marginBottom: 16,
  },
  button: {
    padding: 8,
    backgroundColor: "#fff",
    borderColor: "#3C8D90",
    borderWidth: 2,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 18,
    color: "#3C8D90",
    textAlign: "center",
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
  center: {
    justifyContent: "center",
  },
  inputIcon: {
    marginRight: 8,
  },
  avatar: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#717171",
    marginBottom: 16,
  },
});

export default view(UpdateProfileScreen);
