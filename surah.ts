import { AudioSource } from "expo-audio";

export type TSurahLength = "short" | "medium" | "long";

export type TSourceDetail = {
  title: string;
  source: AudioSource;
};

export type TSurah = {
  [key: string]: {
    length?: TSurahLength;
  } & TSourceDetail
};



export const ALL_SURAH: TSurah = {
  alfatihah: {
    title: "Al Fatihah",
    source: require("@/assets/audio/surah/alfatihah_x1.wav"),
  },
  alikhlas: {
    title: "Al Ikhlas",
    source: require("@/assets/audio/surah/short/aliklas_x1.wav"),
    length: "short"
  },
  alkafirun: {
    title: "Al Kafirun",
    source: require("@/assets/audio/surah/short/alkafirun_x1.wav"),
    length: "short"
  },
  annas: {
    title: "An Nas",
    source: require("@/assets/audio/surah/short/annas_x1.wav"),
    length: "short"
  },
  alfalaq: {
    title: "Al Falaq",
    source: require("@/assets/audio/surah/short/alfalaq_x1.wav"),
    length: "short"
  },

};

export const SELECTABLE_SURAH_KEYS = Object.keys(ALL_SURAH).filter(
  (surahName) => ALL_SURAH[surahName].length !== undefined,
);

export function isSelectableSurahKey(key: string) {
  return ALL_SURAH[key]?.length !== undefined;
}


