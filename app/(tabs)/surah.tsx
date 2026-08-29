import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useSurahSelection } from "@/contexts/SurahSelectionContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ALL_SURAH, SELECTABLE_SURAH_KEYS } from "@/surah";
import {
  type SurahSlotIndex,
  rakaatsForSurah,
} from "@/surahAssignment";

export default function SurahScreen() {
  const { slots, assignSurah } = useSurahSelection();
  const [activeSlot, setActiveSlot] = useState<SurahSlotIndex>(0);
  const { width } = useWindowDimensions();
  const slotsSideBySide = width >= 390;
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

  const guidance = useMemo(() => {
    const activeRakaat = activeSlot + 1;
    const otherSlot: SurahSlotIndex = activeSlot === 0 ? 1 : 0;

    if (slots[activeSlot] === null) {
      return {
        title: `Choose a surah for Rakaat ${activeRakaat}`,
        detail: `Rakaat ${activeRakaat} still needs a surah.`,
      };
    }

    if (slots[otherSlot] === null) {
      return {
        title: `Rakaat ${otherSlot + 1} needs a surah`,
        detail: `Tap the Rakaat ${otherSlot + 1} slot above to continue.`,
      };
    }

    return {
      title: `Choose a surah for Rakaat ${activeRakaat}`,
      detail: "Tap a surah below to change this rakaat.",
    };
  }, [activeSlot, slots]);

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
            <ThemedText type="title">Surah</ThemedText>
            <ThemedText style={styles.lede}>
              Choose the short surahs played after Al Fatihah in your prayer.
            </ThemedText>
          </View>

          <View
            style={[
              styles.selectionSection,
              { borderColor, backgroundColor: pageBackground },
            ]}
          >
            <View style={styles.sectionHeader}>
              <ThemedText type="subtitle">Short surahs</ThemedText>
              <ThemedText style={styles.sectionMeta}>
                First select a rakaat, then choose its surah below.
              </ThemedText>
            </View>
            <View
              style={[
                styles.slotList,
                slotsSideBySide && styles.slotListSideBySide,
              ]}
            >
              <RakaatSlotCard
                rakaat={1}
                surahTitle={slotTitle(slots[0])}
                isEmpty={slots[0] === null}
                selected={activeSlot === 0}
                sideBySide={slotsSideBySide}
                onSelect={() => {
                  void Haptics.selectionAsync();
                  setActiveSlot(0);
                }}
                borderColor={borderColor}
                cardBackground={cardBackground}
                selectedBackground={selectedBackground}
                accentColor={accentColor}
              />
              <RakaatSlotCard
                rakaat={2}
                surahTitle={slotTitle(slots[1])}
                isEmpty={slots[1] === null}
                selected={activeSlot === 1}
                sideBySide={slotsSideBySide}
                onSelect={() => {
                  void Haptics.selectionAsync();
                  setActiveSlot(1);
                }}
                borderColor={borderColor}
                cardBackground={cardBackground}
                selectedBackground={selectedBackground}
                accentColor={accentColor}
              />
            </View>

            <View style={styles.choiceHeader}>
              <ThemedText type="defaultSemiBold">{guidance.title}</ThemedText>
              <ThemedText style={styles.choiceMeta}>
                {guidance.detail}
              </ThemedText>
            </View>

            <View style={styles.cards}>
              {SELECTABLE_SURAH_KEYS.map((item) => {
                const surah = ALL_SURAH[item];
                const rakaats = rakaatsForSurah(slots, item);
                const assignedToActive = slots[activeSlot] === item;

                return (
                  <Pressable
                    key={item}
                    accessibilityRole="button"
                    accessibilityState={{ selected: assignedToActive }}
                    accessibilityLabel={listRowLabel(
                      surah.title,
                      activeSlot,
                      rakaats,
                    )}
                    onPress={() => {
                      void Haptics.selectionAsync();
                      assignSurah(activeSlot, item);
                      const otherSlot: SurahSlotIndex =
                        activeSlot === 0 ? 1 : 0;
                      if (slots[otherSlot] === null) {
                        setActiveSlot(otherSlot);
                      }
                    }}
                    style={({ pressed }) => [
                      styles.surahCard,
                      {
                        borderColor: assignedToActive
                          ? accentColor
                          : borderColor,
                        backgroundColor: assignedToActive
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
                    {rakaats.length > 0 ? (
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

function slotTitle(surahKey: string | null) {
  if (!surahKey) {
    return "Select a surah";
  }

  return ALL_SURAH[surahKey]?.title ?? "Select a surah";
}

function listRowLabel(
  title: string,
  activeSlot: SurahSlotIndex,
  rakaats: number[],
) {
  const assignment =
    rakaats.length === 0
      ? "not assigned"
      : `assigned to rakaat ${rakaats.join(" and ")}`;

  return `${title}, ${assignment}. Sets rakaat ${activeSlot + 1}`;
}

function RakaatSlotCard({
  rakaat,
  surahTitle,
  isEmpty,
  selected,
  sideBySide,
  onSelect,
  borderColor,
  cardBackground,
  selectedBackground,
  accentColor,
}: {
  rakaat: 1 | 2;
  surahTitle: string;
  isEmpty: boolean;
  selected: boolean;
  sideBySide: boolean;
  onSelect: () => void;
  borderColor: string;
  cardBackground: string;
  selectedBackground: string;
  accentColor: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={`Rakaat ${rakaat}, ${surahTitle}`}
      accessibilityHint={
        selected
          ? "Selected. Choose a surah from the list below"
          : "Selects this rakaat to choose its surah"
      }
      onPress={onSelect}
      style={({ pressed }) => [
        styles.slotCard,
        sideBySide && styles.slotCardSideBySide,
        {
          borderColor: selected ? accentColor : borderColor,
          backgroundColor: selected ? selectedBackground : cardBackground,
        },
        isEmpty && styles.emptySlot,
        isEmpty && { borderColor: accentColor },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.slotCopy}>
        <ThemedText style={[styles.slotLabel, { color: accentColor }]}>
          {`Rakaat ${rakaat}`}
        </ThemedText>
        <ThemedText
          type="defaultSemiBold"
          style={isEmpty ? { color: accentColor } : undefined}
        >
          {surahTitle}
        </ThemedText>
        {isEmpty ? (
          <ThemedText style={styles.emptyHint}>Required</ThemedText>
        ) : null}
      </View>
    </Pressable>
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
    paddingBottom: 20,
    gap: 8,
  },
  lede: {
    opacity: 0.65,
    fontSize: 16,
    lineHeight: 22,
  },
  selectionSection: {
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 18,
  },
  slotList: {
    gap: 10,
  },
  slotListSideBySide: {
    flexDirection: "row",
  },
  slotCard: {
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
  slotCardSideBySide: {
    flex: 1,
    minWidth: 0,
    minHeight: 124,
    flexDirection: "column",
    alignItems: "stretch",
    gap: 8,
  },
  emptySlot: {
    borderWidth: 1,
    borderStyle: "dashed",
  },
  slotCopy: {
    flex: 1,
    gap: 2,
  },
  slotLabel: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },
  emptyHint: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.65,
  },
  sectionHeader: {
    marginBottom: 14,
  },
  sectionMeta: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.6,
  },
  choiceHeader: {
    marginTop: 16,
    marginBottom: 12,
    paddingTop: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(127, 127, 127, 0.3)",
    gap: 2,
  },
  choiceMeta: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.6,
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
