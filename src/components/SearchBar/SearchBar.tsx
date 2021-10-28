import * as React from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { randomSizeSubset } from "../../utils/random";

const foodTags = [
  "vegan",
  "vegetarian",
  "local",
  "yummy",
  "fancy",
  "boring",
  "delicious",
  "breakfast",
  "lunch",
  "dinner",
  "popular",
];

type PropTypes = {
  onChange: (search: string, tags: string[]) => void;
};

const SearchBar: React.FC<PropTypes> = ({ onChange }) => {
  const [search, setSearch] = React.useState<string>("");
  const [selTags, setTags] = React.useState<string[]>(
    randomSizeSubset(foodTags, 3)
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debChange = React.useCallback(debounce(onChange, 500), [onChange]);

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

  React.useEffect(() => {
    debChange(search, selTags);
  }, [debChange, search, selTags]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <FontAwesome5 name="search" color="#8E8E8E" size={18} />
        <TextInput
          style={styles.input}
          value={search}
          onChangeText={setSearch}
          placeholder={`Search "Curry"`}
          placeholderTextColor="#8E8E8E"
        />
      </View>
      <FlatList
        horizontal
        data={foodTags}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback onPress={() => toggleTag(item)}>
            <View
              style={[
                styles.touchable,
                styles.selectableItem,
                selTags.includes(item)
                  ? styles.itemSelected
                  : styles.itemUnselected,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  selTags.includes(item) ? styles.whiteText : styles.blackText,
                ]}
              >
                #{item}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#D8D8D8",
  },
  inputContainer: {
    display: "flex",
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderColor: "#707070",
    backgroundColor: "#F2F2F2",
    marginBottom: 12,
    alignItems: "center",
  },
  input: {
    marginLeft: 16,
    fontSize: 18,
    flex: 1,
    backgroundColor: "transparent",
  },
  selectableItem: {
    borderWidth: 1,
    borderColor: "#3C8D90",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemSelected: {
    backgroundColor: "#3C8D90",
  },
  itemUnselected: {
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 14,
  },
  whiteText: {
    color: "#fff",
  },
  blackText: {
    color: "#000",
  },
  touchable: {
    marginRight: 8,
  },
});

export default SearchBar;
