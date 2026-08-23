import { FlatList, Pressable, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Link } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useThemeColor } from "@/hooks/useThemeColor";
import { PRAYERS } from "@/prayers";

const PRAYER_KEYS = Object.keys(PRAYERS);

export default function HomeScreen() {
  const iconColor = useThemeColor({}, "icon");
  const cardBorder = useThemeColor(
    { light: "#E6E8EA", dark: "#2A2D2E" },
    "icon",
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ThemedView style={styles.screen}>
        <FlatList
          data={PRAYER_KEYS}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <ThemedText type="title">Prayers</ThemedText>
              <ThemedText style={styles.lede}>
                Choose a prayer to begin
              </ThemedText>
            </View>
          }
          renderItem={({ item }) => {
            const prayer = PRAYERS[item];

            return (
              <Link
                href={{
                  pathname: "/pray",
                  params: { prayerName: item },
                }}
                asChild
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${prayer.title}, ${prayer.rakaat} rakaat`}
                  onPressIn={() => {
                    if (process.env.EXPO_OS === "ios") {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                  }}
                  style={({ pressed }) => [
                    styles.card,
                    { borderColor: cardBorder },
                    pressed && styles.cardPressed,
                  ]}
                >
                  <ThemedView
                    lightColor="#F7F8F8"
                    darkColor="#1C1E1F"
                    style={styles.cardInner}
                  >
                    <View style={styles.cardCopy}>
                      <ThemedText type="subtitle">{prayer.title}</ThemedText>
                      <ThemedText style={styles.meta}>
                        {prayer.rakaat} rakaat
                      </ThemedText>
                    </View>
                    <IconSymbol
                      name="chevron.right"
                      size={18}
                      color={iconColor}
                    />
                  </ThemedView>
                </Pressable>
              </Link>
            );
          }}
        />
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
  list: {
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
  card: {
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  cardPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.985 }],
  },
  cardInner: {
    minHeight: 84,
    paddingVertical: 18,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  cardCopy: {
    flex: 1,
    gap: 4,
  },
  meta: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.6,
  },
});
