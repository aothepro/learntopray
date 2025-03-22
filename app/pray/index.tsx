import { Button } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
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
    { title: "niat", source: prayer.niat },
  ];

  for (let index = 0; index < prayer.rakaat; index++) {
    sourceDetails.push(takbir);

    if (index === 0) {
      sourceDetails.push({
        title: "iftitah",
        source: require("@/assets/audio/iftitah.mp3"),
      });
    }

    sourceDetails.push(alfatihah);

    // TEMPORARY Any surah
    sourceDetails.push({
      title: "any surah",
      source: require("@/assets/audio/surah/short/alikhlas.mp3"),
    });

    sourceDetails.push(takbir);
    sourceDetails.push({
      title: "ruku'",
      source: require("@/assets/audio/rukuk.mp3"),
    });
    sourceDetails.push(itidal);
    sourceDetails.push(takbir);
    sourceDetails.push(sujud);
    sourceDetails.push(takbir);
    sourceDetails.push(julus);
    sourceDetails.push(takbir);
    sourceDetails.push(sujud);

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
  };

  const [currentAudioPlayerDetails, setCurrentAudioPlayerDetails] = useState<{
    index: number;
    player: AudioPlayer;
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
            });
          }
        }
      }
    );

    return () => {
      currentAudioPlayerDetails.player.removeAllListeners(
        PLAYBACK_STATUS_UPDATE
      );
      currentAudioPlayerDetails.player.remove();
      currentAudioPlayerDetails.player.release();
    };
  }, [currentAudioPlayerDetails]);

  return (
    <ThemedView>
      {playbackStatus === PLAYBACK_STATUS.NOT_STARTED && (
        <Button
          title="Start Prayer"
          onPress={() => {
            currentAudioPlayerDetails.player.play();
            setPlaybackStatus(PLAYBACK_STATUS.PLAYING);
          }}
        />
      )}
      {playbackStatus === PLAYBACK_STATUS.PLAYING && (
        <>
          <Button
            title="Pause"
            onPress={() => {
              currentAudioPlayerDetails.player.pause();
              setPlaybackStatus(PLAYBACK_STATUS.PAUSED);
            }}
          />
        </>
      )}
      {playbackStatus === PLAYBACK_STATUS.PAUSED && (
        <>
          <Button
            title="Resume"
            onPress={() => {
              currentAudioPlayerDetails.player.play();
              setPlaybackStatus(PLAYBACK_STATUS.PLAYING);
            }}
          />
        </>
      )}
    </ThemedView>
  );
}
