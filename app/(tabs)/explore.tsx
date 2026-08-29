import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSurahSelection } from "@/contexts/SurahSelectionContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ALL_SURAH, SELECTABLE_SURAH_KEYS } from "@/surah";
import {
  areBothSlotsFilled,
  rakaatsForSurah,
} from "@/surahAssignment";

export default function ExploreScreen() {
  const { slots, toggleSurah } = useSurahSelection();
  const pairFilled = areBothSlotsFilled(slots);
  const pageBackground = useThemeColor({}, "background");
  const borderColor = useThemeColor(
    { light: "#E6E8EA", dark: "#2A2D2E" },
    "icon",
  );
  const cardBackground = useThemeColor(
    { light: "#F7F8F8", dark: "#1C1E1F" },
    "background",
  );
  const selectedBackground = useThemeColor(
    { light: "#DDEFF3", dark: "#24373B" },
    "background",
  );
  const accentColor = useThemeColor(
    { light: "#0A7EA4", dark: "#77C5D5" },
    "tint",
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: pageBackground }]}
      edges={["top"]}
    >
      <ThemedView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemedText type="title">Explore</ThemedText>
            <ThemedText style={styles.lede}>
              Assign short surahs to rakaat 1 and 2. Tap to fill the next empty
              rakaat, or tap an assigned surah to remove it.
            </ThemedText>
          </View>

          <View style={styles.sectionHeader}>
            <View>
              <ThemedText type="subtitle">Short surahs</ThemedText>
              <ThemedText style={styles.sectionMeta}>
                Played after Al Fatihah
              </ThemedText>
            </View>
            <View
              style={[
                styles.sectionBadge,
                { backgroundColor: selectedBackground },
              ]}
            >
              <ThemedText style={[styles.badgeText, { color: accentColor }]}>
                Rakaat 1–2
              </ThemedText>
            </View>
          </View>

          <View style={styles.cards}>
            {SELECTABLE_SURAH_KEYS.map((item) => {
              const surah = ALL_SURAH[item];
              const rakaats = rakaatsForSurah(slots, item);
              const isSelected = rakaats.length > 0;
              const isUnavailable = pairFilled && !isSelected;

              return (
                <Pressable
                  key={item}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: isSelected,
                  }}
                  accessibilityLabel={assignmentLabel(surah.title, rakaats)}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    toggleSurah(item);
                  }}
                  style={({ pressed }) => [
                    styles.surahCard,
                    {
                      borderColor: isSelected ? accentColor : borderColor,
                      backgroundColor: isSelected
                        ? selectedBackground
                        : cardBackground,
                    },
                    isUnavailable && styles.unavailable,
                    pressed && styles.pressed,
                  ]}
                >
                  <View style={styles.surahCopy}>
                    <ThemedText type="defaultSemiBold">
                      {surah.title}
                    </ThemedText>
                    <ThemedText style={styles.surahMeta}>Short</ThemedText>
                  </View>
                  {isSelected ? (
                    <View style={styles.rakaatBadges}>
                      {rakaats.map((rakaat) => (
                        <View
                          key={rakaat}
                          style={[
                            styles.rakaatBadge,
                            { backgroundColor: accentColor },
                          ]}
                        >
                          <ThemedText
                            lightColor="#fff"
                            darkColor="#11181C"
                            style={styles.rakaatBadgeText}
                          >
                            {`Rakaat ${rakaat}`}
                          </ThemedText>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.comingSoon}>
            <ThemedText type="defaultSemiBold">More recitations</ThemedText>
            <ThemedText style={styles.comingSoonText}>
              Medium and long surahs are coming in a future update.
            </ThemedText>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function assignmentLabel(title: string, rakaats: number[]) {
  if (rakaats.length === 0) {
    return `${title}, not assigned`;
  }

  return `${title}, assigned to rakaat ${rakaats.join(" and ")}`;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 120,
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
  sectionHeader: {
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  sectionMeta: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.6,
  },
  sectionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  cards: {
    gap: 10,
  },
  surahCard: {
    minHeight: 76,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  surahCopy: {
    flex: 1,
    gap: 2,
  },
  surahMeta: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.55,
  },
  rakaatBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 6,
    maxWidth: "52%",
  },
  rakaatBadge: {
    minHeight: 28,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  rakaatBadgeText: {
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  unavailable: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  comingSoon: {
    marginTop: 28,
    padding: 18,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(127, 127, 127, 0.3)",
    gap: 8,
  },
  comingSoonText: {
    opacity: 0.6,
    fontSize: 14,
    lineHeight: 20,
  },
});
