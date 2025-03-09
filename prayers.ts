import { AudioSource } from "expo-audio";

export type TPrayer = {
  [key: string]: {
    title: string
    niat: AudioSource,
    rakaat: number
  }
};

export const PRAYERS: TPrayer = {
  "subuh": {
    title: "Subuh",
    niat: require("@/assets/audio/niat/subuh.mp3"),
    rakaat: 2
  },
  "zuhr": {
    title: "Zuhr",
    niat: require("./assets/audio/niat/subuh.mp3"),
    rakaat: 4
  },
  "asr": {
    title: "‘Asr",
    niat: require("./assets/audio/niat/subuh.mp3"),
    rakaat: 4
  },
  "Maghrib": {
    title: "Maghrib",
    niat: require("./assets/audio/niat/subuh.mp3"),
    rakaat: 3
  },
  "ishak": {
    title: "‘Ishā",
    niat: require("./assets/audio/niat/subuh.mp3"),
    rakaat: 4
  },

};
