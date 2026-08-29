import { StyleSheet, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NumberWheelInput } from "@/components/NumberWheelInput";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import {
  MAX_START_DELAY_SECONDS,
  MIN_START_DELAY_SECONDS,
  usePlaybackSettings,
} from "@/contexts/PlaybackSettingsContext";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function SettingsScreen() {
  const {
    startDelaySeconds,
    setStartDelaySeconds,
    reciteDuaQunut,
    setReciteDuaQunut,
  } = usePlaybackSettings();
  const pageBackground = useThemeColor({}, "background");
  const cardBorder = useThemeColor(
    { light: "#E6E8EA", dark: "#2A2D2E" },
    "icon",
  );
  const cardBackground = useThemeColor(
    { light: "#F7F8F8", dark: "#1C1E1F" },
    "background",
  );
  const accentColor = useThemeColor(
    { light: "#0A7EA4", dark: "#77C5D5" },
    "tint",
  );
  const switchTrackOff = useThemeColor(
    { light: "#C8CCCF", dark: "#4A4E50" },
    "icon",
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: pageBackground }]}
      edges={["top"]}
    >
      <ThemedView style={styles.screen}>
        <View style={styles.header}>
          <ThemedText type="title">Settings</ThemedText>
          <ThemedText style={styles.lede}>
            Choose how your guided prayer audio is played
          </ThemedText>
        </View>

        <View style={styles.cards}>
          <View
            style={[
              styles.card,
              { borderColor: cardBorder, backgroundColor: cardBackground },
            ]}
          >
            <ThemedText type="subtitle">Start delay</ThemedText>
            <ThemedText style={styles.meta}>
              {startDelaySeconds === 0
                ? "Audio starts immediately"
                : `Audio starts after ${startDelaySeconds} seconds`}
            </ThemedText>
            <NumberWheelInput
              value={startDelaySeconds}
              onChange={setStartDelaySeconds}
              min={MIN_START_DELAY_SECONDS}
              max={MAX_START_DELAY_SECONDS}
              accessibilityLabel="Start delay"
              incrementAccessibilityLabel="Increase delay"
              decrementAccessibilityLabel="Decrease delay"
              formatLabel={(seconds) =>
                seconds === 0 ? "No delay" : `${seconds}s`
              }
            />
          </View>

          <View
            style={[
              styles.toggleCard,
              { borderColor: cardBorder, backgroundColor: cardBackground },
            ]}
          >
            <View style={styles.toggleCopy}>
              <ThemedText type="defaultSemiBold">
                Recite Dua Qunut
              </ThemedText>
              <ThemedText style={styles.toggleMeta}>
                Play Dua Qunut after I&apos;tidal in Subuh&apos;s second rakaat
              </ThemedText>
            </View>
            <Switch
              value={reciteDuaQunut}
              onValueChange={setReciteDuaQunut}
              accessibilityLabel="Recite Dua Qunut for Subuh prayer"
              accessibilityRole="switch"
              accessibilityState={{ checked: reciteDuaQunut }}
              trackColor={{ false: switchTrackOff, true: accentColor }}
            />
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 28,
    gap: 8,
  },
  lede: {
    opacity: 0.65,
    fontSize: 16,
    lineHeight: 22,
  },
  cards: {
    gap: 12,
  },
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingTop: 18,
    paddingHorizontal: 10,
    paddingBottom: 10,
    gap: 6,
  },
  meta: {
    marginHorizontal: 8,
    marginBottom: 8,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.6,
  },
  toggleCard: {
    minHeight: 76,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  toggleCopy: {
    flex: 1,
    gap: 2,
  },
  toggleMeta: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.6,
  },
});
