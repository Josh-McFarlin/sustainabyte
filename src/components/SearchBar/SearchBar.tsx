import * as React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
} from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import debounce from "lodash/debounce";

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

const returnTrue = (obj: Record<string, boolean>): string[] =>
  Object.entries(obj).reduce((acc, [tag, sel]) => {
    if (sel) {
      acc.push(tag);
    }

    return acc;
  }, []);

type PropTypes = {
  onChange: (search: string, tags: string[]) => void;
};

const SearchBar: React.FC<PropTypes> = ({ onChange }) => {
  const [search, setSearch] = React.useState<string>("");
  const [selTags, setTagsBase] = React.useState<Record<string, boolean>>(
    foodTags.reduce((acc, tag) => ({ ...acc, [tag]: false }), {})
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debChange = React.useCallback(debounce(onChange, 250), [onChange]);

  React.useEffect(() => {
    debChange(search, returnTrue(selTags));
  }, [debChange, search, selTags]);

  const setTags = (tag: string, selected: boolean) =>
    setTagsBase((prevState) => ({
      ...prevState,
      [tag]: selected,
    }));

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
        {search.length > 0 && (
          <FontAwesome
            style={styles.clearIcon}
            name="close"
            size={18}
            color="#3C8D90"
            onPress={() => setSearch("")}
          />
        )}
      </View>
      <FlatList
        horizontal
        data={Object.entries(selTags)}
        keyExtractor={(i) => i[0]}
        renderItem={({ item: [tag, has] }) => (
          <TouchableWithoutFeedback onPress={() => setTags(tag, !has)}>
            <View
              style={[
                styles.touchable,
                styles.selectableItem,
                has ? styles.itemSelected : styles.itemUnselected,
              ]}
            >
              <Text
                style={[styles.text, has ? styles.whiteText : styles.blackText]}
              >
                #{tag}
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
  clearIcon: {
    //
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
