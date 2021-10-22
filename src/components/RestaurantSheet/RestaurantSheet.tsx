import * as React from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import SheetContents from "./SheetContents";
import { Restaurant } from "../../types/Restaurant";

interface PropTypes {
  restaurant: Restaurant | null;
}

const RestaurantSheet = React.forwardRef<BottomSheet, PropTypes>(
  ({ restaurant }, sheetRef) => {
    const snapPoints = React.useMemo(() => ["25%", "60%"], []);

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        style={styles.sheet}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {restaurant != null && <SheetContents restaurant={restaurant} />}
        </BottomSheetScrollView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  sheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 7,
    },
    shadowOpacity: 0.43,
    shadowRadius: 9.51,
    elevation: 15,
  },
  contentContainer: {
    padding: 8,
    backgroundColor: "#ffffff",
  },
});

export default RestaurantSheet;
