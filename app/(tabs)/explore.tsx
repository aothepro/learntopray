import {
  StyleSheet,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { ALL_SURAH } from "@/surah";
import React from "react";

export default function TabTwoScreen() {
  return (
    <SafeAreaView>
      <ThemedView style={styles.container}>
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
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 18,
  },
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
