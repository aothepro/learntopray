import { StyleSheet, FlatList, Image, Pressable } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ALL_SURAH } from "@/surah";
import React from "react";

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Surah</ThemedText>
      </ThemedView>
      <ThemedView>
        <ThemedText type="subtitle">Select Rakaat</ThemedText>
      </ThemedView>
      <ThemedText type="subtitle">
        Select surah to use in your prayer
      </ThemedText>
      <Collapsible title="Short" isDefaultOpen={true}>
        <ThemedView>
          <FlatList
            data={Object.keys(ALL_SURAH).filter(
              (surahName) => ALL_SURAH[surahName].length != undefined
            )}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => {
                  console.log("selected: ", item);
                }}
              >
                <ThemedView
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <ThemedText>{item}</ThemedText>
                  <Image
                    source={require("@/assets/icons/selected.png")}
                    style={{ maxHeight: 25, maxWidth: 25 }}
                  />
                </ThemedView>
              </Pressable>
            )}
            keyExtractor={(item) => item}
          />
        </ThemedView>
      </Collapsible>
      <Collapsible title="Medium">
        <ThemedText>
          Medium length surah will be listed here in the next update!
        </ThemedText>
      </Collapsible>
      <Collapsible title="Long">
        <ThemedText>
          Longer length surah will be listed here in the next update!
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
