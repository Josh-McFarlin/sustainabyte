import * as React from "react";
import RangeSlider from "rn-range-slider";
import { StyleSheet, ViewStyle } from "react-native";
import Thumb from "./Thumb";
import Rail from "./Rail";
import RailSelected from "./RailSelected";
import Label from "./Label";
import Notch from "./Notch";

type PropTypes = {
  onValueChanged: (low: number, high: number, fromUser: boolean) => void;
  min?: number;
  max?: number;
  step?: number;
  low?: number;
  high?: number;
  disabled?: boolean;
  singleValue?: boolean;
  displayLabels?: boolean;
  style?: ViewStyle;
};

const Slider: React.FC<PropTypes> = ({
  low,
  onValueChanged,
  singleValue,
  displayLabels,
  style,
  ...rest
}) => {
  const renderThumb = React.useCallback(
    () => <Thumb displayLabel={displayLabels} label={low} />,
    [displayLabels, low]
  );
  const renderRail = React.useCallback(() => <Rail />, []);
  const renderRailSelected = React.useCallback(() => <RailSelected />, []);
  const renderLabel = React.useCallback((value) => <Label text={value} />, []);
  const renderNotch = React.useCallback(() => <Notch />, []);

  return (
    <RangeSlider
      {...rest}
      low={low}
      style={[styles.slider, style]}
      floatingLabel={!displayLabels}
      renderThumb={renderThumb}
      renderRail={renderRail}
      renderRailSelected={renderRailSelected}
      renderLabel={renderLabel}
      renderNotch={renderNotch}
      onValueChanged={onValueChanged}
      disableRange={singleValue}
    />
  );
};

const styles = StyleSheet.create({
  slider: {},
});

Slider.defaultProps = {
  min: 0,
  max: 0,
  step: 1,
  low: undefined,
  high: undefined,
  disabled: false,
  singleValue: false,
  displayLabels: false,
  style: null,
};

export default Slider;
