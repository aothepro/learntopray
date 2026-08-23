import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ALL_SURAH } from "@/surah";

const SELECTABLE_SURAH = Object.keys(ALL_SURAH).filter(
  (surahName) => ALL_SURAH[surahName].length !== undefined,
);

export default function ExploreScreen() {
  const [selectedSurah, setSelectedSurah] = useState<string | null>(null);
  const pageBackground = useThemeColor({}, "background");
  const iconColor = useThemeColor({}, "icon");
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
              Choose a short surah for your guided prayer
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
                styles.badge,
                { backgroundColor: selectedBackground },
              ]}
            >
              <ThemedText style={[styles.badgeText, { color: accentColor }]}>
                Rakaat 1–2
              </ThemedText>
            </View>
          </View>

          <View style={styles.cards}>
            {SELECTABLE_SURAH.map((item) => {
              const surah = ALL_SURAH[item];
              const isSelected = selectedSurah === item;

              return (
                <Pressable
                  key={item}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={surah.title}
                  onPress={() => {
                    void Haptics.selectionAsync();
                    setSelectedSurah(item);
                  }}
                  style={({ pressed }) => [
                    styles.surahCard,
                    {
                      borderColor: isSelected ? accentColor : borderColor,
                      backgroundColor: isSelected
                        ? selectedBackground
                        : cardBackground,
                    },
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
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={accentColor}
                    />
                  ) : (
                    <Ionicons
                      name="ellipse-outline"
                      size={24}
                      color={iconColor}
                    />
                  )}
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
  badge: {
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
