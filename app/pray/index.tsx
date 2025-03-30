import { Pressable, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  AudioPlayer,
  createAudioPlayer,
  PLAYBACK_STATUS_UPDATE,
} from "expo-audio";
import { ALL_SURAH, TSourceDetail } from "@/surah";
import { PRAYERS } from "@/prayers";
import { ThemedText } from "@/components/ThemedText";
import { PLAYBACK_STATUS } from "@/ultilities/audio";

const alfatihah: TSourceDetail = ALL_SURAH.alfatihah;
const takbir: TSourceDetail = {
  title: "Takbir",
  source: require("@/assets/audio/takbir.mp3"),
};
const itidal: TSourceDetail = {
  title: "Itidal",
  source: require("@/assets/audio/itidal.mp3"),
};
const sujud: TSourceDetail = {
  title: "Sujud",
  source: require("@/assets/audio/sujud.mp3"),
};

const julus: TSourceDetail = {
  title: "Julus",
  source: require("@/assets/audio/julus.mp3"),
};

const tahiyat_awal: TSourceDetail = {
  title: "Tahiyat Awal",
  source: require("@/assets/audio/tahiyat_awal.mp3"),
};

const tahiyat_akhir: TSourceDetail = {
  title: "Tahiyat Akhir",
  source: require("@/assets/audio/tahiyat_akhir.mp3"),
};

const salam: TSourceDetail = {
  title: "Salam",
  source: require("@/assets/audio/salam.mp3"),
};

export default function PrayScreen() {
  const { prayerName } = useLocalSearchParams() as { prayerName: string };

  if (!PRAYERS[prayerName]) {
    console.log(prayerName, " does not exist in ", PRAYERS);
    return (
      <ThemedView>
        <ThemedText>Prayer Not Found</ThemedText>
      </ThemedView>
    );
  }

  const prayer = PRAYERS[prayerName];

  const sourceDetails: TSourceDetail[] = [
    { title: "Niat", source: prayer.niat },
  ];

  for (let index = 0; index < prayer.rakaat; index++) {
    sourceDetails.push(takbir);

    if (index === 0) {
      sourceDetails.push({
        title: "Iftitah",
        source: require("@/assets/audio/iftitah.mp3"),
      });
    }

    sourceDetails.push(alfatihah);

    // TEMPORARY Any surah
    if (index === 0) {
      sourceDetails.push(ALL_SURAH.alkafirun);
    }
    if (index === 1) {
      sourceDetails.push(ALL_SURAH.alikhlas);
    }

    sourceDetails.push(takbir);
    sourceDetails.push({
      title: "Ruku'",
      source: require("@/assets/audio/rukuk.mp3"),
    });
    sourceDetails.push(itidal);
    sourceDetails.push(takbir);
    sourceDetails.push(sujud);
    sourceDetails.push(takbir);
    sourceDetails.push(julus);
    sourceDetails.push(takbir);
    sourceDetails.push(sujud);
    sourceDetails.push(takbir);

    if (index === prayer.rakaat - 1) {
      // Last Rakaat
      sourceDetails.push(tahiyat_akhir);
      sourceDetails.push(salam);
    } else if (index % 2 !== 0) {
      // Even rakaat
      sourceDetails.push(tahiyat_awal);
    }
  }

  const INITIAL_AUDIO_PLAYER_DETAILS = {
    index: 0,
    player: createAudioPlayer(sourceDetails[0].source),
    stepTitle: sourceDetails[0].title,
  };

  const [currentAudioPlayerDetails, setCurrentAudioPlayerDetails] = useState<{
    index: number;
    player: AudioPlayer;
    stepTitle: string;
  }>(INITIAL_AUDIO_PLAYER_DETAILS);

  const [playbackStatus, setPlaybackStatus] = useState<PLAYBACK_STATUS>(
    PLAYBACK_STATUS.NOT_STARTED
  );

  useEffect(() => {
    currentAudioPlayerDetails.player.addListener(
      PLAYBACK_STATUS_UPDATE,
      (status) => {
        if (status.didJustFinish) {
          // Play next audio if has
          if (currentAudioPlayerDetails.index < sourceDetails.length - 1) {
            const nextIndexToPlay = currentAudioPlayerDetails.index + 1;
            const nextPlayer = createAudioPlayer(
              sourceDetails[nextIndexToPlay].source
            );
            nextPlayer.play();
            setCurrentAudioPlayerDetails({
              index: nextIndexToPlay,
              player: nextPlayer,
              stepTitle: sourceDetails[nextIndexToPlay].title,
            });
          } else {
            // Prayer Completed
            router.dismiss();
          }
        }
      }
    );

    return () => {
      try {
        currentAudioPlayerDetails.player.removeAllListeners(
          PLAYBACK_STATUS_UPDATE
        );
        currentAudioPlayerDetails.player.remove();
        currentAudioPlayerDetails.player.release();
      } catch (e) {
        console.log(
          "Failed to clean up audio player",
          e,
          currentAudioPlayerDetails.player
        );
      }
    };
  }, [currentAudioPlayerDetails]);

  return (
    <ThemedView style={styles.titleContainer}>
      <ThemedView style={{ ...styles.stepContainer, ...styles.visuals }}>
        <ThemedText>{currentAudioPlayerDetails.stepTitle}</ThemedText>
      </ThemedView>
      <ThemedView
        style={{ ...styles.stepContainer, ...styles.buttonContainer }}
      >
        {playbackStatus === PLAYBACK_STATUS.NOT_STARTED && (
          <Pressable
            style={styles.button}
            onPress={() => {
              currentAudioPlayerDetails.player.play();
              setPlaybackStatus(PLAYBACK_STATUS.PLAYING);
            }}
          >
            <ThemedText style={styles.buttonText}>Start Prayer</ThemedText>
          </Pressable>
        )}
        {playbackStatus === PLAYBACK_STATUS.PLAYING && (
          <>
            <Pressable
              style={styles.button}
              onPress={() => {
                currentAudioPlayerDetails.player.pause();
                setPlaybackStatus(PLAYBACK_STATUS.PAUSED);
              }}
            >
              <ThemedText style={styles.buttonText}>Pause</ThemedText>
            </Pressable>
          </>
        )}
        {playbackStatus === PLAYBACK_STATUS.PAUSED && (
          <>
            <Pressable
              style={styles.button}
              onPress={() => {
                currentAudioPlayerDetails.player.play();
                setPlaybackStatus(PLAYBACK_STATUS.PLAYING);
              }}
            >
              <ThemedText style={styles.buttonText}>Resume</ThemedText>
            </Pressable>
          </>
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
