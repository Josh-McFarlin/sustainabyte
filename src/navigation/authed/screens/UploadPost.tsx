import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Alert,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as ImagePicker from "expo-image-picker";
import { ImageResult } from "expo-image-manipulator";
import CameraView from "../../../components/CameraView";
import { StackNavParamList } from "../types";

type PropTypes = NativeStackScreenProps<StackNavParamList, "UploadPost">;

const UploadPostScreen: React.FC<PropTypes> = () => {
  const [picture, setPicture] = React.useState<string | null>(null);
  const [takingPic, setTakingPic] = React.useState<boolean>(false);

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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (result.cancelled === false) {
      setPicture(result.uri);
    }
  };

  const handleCapture = React.useCallback((pic: ImageResult) => {
    setPicture(pic.uri);
    setTakingPic(false);
  }, []);

  if (takingPic) {
    return <CameraView onCapture={handleCapture} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View>
          <TouchableOpacity onPress={() => setTakingPic(true)}>
            <Text>Take Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage}>
            <Text>Pick Existing Picture</Text>
          </TouchableOpacity>
        </View>
      </View>
      {picture != null && (
        <View>
          <Image
            style={styles.image}
            source={{
              uri: picture,
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  spacer: {
    height: 8,
    backgroundColor: "#D8D8D8",
  },
  list: {
    flex: 1,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    backgroundColor: "#ccc",
  },
});

export default UploadPostScreen;
