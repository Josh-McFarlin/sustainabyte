import * as React from "react";
import Svg, {
  SvgProps,
  Defs,
  LinearGradient,
  Stop,
  Path,
} from "react-native-svg";

const WaveLeft: React.FC<SvgProps> = (props) => (
  <Svg width={480} height={320} {...props}>
    <Defs>
      <LinearGradient
        id="prefix__a"
        x1={0.5}
        x2={0.5}
        y2={1}
        gradientUnits="objectBoundingBox"
      >
        <Stop offset={0} stopColor="#08323f" />
        <Stop offset={1} stopColor="#3c8d90" />
      </LinearGradient>
    </Defs>
    <Path
      data-name="Rectangle 91"
      d="M0 0h480a320 320 0 01-320 320h-9A151 151 0 010 169V0z"
      fill="url(#prefix__a)"
    />
  </Svg>
);

export default React.memo(WaveLeft);
