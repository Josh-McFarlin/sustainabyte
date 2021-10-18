import * as React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import LocationSelector from "./LocationSelector";
import { useAuth } from "../../utils/auth";
import type { Location } from "../../types/Location";

const LocationBar: React.FC = () => {
  const { user } = useAuth();

  const [locOpen, setLocOpen] = React.useState<boolean>(false);
  const openLoc = React.useCallback(() => setLocOpen(true), [setLocOpen]);
  const closeLoc = React.useCallback(() => setLocOpen(false), [setLocOpen]);
  const setLoc = (location: Location) => {
    console.log("New loc:", location);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>In Your Area</Text>
      <TouchableOpacity onPress={openLoc}>
        <View style={styles.currentContainer}>
          <Text style={styles.subtitle}>{user.username}</Text>
          <FontAwesome5
            style={styles.icon}
            name="chevron-down"
            size={16}
            color="#55933e"
          />
        </View>
      </TouchableOpacity>
      <LocationSelector open={locOpen} onSelect={setLoc} onClose={closeLoc} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  title: {
    fontSize: 12,
    color: "#55933e",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    flex: 1,
  },
  currentContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  icon: {
    marginLeft: 8,
  },
});

export default LocationBar;
