import * as React from "react";
import { StyleSheet } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import SheetContents from "./SheetContents";
import { RestaurantType } from "../../types/Restaurant";

interface PropTypes {
  restaurant: RestaurantType | null;
}

const RestaurantSheet = React.forwardRef<BottomSheetModal, PropTypes>(
  ({ restaurant }, sheetRef) => {
    const snapPoints = React.useMemo(() => ["33%"], []);

    const renderBackdrop = React.useCallback(
      (props) => (
        <BottomSheetBackdrop
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0}
          pressBehavior="close"
          enableTouchThrough
          {...props}
        />
      ),
      []
    );

    return (
      <BottomSheetModal
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        enableContentPanningGesture
        backdropComponent={renderBackdrop}
        style={styles.sheet}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {restaurant != null && <SheetContents restaurant={restaurant} />}
        </BottomSheetScrollView>
      </BottomSheetModal>
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
    zIndex: 30,
  },
  contentContainer: {
    padding: 8,
    backgroundColor: "#ffffff",
    zIndex: 32,
  },
});

export default RestaurantSheet;
