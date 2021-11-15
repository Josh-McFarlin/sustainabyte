import * as React from "react";
import { useFocusEffect } from "@react-navigation/native";

export const useRefetchOnFocus = (
  refetch: () => void,
  initialFocus = true,
  canRefetch = true
): void => {
  const [isFocused, setFocused] = React.useState<boolean>(initialFocus);

  useFocusEffect(() => {
    setFocused(true);

    return () => {
      setFocused(false);
    };
  });

  React.useEffect(() => {
    if (isFocused && canRefetch) {
      refetch();
    }
  }, [canRefetch, isFocused, refetch]);
};
