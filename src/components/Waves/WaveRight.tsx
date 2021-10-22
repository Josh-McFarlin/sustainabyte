import * as React from "react";
import Svg, {
  SvgProps,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from "react-native-svg";

const WaveRight: React.FC<SvgProps> = (props) => (
  <Svg width={320} height={320} {...props}>
    <Defs>
      <LinearGradient
        id="prefix__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox"
      >
        <Stop offset={0} stopColor="#08323f" />
        <Stop offset={1} stopColor="#035a4d" />
      </LinearGradient>
    </Defs>
    <Path
      data-name="Rectangle 120"
      d="M0 0h320A320 320 0 010 320V0z"
      transform="rotate(90 160 160)"
      fill="url(#prefix__a)"
    />
  </Svg>
);

export default React.memo(WaveRight);
