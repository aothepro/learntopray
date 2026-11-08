import { useState } from "react";
import { Image, type LayoutChangeEvent, StyleSheet, View } from "react-native";

import { POSTURE_IMAGE, POSTURE_LABEL } from "@/postures";
import { type PrayerPosture as PrayerPostureName } from "@/prayerSequence";

type PrayerPostureProps = {
  posture: PrayerPostureName;
};

export function PrayerPosture({ posture }: PrayerPostureProps) {
  const [frameSize, setFrameSize] = useState({ width: 0, height: 0 });

  const onFrameLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setFrameSize((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height },
    );
  };

  return (
    <View style={styles.frame} onLayout={onFrameLayout}>
      {frameSize.width > 0 && frameSize.height > 0 ? (
        <Image
          source={POSTURE_IMAGE[posture]}
          accessibilityLabel={POSTURE_LABEL[posture]}
          accessibilityIgnoresInvertColors
          resizeMode="contain"
          style={{
            position: "absolute",
            width: frameSize.width,
            height: frameSize.height,
          }}
        />
      ) : null}
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
});
