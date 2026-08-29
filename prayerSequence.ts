import { ALL_SURAH, TSourceDetail } from "@/surah";
import { TPrayer } from "@/prayers";
import { type SurahSlots } from "@/surahAssignment";

const alfatihah: TSourceDetail = ALL_SURAH.alfatihah;

const takbir: TSourceDetail = {
  title: "Takbir",
  source: require("@/assets/audio/takbir.mp3"),
};

const itidal: TSourceDetail = {
  title: "Itidal",
  source: require("@/assets/audio/itidal.mp3"),
};

const duaQunut: TSourceDetail = {
  title: "Dua Qunut",
  source: require("@/assets/audio/qunut.mp3"),
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

type Prayer = TPrayer[string];

export type TPrayerStep = TSourceDetail & {
  rakaat: number | null;
};

type PrayerSequenceOptions = {
  prayerName: string;
  reciteDuaQunut: boolean;
};

export function buildPrayerSequence(
  prayer: Prayer,
  surahSlots: SurahSlots,
  options: PrayerSequenceOptions,
): TPrayerStep[] {
  const sourceDetails: TPrayerStep[] = [
    { title: "Niat", source: prayer.niat, rakaat: null },
  ];

  for (let index = 0; index < prayer.rakaat; index++) {
    const rakaat = index + 1;
    const addStep = (detail: TSourceDetail) => {
      sourceDetails.push({ ...detail, rakaat });
    };

    addStep(takbir);

    if (index === 0) {
      addStep({
        title: "Iftitah",
        source: require("@/assets/audio/iftitah.mp3"),
      });
    }

    addStep(alfatihah);

    if (index < 2) {
      const selectedKey = surahSlots[index];
      if (selectedKey) {
        addStep(ALL_SURAH[selectedKey]);
      }
    }

    addStep(takbir);
    addStep({
      title: "Ruku'",
      source: require("@/assets/audio/rukuk.mp3"),
    });
    addStep(itidal);
    if (
      options.prayerName === "subuh" &&
      options.reciteDuaQunut &&
      index === 1
    ) {
      addStep(duaQunut);
    }
    addStep(takbir);
    addStep(sujud);
    addStep(takbir);
    addStep(julus);
    addStep(takbir);
    addStep(sujud);

    if (index === prayer.rakaat - 1) {
      addStep(takbir);
      addStep(tahiyat_akhir);
      addStep(salam);
    } else if (index % 2 !== 0) {
      addStep(takbir);
      addStep(tahiyat_awal);
    }
  }

  return sourceDetails;
}
