import { type ImageSourcePropType } from "react-native";

import { type PrayerPosture } from "@/prayerSequence";

export const POSTURE_IMAGE: Record<PrayerPosture, ImageSourcePropType> = {
  standing: require("@/assets/postures/standing.jpg"),
  takbir: require("@/assets/postures/takbir.jpg"),
  qiyam: require("@/assets/postures/qiyam.jpg"),
  ruku: require("@/assets/postures/ruku.jpg"),
  qunut: require("@/assets/postures/qunut.jpg"),
  sujud: require("@/assets/postures/sujud.jpg"),
  julus: require("@/assets/postures/julus.jpg"),
  iftirash: require("@/assets/postures/iftirash.jpg"),
  tawarruk: require("@/assets/postures/tawarruk.jpg"),
  salamRight: require("@/assets/postures/salam_right.jpg"),
  salamLeft: require("@/assets/postures/salam_left.jpg"),
};

export const POSTURE_LABEL: Record<PrayerPosture, string> = {
  standing: "Standing with arms at the sides",
  takbir: "Standing with hands raised beside the ears",
  qiyam: "Standing with the right hand over the left",
  ruku: "Bowing with hands on the knees",
  qunut: "Standing with palms raised",
  sujud: "Prostrating with the forehead on the ground",
  julus: "Sitting between prostrations",
  iftirash: "Sitting on the left foot with the right foot upright and the index finger raised",
  tawarruk: "Sitting with the left foot out to the right and the index finger raised",
  salamRight: "Sitting with the head turned to the right",
  salamLeft: "Sitting with the head turned to the left",
};
