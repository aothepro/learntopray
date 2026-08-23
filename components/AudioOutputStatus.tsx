import Ionicons from "@expo/vector-icons/Ionicons";
import { Alert, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

type AudioOutputStatusProps = {
  hasExternalAudioDevice: boolean;
  isSilent: boolean;
  playing: boolean;
};

export function AudioOutputStatus({
  hasExternalAudioDevice,
  isSilent,
  playing,
}: AudioOutputStatusProps) {
  const connectedBackground = useThemeColor(
    { light: "#E5F4EC", dark: "#183129" },
    "background",
  );
  const connectedColor = useThemeColor(
    { light: "#237A4B", dark: "#78D6A5" },
    "text",
  );
  const warningBackground = useThemeColor(
    { light: "#FFF3D6", dark: "#3A2E14" },
    "background",
  );
  const warningColor = useThemeColor(
    { light: "#8A5B00", dark: "#F4C96B" },
    "text",
  );

  if (hasExternalAudioDevice) {
    return (
      <View
        accessibilityLiveRegion="polite"
        style={[styles.banner, { backgroundColor: connectedBackground }]}
      >
        <Ionicons name="headset" size={18} color={connectedColor} />
        <ThemedText style={[styles.label, { color: connectedColor }]}>
          {playing
            ? "Playing through connected audio device"
            : "Connected audio device"}
        </ThemedText>
      </View>
    );
  }

  if (!isSilent) {
    return null;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Silent mode is on. Tap for more information."
      onPress={() =>
        Alert.alert(
          "Silent mode is on",
          "Phone is on silent mode, so audio will not be played. Connect an audio device or turn off silent mode.",
          [{ text: "OK" }],
        )
      }
      style={({ pressed }) => [
        styles.banner,
        { backgroundColor: warningBackground },
        pressed && styles.pressed,
      ]}
    >
      <Ionicons name="volume-mute" size={19} color={warningColor} />
      <ThemedText style={[styles.label, { color: warningColor }]}>
        Silent mode is on
      </ThemedText>
      <Ionicons
        name="information-circle-outline"
        size={18}
        color={warningColor}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  banner: {
    minHeight: 44,
    marginTop: 16,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  label: {
    flexShrink: 1,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    textAlign: "center",
  },
  pressed: {
    opacity: 0.72,
  },
});
