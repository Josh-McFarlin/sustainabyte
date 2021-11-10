import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import type { OfferType } from "../../types/Offer";

const radius = 40;
const bgColor = "#CBCBCB";
const circleColor = "#4b9193";

const calcVal = (endDate: Date): number =>
  Math.abs(new Date(endDate).valueOf() - Date.now()) / 36e5 / 0.24;

type PropTypes = {
  offer: OfferType;
};

const CircleOffer: React.FC<PropTypes> = ({ offer }) => {
  const [percent, setPercent] = React.useState<number>(
    calcVal(offer.expiresAt)
  );

  React.useEffect(() => {
    const timer = setInterval(() => setPercent(calcVal(offer.expiresAt)), 2000);

    return () => {
      clearInterval(timer);
    };
  }, [offer.expiresAt]);

  return (
    <AnimatedCircularProgress
      size={radius * 2}
      width={8}
      fill={percent}
      backgroundColor={bgColor}
      tintColor={circleColor}
      rotation={0}
      lineCap="round"
    >
      {() => (
        <Image
          style={styles.image}
          source={{
            uri: offer.photoUrl,
          }}
        />
      )}
    </AnimatedCircularProgress>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    backgroundColor: bgColor,
  },
});

export default CircleOffer;
