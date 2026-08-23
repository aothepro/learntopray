import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, router, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  setAudioModeAsync,
  useAudioPlaylist,
  useAudioPlaylistStatus,
} from "expo-audio";
import { PRAYERS, TPrayer } from "@/prayers";
import { ThemedText } from "@/components/ThemedText";
import { buildPrayerSequence } from "@/prayerSequence";
import { PrayerPlayerBar } from "@/components/PrayerPlayerBar";
import { useTrackDurations } from "@/hooks/useTrackDurations";
import { useAudioEnvironment } from "@/hooks/useAudioEnvironment";
import { AudioOutputStatus } from "@/components/AudioOutputStatus";

type Prayer = TPrayer[string];

export default function PrayScreen() {
  const { prayerName } = useLocalSearchParams() as { prayerName: string };
  const prayer = PRAYERS[prayerName];

  const title = prayer?.title ?? "Prayer";

  if (!prayer) {
    console.log(prayerName, " does not exist in ", PRAYERS);
    return (
      <>
        <Stack.Screen
          options={{
            title,
            gestureEnabled: false,
            fullScreenGestureEnabled: false,
          }}
        />
        <ThemedView>
          <ThemedText>Prayer Not Found</ThemedText>
        </ThemedView>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title,
          gestureEnabled: false,
          fullScreenGestureEnabled: false,
        }}
      />
      <PrayPlayer prayer={prayer} />
    </>
  );
}

function PrayPlayer({ prayer }: { prayer: Prayer }) {
  const sourceDetails = useMemo(() => buildPrayerSequence(prayer), [prayer]);
  const sources = useMemo(
    () => sourceDetails.map((detail) => detail.source),
    [sourceDetails],
  );
  const playlist = useAudioPlaylist({
    sources,
    loop: "none",
  });
  const status = useAudioPlaylistStatus(playlist);
  const { durations, isReady: canSeek } = useTrackDurations(sources);
  const { hasExternalAudioDevice, isSilent } = useAudioEnvironment();
  const didComplete = useRef(false);
  const pendingSeek = useRef<{ index: number; offset: number } | null>(null);

  const currentStep =
    sourceDetails[status.currentIndex] ?? sourceDetails[0];
  const elapsed = useMemo(
    () => {
      if (!canSeek) {
        return 0;
      }

      return (
        durations
          .slice(0, status.currentIndex)
          .reduce((sum, duration) => sum + duration, 0) + status.currentTime
      );
    },
    [canSeek, durations, status.currentIndex, status.currentTime],
  );
  const total = useMemo(
    () => durations.reduce((sum, duration) => sum + duration, 0),
    [durations],
  );

  useEffect(() => {
    const seek = pendingSeek.current;
    if (!seek || status.currentIndex !== seek.index) {
      return;
    }

    pendingSeek.current = null;
    playlist.seekTo(seek.offset);
  }, [playlist, status.currentIndex]);

  const configureAudioMode = useCallback(
    () =>
      setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: hasExternalAudioDevice,
        shouldPlayInBackground: true,
        interruptionMode: "doNotMix",
      }),
    [hasExternalAudioDevice],
  );

  useEffect(() => {
    void configureAudioMode().catch((error) => {
      console.warn("Unable to configure audio mode", error);
    });
  }, [configureAudioMode]);

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

  const seekToPrayerTime = useCallback(
    (requestedTime: number) => {
      if (!canSeek || total <= 0) {
        return;
      }

      const targetTime = Math.min(
        Math.max(requestedTime, 0),
        Math.max(total - 0.01, 0),
      );
      let index = 0;
      let startTime = 0;

      while (
        index < durations.length - 1 &&
        targetTime >= startTime + durations[index]
      ) {
        startTime += durations[index];
        index += 1;
      }

      const offset = targetTime - startTime;
      if (index === status.currentIndex) {
        playlist.seekTo(offset);
      } else {
        pendingSeek.current = { index, offset };
        playlist.skipTo(index);
      }
    },
    [canSeek, durations, playlist, status.currentIndex, total],
  );

  const playPrayer = useCallback(async () => {
    try {
      await configureAudioMode();
    } catch (error) {
      console.warn("Unable to configure audio mode", error);
    }

    playlist.play();
  }, [configureAudioMode, playlist]);

  const togglePlayback = useCallback(() => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

    if (status.playing) {
      playlist.pause();
    } else {
      void playPrayer();
    }
  }, [playPrayer, playlist, status.playing]);

  const startPlayback = useCallback(() => {
    if (!status.playing) {
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
      void playPrayer();
    }
  }, [playPrayer, status.playing]);

  return (
    <ThemedView style={styles.container}>
      <AudioOutputStatus
        hasExternalAudioDevice={hasExternalAudioDevice}
        isSilent={isSilent}
        playing={status.playing}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start prayer"
        onPress={startPlayback}
        style={styles.currentStep}
      >
        <ThemedText type="subtitle" style={styles.rakaat}>
          {currentStep?.rakaat
            ? `Rakaat ${currentStep.rakaat} of ${prayer.rakaat}`
            : "Before Rakaat"}
        </ThemedText>
        <ThemedText type="title" style={styles.clipTitle}>
          {currentStep?.title}
        </ThemedText>
      </Pressable>
      <PrayerPlayerBar
        elapsed={elapsed}
        total={total}
        playing={status.playing}
        canSeek={canSeek}
        onSeek={seekToPrayerTime}
        onTogglePlayback={togglePlayback}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  currentStep: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 24,
  },
  rakaat: {
    opacity: 0.7,
    textAlign: "center",
  },
  clipTitle: {
    textAlign: "center",
  },
});
