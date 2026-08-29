import { AudioSource } from "expo-audio";

export type TPrayer = {
  [key: string]: {
    title: string
    niyat: AudioSource,
    rakaat: number
  }
};

export const PRAYERS: TPrayer = {
  "subuh": {
    title: "Subuh",
    niyat: require("@/assets/audio/niyat/subuh.mp3"),
    rakaat: 2
  },
  "zuhr": {
    title: "Zuhr",
    niyat: require("./assets/audio/niyat/zuhur.mp3"),
    rakaat: 4
  },
  "asr": {
    title: "‘Asr",
    niyat: require("./assets/audio/niyat/asar.mp3"),
    rakaat: 4
  },
  "Maghrib": {
    title: "Maghrib",
    niyat: require("./assets/audio/niyat/maghrib.mp3"),
    rakaat: 3
  },
  "ishak": {
    title: "‘Ishā",
    niyat: require("./assets/audio/niyat/isyak.mp3"),
    rakaat: 4
  },

};
