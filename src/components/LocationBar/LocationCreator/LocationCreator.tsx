import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { lookupAddress } from "../../../utils/location";
import type { AddressType } from "../../../types/Location";

const LocationCreator: React.FC = () => {
  const [street, setStreet] = React.useState<AddressType["street"]>("");
  const [city, setCity] = React.useState<AddressType["city"]>("");
  const [state, setState] = React.useState<AddressType["state"]>("");
  const [country, setCountry] = React.useState<AddressType["country"]>("");
  const [zipCode, setZipCode] =
    React.useState<AddressType["zipCode"]>(undefined);

  const handleCreate = React.useCallback(async () => {
    console.log("Pressed create");

    try {
      const address = lookupAddress({
        street,
        city,
        state,
        country,
        zipCode,
      });

      console.log("addr", address);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  }, [street, city, state, country, zipCode]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={street}
        onChangeText={setStreet}
        placeholder="Street"
        textContentType="fullStreetAddress"
        autoCompleteType="street-address"
      />
      <TextInput
        style={styles.input}
        value={city}
        onChangeText={setCity}
        placeholder="City"
        textContentType="addressCity"
      />
      <TextInput
        style={styles.input}
        value={state}
        onChangeText={setState}
        placeholder="State"
        textContentType="addressState"
      />
      <TextInput
        style={styles.input}
        value={country}
        onChangeText={setCountry}
        placeholder="Country"
        textContentType="countryName"
      />
      <TextInput
        style={styles.input}
        value={zipCode.toString()}
        onChangeText={(text) => setZipCode(parseInt(text, 10))}
        placeholder="Zip Code"
        keyboardType="number-pad"
        textContentType="postalCode"
        autoCompleteType="postal-code"
      />
      <TouchableOpacity onPress={handleCreate}>
        <View>
          <Text>Create</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    display: "flex",
    flexDirection: "row",
    padding: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#aaaaaa",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default LocationCreator;
