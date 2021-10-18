import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  FlatList,
  TouchableHighlight,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import LocationCreator from "../LocationCreator";
import { useAuth } from "../../../utils/auth";
import type { Location } from "../../../types/Location";

type PropTypes = {
  open: boolean;
  onSelect: (location: Location) => void;
  onClose: () => void;
};

const LocationSelector: React.FC<PropTypes> = ({ open, onSelect, onClose }) => {
  const { user } = useAuth();

  const [creatorOpen, setCreatorOpen] = React.useState<boolean>(false);
  const toggleCreator = React.useCallback(
    () => setCreatorOpen((prev) => !prev),
    [setCreatorOpen]
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={open}
      onRequestClose={onClose}
      style={styles.container}
    >
      <FlatList
        data={user.locations}
        keyExtractor={(item) =>
          `${item.coordinates.longitude}${item.coordinates.latitude}`
        }
        renderItem={({ item }) => (
          <TouchableHighlight
            style={styles.item}
            onPress={() => onSelect(item)}
          >
            <Text>{item.address.street}</Text>
            <Text>
              {item.address.city}, {item.address.state}
            </Text>
          </TouchableHighlight>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <TouchableHighlight
              style={styles.headerButton}
              onPress={toggleCreator}
            >
              <Text>Create New</Text>
              <FontAwesome5
                // style={styles.icon}
                name={creatorOpen ? "chevron-up" : "chevron-down"}
                size={16}
                color="#55933e"
              />
            </TouchableHighlight>
            {creatorOpen && <LocationCreator />}
          </View>
        )}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  header: {
    fontSize: 12,
    fontWeight: "bold",
    flex: 1,
  },
  headerButton: {
    display: "flex",
    flexDirection: "row",
  },
  item: {
    backgroundColor: "#fff",
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
});

export default LocationSelector;
