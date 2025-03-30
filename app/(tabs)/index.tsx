import { StyleSheet, Pressable, SectionList, SafeAreaView } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Link } from "expo-router";
import { PRAYERS } from "@/prayers";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ThemedView style={styles.container}>
        <SectionList
          sections={[
            {
              title: "Select Your Prayer",
              data: Object.keys(PRAYERS),
            },
          ]}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <ThemedView style={styles.stepContainer}>
              <Link
                key={item}
                href={{
                  pathname: "/pray",
                  params: { prayerName: item },
                }}
                asChild
              >
                <Pressable>
                  <ThemedText type="subtitle">{PRAYERS[item].title}</ThemedText>
                </Pressable>
              </Link>
            </ThemedView>
          )}
          renderSectionHeader={({ section: { title } }) => (
            <ThemedView style={styles.titleContainer}>
              <ThemedText type="title">{title}</ThemedText>
              <HelloWave />
            </ThemedView>
          )}
        />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  stepContainer: {
    padding: 8,
    marginBottom: 8,
    borderColor: "#DADADA",
    borderTopWidth: 1,
    margin: 8,
  },
});
