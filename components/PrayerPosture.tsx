import { Image, StyleSheet, View } from "react-native";

import { POSTURE_IMAGE, POSTURE_LABEL } from "@/postures";
import { type PrayerPosture as PrayerPostureName } from "@/prayerSequence";

type PrayerPostureProps = {
  posture: PrayerPostureName;
};

export function PrayerPosture({ posture }: PrayerPostureProps) {
  return (
    <View style={styles.frame}>
      <Image
        source={POSTURE_IMAGE[posture]}
        accessibilityLabel={POSTURE_LABEL[posture]}
        accessibilityIgnoresInvertColors
        resizeMode="contain"
        style={styles.image}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    width: "100%",
    maxWidth: 420,
    minHeight: 180,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#F4F0E6",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
