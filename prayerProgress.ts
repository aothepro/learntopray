import { type TPrayerStep } from "@/prayerSequence";

export type RakaatMarker = {
  rakaat: number;
  startTime: number;
};

export function rakaatMarkers(
  steps: TPrayerStep[],
  durations: number[],
): RakaatMarker[] {
  const markers: RakaatMarker[] = [];
  const seen = new Set<number>();
  let startTime = 0;

  for (let index = 0; index < steps.length; index += 1) {
    const rakaat = steps[index].rakaat;
    if (rakaat !== null && !seen.has(rakaat)) {
      seen.add(rakaat);
      markers.push({ rakaat, startTime });
    }
    startTime += durations[index] ?? 0;
  }

  return markers;
}

export function stepIndexAtTime(durations: number[], time: number) {
  if (durations.length === 0) {
    return 0;
  }

  const targetTime = Math.max(time, 0);
  let index = 0;
  let startTime = 0;

  while (
    index < durations.length - 1 &&
    targetTime >= startTime + durations[index]
  ) {
    startTime += durations[index];
    index += 1;
  }

  return index;
}

export function stepAtTime(
  steps: TPrayerStep[],
  durations: number[],
  time: number,
) {
  return steps[stepIndexAtTime(durations, time)] ?? steps[0];
}
