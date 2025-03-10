import { Button } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  AudioPlayer,
  createAudioPlayer,
  PLAYBACK_STATUS_UPDATE,
} from "expo-audio";
import { ALL_SURAH, TSourceDetail } from "@/surah";
import { PRAYERS } from "@/prayers";
import { ThemedText } from "@/components/ThemedText";

const alfatihah: TSourceDetail = ALL_SURAH.alfatihah;
const takbir: TSourceDetail = {
  title: "takbir",
  source: require("@/assets/audio/takbir.mp3"),
};
const itidal: TSourceDetail = {
  title: "takbir",
  source: require("@/assets/audio/itidal.mp3"),
};
const sujud: TSourceDetail = {
  title: "sujud",
  source: require("@/assets/audio/itidal.mp3"),
};

const julus: TSourceDetail = {
  title: "julus",
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

      // TODO: 
      // Add "Assalamualaikum Warahmatullah" x2
    } else if (index % 2 !== 0) {
      // Even rakaat
      sourceDetails.push(tahiyat_awal);
    }
  }

  let players: AudioPlayer[];
  useEffect(() => {
    players = sourceDetails.map((sourceDetail, index) => {
      const player = createAudioPlayer(sourceDetail.source);
      player.addListener(PLAYBACK_STATUS_UPDATE, (status) => {
        if (status.didJustFinish) {
          player.seekTo(0);
          if (index < sourceDetails.length - 1) {
            players[index + 1].play();
          }
        }
      });

      return player;
    });

    return () => {
      players.map((player) => {
        player.removeAllListeners(PLAYBACK_STATUS_UPDATE);
        player.remove();
        player.release();
      });
    };
  }, []);
  return (
    <ThemedView>
      <Button
        title="Play Sound"
        onPress={() => {
          players[0].play();
        }}
      />
    </ThemedView>
  );
}
