import * as React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Camera } from "expo-camera";
import { manipulateAsync, ImageResult } from "expo-image-manipulator";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";

type PropTypes = {
  onCapture: (picture: ImageResult) => void;
  onCancel: () => void;
};

const CameraView: React.FC<PropTypes> = ({ onCapture, onCancel }) => {
  const { width, height } = useWindowDimensions();
  const cameraRef = React.useRef<Camera>(null);
  const [hasPermission, setHasPermission] = React.useState(null);
  const [type, setType] = React.useState(Camera.Constants.Type.back);

  React.useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takePicture = React.useCallback(async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      const dim = Math.min(photo.width, photo.height);
      const midX = dim === photo.width ? 0 : photo.width / 2 - dim / 2;
      const midY = dim === photo.height ? 0 : photo.height / 2 - dim / 2;

      const manipResult = await manipulateAsync(
        photo.uri,
        [
          {
            crop: {
              originX: midX,
              originY: midY,
              width: dim,
              height: dim,
            },
          },
        ],
        { compress: 0.8 }
      );

      onCapture(manipResult);
    }
  }, [cameraRef, onCapture]);

  const flipCamera = () =>
    setType((prevState) =>
      prevState === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={[
          styles.camera,
          {
            width,
          },
        ]}
        ref={cameraRef}
        type={type}
        autoFocus
      >
        <View
          style={[
            styles.fills,
            {
              width,
              height,
            },
          ]}
        >
          <View style={styles.otherFills} />
          <View
            style={[
              {
                width: Math.min(width, height),
                height: Math.min(width, height),
              },
            ]}
          />
          <View style={styles.otherFills} />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={onCancel}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="close" size={36} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={takePicture}>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="camera-retro" size={52} color="#fff" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={flipCamera}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="rotate-left" size={36} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    position: "relative",
    marginTop: -75,
  },
  fills: {
    position: "absolute",
  },
  otherFills: {
    flex: 1,
    backgroundColor: "#00000040",
  },
  buttonContainer: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 64,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  iconWrapper: {
    padding: 16,
    backgroundColor: "#ffffff80",
    borderRadius: 100,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CameraView;
