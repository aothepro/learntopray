import { ALL_SURAH, TSourceDetail } from "@/surah";
import { TPrayer } from "@/prayers";

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

type Prayer = TPrayer[string];

export type TPrayerStep = TSourceDetail & {
  rakaat: number | null;
};

export function buildPrayerSequence(prayer: Prayer): TPrayerStep[] {
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

    // TEMPORARY Any surah
    if (index === 0) {
      addStep(ALL_SURAH.alkafirun);
    }
    if (index === 1) {
      addStep(ALL_SURAH.alikhlas);
    }

    addStep(takbir);
    addStep({
      title: "Ruku'",
      source: require("@/assets/audio/rukuk.mp3"),
    });
    addStep(itidal);
    addStep(takbir);
    addStep(sujud);
    addStep(takbir);
    addStep(julus);
    addStep(takbir);
    addStep(sujud);
    addStep(takbir);

    if (index === prayer.rakaat - 1) {
      addStep(tahiyat_akhir);
      addStep(salam);
    } else if (index % 2 !== 0) {
      addStep(tahiyat_awal);
    }
  }

  return sourceDetails;
}
