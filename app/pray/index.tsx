import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAudioPlaylist, useAudioPlaylistStatus } from "expo-audio";
import { PRAYERS, TPrayer } from "@/prayers";
import { ThemedText } from "@/components/ThemedText";
import { PLAYBACK_STATUS } from "@/ultilities/audio";
import { buildPrayerSequence } from "@/prayerSequence";

type Prayer = TPrayer[string];

export default function PrayScreen() {
  const { prayerName } = useLocalSearchParams() as { prayerName: string };
  const prayer = PRAYERS[prayerName];

  if (!prayer) {
    console.log(prayerName, " does not exist in ", PRAYERS);
    return (
      <ThemedView>
        <ThemedText>Prayer Not Found</ThemedText>
      </ThemedView>
    );
  }

  return <PrayPlayer prayer={prayer} />;
}

function PrayPlayer({ prayer }: { prayer: Prayer }) {
  const sourceDetails = useMemo(() => buildPrayerSequence(prayer), [prayer]);
  const playlist = useAudioPlaylist({
    sources: sourceDetails.map((detail) => detail.source),
    loop: "none",
  });
  const status = useAudioPlaylistStatus(playlist);
  const [playbackStatus, setPlaybackStatus] = useState<PLAYBACK_STATUS>(
    PLAYBACK_STATUS.NOT_STARTED,
  );
  const didComplete = useRef(false);

  const currentStepTitle =
    sourceDetails[status.currentIndex]?.title ?? sourceDetails[0]?.title;

  useEffect(() => {
    if (didComplete.current || sourceDetails.length === 0) {
      return;
    }

    const isLastTrack = status.currentIndex >= sourceDetails.length - 1;
    if (status.didJustFinish && isLastTrack) {
      didComplete.current = true;
      router.dismiss();
    }
  }, [status.didJustFinish, status.currentIndex, sourceDetails.length]);

  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedView style={{ ...styles.stepContainer, ...styles.visuals }}>
        <ThemedText>{currentStepTitle}</ThemedText>
      </ThemedView>
      <ThemedView
        style={{ ...styles.stepContainer, ...styles.buttonContainer }}
      >
        {playbackStatus === PLAYBACK_STATUS.NOT_STARTED && (
          <Pressable
            style={styles.button}
            onPress={() => {
              playlist.play();
              setPlaybackStatus(PLAYBACK_STATUS.PLAYING);
            }}
          >
            <ThemedText style={styles.buttonText}>Start Prayer</ThemedText>
          </Pressable>
        )}
        {playbackStatus === PLAYBACK_STATUS.PLAYING && (
          <Pressable
            style={styles.button}
            onPress={() => {
              playlist.pause();
              setPlaybackStatus(PLAYBACK_STATUS.PAUSED);
            }}
          >
            <ThemedText style={styles.buttonText}>Pause</ThemedText>
          </Pressable>
        )}
        {playbackStatus === PLAYBACK_STATUS.PAUSED && (
          <Pressable
            style={styles.button}
            onPress={() => {
              playlist.play();
              setPlaybackStatus(PLAYBACK_STATUS.PLAYING);
            }}
          >
            <ThemedText style={styles.buttonText}>Resume</ThemedText>
          </Pressable>
        )}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  visuals: {
    flexGrow: 1,
    justifyContent: "center",
  },
  buttonContainer: {
    width: "100%",
    paddingBottom: 20,
    paddingHorizontal: "auto",
    alignItems: "center",
  },
  button: {
    minWidth: 200,
    maxWidth: 300,
    padding: 15,
    alignItems: "center",
    borderRadius: 5,
    backgroundColor: "#007AFF",
    color: "#FFFFFF",
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
