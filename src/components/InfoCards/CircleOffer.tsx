import * as React from "react";
import { View, StyleSheet, Image } from "react-native";
import type { OfferType } from "../../types/Offer";

/**
 * This code is an updated version of the React Native Percentage Circle
 * component created by JackPu on GitHub.
 * @author JackPu
 * @licence MIT
 * @link https://github.com/JackPu/react-native-percentage-circle
 */

type PropTypes = {
  offer: OfferType;
};

const radius = 40;
const bgcolor = "#ccc";
const color = "#4b9193";
const borderWidth = 8;
const innerColor = "#aaa";

const CircleOffer: React.FC<PropTypes> = ({ offer }) => {
  const [percent, setPercent] = React.useState<number>(0);
  const [leftTransformerDegree, setLeft] = React.useState<string>("0deg");
  const [rightTransformerDegree, setRight] = React.useState<string>("0deg");

  React.useEffect(() => {
    const calcVal = () => {
      const newPercent = Math.abs(offer.expiresAt - Date.now()) / 36e5 / 0.24;

      if (newPercent >= 50) {
        setRight("180deg");
        setLeft(`${(newPercent - 50) * 3.6}deg`);
      } else {
        setRight(`${newPercent * 3.6}deg`);
        setLeft("180deg");
      }

      setPercent(newPercent);
    };

    calcVal();

    const timer = setInterval(calcVal, 2000);

    return () => {
      clearInterval(timer);
    };
  }, [offer.expiresAt]);

  return (
    <View style={styles.circle}>
      <View
        style={[
          styles.leftWrap,
          {
            left: radius,
            width: radius,
            height: radius * 2,
          },
        ]}
      >
        <View
          style={[
            styles.loader,
            {
              left: -radius,
              width: radius,
              height: radius * 2,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              backgroundColor: color,
              transform: [
                { translateX: radius / 2 },
                { rotate: rightTransformerDegree },
                { translateX: -radius / 2 },
              ],
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.leftWrap,
          {
            width: radius,
            height: radius * 2,
            left: 0,
          },
        ]}
      >
        <View
          style={[
            styles.loader,
            {
              left: radius,
              width: radius,
              height: radius * 2,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              backgroundColor: percent >= 50 ? color : bgcolor, // changed this line
              transform: [
                { translateX: -radius / 2 },
                { rotate: leftTransformerDegree },
                { translateX: radius / 2 },
              ],
            },
          ]}
        />
      </View>
      <View
        style={[
          styles.innerCircle,
          {
            width: (radius - borderWidth) * 2,
            height: (radius - borderWidth) * 2,
            borderRadius: radius - borderWidth,
            backgroundColor: innerColor,
          },
        ]}
      >
        <Image
          style={styles.image}
          source={{
            uri: offer.photo,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    backgroundColor: bgcolor,
  },
  leftWrap: {
    overflow: "hidden",
    position: "absolute",
    top: 0,
  },
  rightWrap: {
    position: "absolute",
  },
  loader: {
    position: "absolute",
    left: 0,
    top: 0,
    borderRadius: 1000,
  },
  innerCircle: {
    overflow: "hidden",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 11,
    color: "#888",
  },
  image: {
    width: 150,
    height: 150,
    backgroundColor: "#888",
  },
});

export default CircleOffer;
