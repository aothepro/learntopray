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
    source: require("@/assets/audio/surah/alfatihah.mp3"),
  },
  alikhlas: {
    title: "Al Ikhlas",
    source: require("@/assets/audio/surah/short/alikhlas.mp3"),
    length: "short"
  },
  alkafirun: {
    title: "Al Kafirun",
    source: require("@/assets/audio/surah/short/alkafirun.mp3"),
    length: "short"
  },

};


