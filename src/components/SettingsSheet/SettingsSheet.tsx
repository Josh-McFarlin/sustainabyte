import * as React from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import SheetContents from "./SheetContents";

const SettingsSheet = React.forwardRef<BottomSheetModal>((_, sheetRef) => {
  const snapPoints = React.useMemo(() => ["50%"], []);

  const renderBackdrop = React.useCallback(
    (props) => (
      <BottomSheetBackdrop
        appearsOnIndex={0}
        disappearsOnIndex={-1}
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
      style={styles.sheet}
      backdropComponent={renderBackdrop}
    >
      <SheetContents />
    </BottomSheetModal>
  );
});

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
    opacity: 1,
  },
});

export default SettingsSheet;
