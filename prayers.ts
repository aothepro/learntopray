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
    niyat: require("@/assets/audio/niyat/niat_subuh_x1.wav"),
    rakaat: 2
  },
  "zuhr": {
    title: "Zuhr",
    niyat: require("./assets/audio/niyat/niat_zuhur_x1.wav"),
    rakaat: 4
  },
  "asr": {
    title: "‘Asr",
    niyat: require("./assets/audio/niyat/niat_asr_x1.wav"),
    rakaat: 4
  },
  "Maghrib": {
    title: "Maghrib",
    niyat: require("./assets/audio/niyat/niat_magrib_x1.wav"),
    rakaat: 3
  },
  "ishak": {
    title: "‘Ishā",
    niyat: require("./assets/audio/niyat/niat_isha_x1.wav"),
    rakaat: 4
  },

};
