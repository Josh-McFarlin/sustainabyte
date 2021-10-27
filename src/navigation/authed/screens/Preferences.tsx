import * as React from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ScrollView,
  Text,
  Image,
  Dimensions,
} from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FontAwesome } from "@expo/vector-icons";
import Slider from "../../../components/Slider";
import type { StackNavParamList } from "../types";
import { randomFoodUrl, randomSizeSubset } from "../../../utils/random";

type PropTypes = NativeStackScreenProps<StackNavParamList, "Preferences">;

const foodDrink = [
  "Salad",
  "Brunch",
  "Bubble Tea",
  "Burgers",
  "Indian",
  "Coffee",
  "Ramen",
  "Italian",
];
const dietary = [
  "Vegan",
  "Vegetarian",
  "Gluten-free",
  "Keto",
  "Halal",
  "Kosher",
  "Dairy-free",
  "Pescatarian",
];
const restAttributes = [
  "Black Owned",
  "Local",
  "Organic",
  "Buffet",
  "Rooftop",
  "Outdoor Seating",
  "Ala Carte",
];

const PreferencesScreen: React.FC<PropTypes> = () => {
  const [budget, setBudget] = React.useState<number>(20);
  const [selFoods, setFoods] = React.useState<string[]>(
    randomSizeSubset(foodDrink, 3)
  );
  const [selDietary, setDietary] = React.useState<string[]>(
    randomSizeSubset(dietary, 3)
  );
  const [selAttrs, setAttrs] = React.useState<string[]>(
    randomSizeSubset(restAttributes, 3)
  );

  const setSliderValue = React.useCallback((low: number) => setBudget(low), []);
  const toggleFood = React.useCallback(
    (item: string) =>
      setFoods((prevState) => {
        const newFoods = new Set(prevState);

        if (newFoods.has(item)) {
          newFoods.delete(item);
        } else {
          newFoods.add(item);
        }

        return [...newFoods];
      }),
    []
  );
  const toggleDietary = React.useCallback(
    (item: string) =>
      setDietary((prevState) => {
        const newDietary = new Set(prevState);

        if (newDietary.has(item)) {
          newDietary.delete(item);
        } else {
          newDietary.add(item);
        }

        return [...newDietary];
      }),
    []
  );
  const toggleAttr = React.useCallback(
    (item: string) =>
      setAttrs((prevState) => {
        const newAttrs = new Set(prevState);

        if (newAttrs.has(item)) {
          newAttrs.delete(item);
        } else {
          newAttrs.add(item);
        }

        return [...newAttrs];
      }),
    []
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Your Budget</Text>
          <Slider
            min={5}
            max={100}
            step={5}
            low={budget}
            singleValue
            displayLabels
            onValueChanged={setSliderValue}
          />
          <View style={[styles.flexH, styles.spaceBetween]}>
            <Text style={styles.price}>from $5</Text>
            <Text style={styles.price}>to $100</Text>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Food & Drink</Text>
          <View style={styles.wrapContent}>
            {foodDrink.map((item, i) => (
              <TouchableWithoutFeedback
                key={item}
                onPress={() => toggleFood(item)}
              >
                <View style={[styles.imageItem, styles.touchable]}>
                  <View style={styles.imageContainer}>
                    <Image
                      style={styles.image}
                      source={{ uri: `${randomFoodUrl}/1080x1080?sig=${i}` }}
                    />
                    <View style={styles.heartContainer}>
                      <FontAwesome
                        name={selFoods.includes(item) ? "heart" : "heart-o"}
                        size={12}
                        color="#FA5B6B"
                      />
                    </View>
                  </View>
                  <Text style={styles.text}>{item}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Dietary</Text>
          <View style={styles.wrapContent}>
            {dietary.map((item) => (
              <TouchableWithoutFeedback
                key={item}
                onPress={() => toggleDietary(item)}
              >
                <View
                  style={[
                    styles.touchable,
                    styles.selectableItem,
                    selDietary.includes(item)
                      ? styles.itemSelected
                      : styles.itemUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      selDietary.includes(item)
                        ? styles.whiteText
                        : styles.blackText,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Restaurant Attributes</Text>
          <View style={styles.wrapContent}>
            {restAttributes.map((item) => (
              <TouchableWithoutFeedback
                key={item}
                style={styles.touchable}
                onPress={() => toggleAttr(item)}
              >
                <View
                  style={[
                    styles.touchable,
                    styles.selectableItem,
                    selAttrs.includes(item)
                      ? styles.itemSelected
                      : styles.itemUnselected,
                  ]}
                >
                  <Text
                    style={[
                      styles.text,
                      selAttrs.includes(item)
                        ? styles.whiteText
                        : styles.blackText,
                    ]}
                  >
                    {item}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  wrapContent: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectableItem: {
    borderWidth: 1,
    borderColor: "#3C8D90",
    borderRadius: 20,
    padding: 8,
  },
  itemSelected: {
    backgroundColor: "#3C8D90",
  },
  itemUnselected: {
    backgroundColor: "#fff",
  },
  whiteText: {
    color: "#fff",
  },
  blackText: {
    color: "#000",
  },
  imageItem: {
    justifyContent: "center",
    alignItems: "center",
    width: Dimensions.get("screen").width / 4 - 16,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 4,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: "cover",
    borderRadius: 4,
    backgroundColor: "#808080",
  },
  text: {
    fontSize: 14,
  },
  touchable: {
    marginRight: 8,
    marginBottom: 8,
  },
  heartContainer: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#fff",
    opacity: 0.9,
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  flexH: {
    display: "flex",
    flexDirection: "row",
  },
  spaceBetween: {
    justifyContent: "space-between",
  },
  price: {
    fontSize: 14,
    color: "#747474",
    marginTop: 4,
  },
});

export default PreferencesScreen;
