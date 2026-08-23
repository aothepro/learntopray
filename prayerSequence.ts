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

export function buildPrayerSequence(prayer: Prayer): TSourceDetail[] {
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
      sourceDetails.push(tahiyat_akhir);
      sourceDetails.push(salam);
    } else if (index % 2 !== 0) {
      sourceDetails.push(tahiyat_awal);
    }
  }

  return sourceDetails;
}
