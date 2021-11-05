import * as React from "react";
import { View, Text, StyleSheet, Modal, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AuthNavigationProp } from "../../navigation/authed/types";
import { RestaurantType } from "../../types/Restaurant";

type PropTypes = {
  restaurant: RestaurantType;
  open: boolean;
  handleClose: () => void;
};

const VisitModal: React.FC<PropTypes> = ({ restaurant, open, handleClose }) => {
  const navigation = useNavigation<AuthNavigationProp>();

  return (
    <Modal
      visible={open}
      animationType="fade"
      transparent
      onRequestClose={handleClose}
    >
      <View style={styles.modal}>
        <TouchableOpacity style={styles.modalOverlay} onPress={handleClose} />
        <View style={[styles.content, styles.center]}>
          <Text style={[styles.title, styles.marginBottom]}>
            Do you recommend this business?
          </Text>
          <View style={[styles.hRow, styles.center, styles.marginBottom]}>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Text style={styles.buttonText}>Maybe</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.spacer, styles.marginBottom]} />
          <View style={[styles.hRow, styles.spaceAround]}>
            <TouchableOpacity>
              <View style={styles.center}>
                <FontAwesome
                  style={styles.actionIcon}
                  name="pencil-square-o"
                  size={28}
                  color="#9EC1C3"
                />
                <Text style={styles.actionText}>Add Review</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.center}>
                <FontAwesome
                  style={styles.actionIcon}
                  name="plus-square-o"
                  size={28}
                  color="#9EC1C3"
                />
                <Text style={styles.actionText}>Add Photo</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.center}>
                <FontAwesome
                  style={styles.actionIcon}
                  name="map-pin"
                  size={28}
                  color="#9EC1C3"
                />
                <Text style={styles.actionText}>Check In</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={styles.center}>
                <FontAwesome
                  style={styles.actionIcon}
                  name="bookmark"
                  size={28}
                  color="#9EC1C3"
                />
                <Text style={styles.actionText}>Save</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    position: "relative",
  },
  content: {
    width: "100%",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderRadius: 12,
  },
  hRow: {
    display: "flex",
    flexDirection: "row",
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  button: {
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#707070",
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
  },
  marginBottom: {
    marginBottom: 12,
  },
  spacer: {
    width: "100%",
    height: 1,
    backgroundColor: "#707070",
  },
  flex: {
    flex: 1,
  },
  actionIcon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: "#000",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#00000080",
  },
  spaceAround: {
    width: "100%",
    justifyContent: "space-evenly",
  },
});

export default VisitModal;
