import { ALL_SURAH, TSourceDetail } from "@/surah";
import { TPrayer } from "@/prayers";
import { type SurahSlots } from "@/surahAssignment";

const alfatihah: TSourceDetail = ALL_SURAH.alfatihah;

const takbirShort: TSourceDetail = {
  title: "Takbir",
  source: require("@/assets/audio/takbir_short.wav"),
};

const takbirMid: TSourceDetail = {
  title: "Takbir",
  source: require("@/assets/audio/takbir_mid.wav"),
};

const takbirLong: TSourceDetail = {
  title: "Takbir",
  source: require("@/assets/audio/takbir_long.wav"),
};

const itidal: TSourceDetail = {
  title: "Itidal",
  source: require("@/assets/audio/itidal_x1.wav"),
};

const duaQunut: TSourceDetail = {
  title: "Dua Qunut",
  source: require("@/assets/audio/qunut_x1.wav"),
};

const sujud: TSourceDetail = {
  title: "Sujud",
  source: require("@/assets/audio/sujud_x1.wav"),
};

const julus: TSourceDetail = {
  title: "Julus",
  source: require("@/assets/audio/julus_x1.wav"),
};

const tahiyat_awal: TSourceDetail = {
  title: "Tahiyat Awal",
  source: require("@/assets/audio/tahiyat_awal_x1.wav"),
};

const tahiyat_akhir: TSourceDetail = {
  title: "Tahiyat Akhir",
  source: require("@/assets/audio/tahiyat_akhir_x1.wav"),
};

const salam: TSourceDetail = {
  title: "Salam",
  source: require("@/assets/audio/salam_x1.wav"),
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
    { title: "Niyat", source: prayer.niyat, rakaat: null },
  ];

  for (let index = 0; index < prayer.rakaat; index++) {
    const rakaat = index + 1;
    const addStep = (detail: TSourceDetail) => {
      sourceDetails.push({ ...detail, rakaat });
    };

    addStep(index === 0 ? takbirMid : takbirLong);

    if (index === 0) {
      addStep({
        title: "Iftitah",
        source: require("@/assets/audio/iftitah_x1.wav"),
      });
    }

    addStep(alfatihah);

    if (index < 2) {
      const selectedKey = surahSlots[index];
      if (selectedKey) {
        addStep(ALL_SURAH[selectedKey]);
      }
    }

    addStep(takbirShort);
    addStep({
      title: "Ruku'",
      source: require("@/assets/audio/rukuk_x1.wav"),
    });
    addStep(itidal);
    if (
      options.prayerName === "subuh" &&
      options.reciteDuaQunut &&
      index === 1
    ) {
      addStep(duaQunut);
    }
    addStep(takbirLong);
    addStep(sujud);
    addStep(takbirShort);
    addStep(julus);
    addStep(takbirShort);
    addStep(sujud);

    if (index === prayer.rakaat - 1) {
      addStep(takbirShort);
      addStep(tahiyat_akhir);
      addStep(salam);
    } else if (index % 2 !== 0) {
      addStep(takbirShort);
      addStep(tahiyat_awal);
    }
  }

  return sourceDetails;
}
