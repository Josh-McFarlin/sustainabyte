import * as React from "react";
import { View, StyleSheet, TextInput, FlatList, Pressable } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import debounce from "lodash/debounce";
import { hashtags } from "../../utils/hashtags";
import Hashtag from "../Hashtag/Hashtag";

type PropTypes = {
  onChange: (search: string, tags: string[]) => void;
};

const SearchBar: React.FC<PropTypes> = ({ onChange }) => {
  const [search, setSearch] = React.useState<string>("");
  const [selTags, setTags] = React.useState<string[]>([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debChange = React.useCallback(debounce(onChange, 250), [onChange]);

  React.useEffect(() => {
    debChange(search, selTags);
  }, [debChange, search, selTags]);

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

  const orderedTags = React.useMemo(() => {
    const selSet = new Set(selTags);

    return [...selTags, ...hashtags.filter((i) => !selSet.has(i))];
  }, [selTags]);

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
            color="#8E8E8E"
            onPress={() => setSearch("")}
          />
        )}
      </View>
      <FlatList
        style={styles.overflow}
        contentContainerStyle={styles.overflow}
        horizontal
        data={orderedTags}
        keyExtractor={(i) => i}
        renderItem={({ item }) => (
          <Pressable style={styles.overflow} onPress={() => toggleTag(item)}>
            <Hashtag
              style={styles.touchable}
              hashtag={item}
              selected={selTags.includes(item)}
            />
          </Pressable>
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
  touchable: {
    marginRight: 8,
  },
  overflow: {
    overflow: "visible",
  },
});

export default SearchBar;
