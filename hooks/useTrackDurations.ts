import { useEffect, useState } from "react";
import {
  AudioSource,
  createAudioPlayer,
  type AudioPlayer,
} from "expo-audio";

type TrackDurations = {
  durations: number[];
  isReady: boolean;
};

const sourceKey = (source: AudioSource) => JSON.stringify(source);

export function useTrackDurations(sources: AudioSource[]): TrackDurations {
  const [result, setResult] = useState<TrackDurations>({
    durations: sources.map(() => 0),
    isReady: false,
  });

  useEffect(() => {
    let cancelled = false;
    const cancelLoads: (() => void)[] = [];
    const uniqueSources = new Map<string, AudioSource>();

    sources.forEach((source) => uniqueSources.set(sourceKey(source), source));
    setResult({ durations: sources.map(() => 0), isReady: false });

    const loadDuration = (source: AudioSource) =>
      new Promise<[string, number]>((resolve) => {
        const key = sourceKey(source);
        const player: AudioPlayer = createAudioPlayer(source, {
          updateInterval: 100,
        });
        let settled = false;
        let subscription: ReturnType<typeof player.addListener> | undefined;

        const finish = (duration: number) => {
          if (settled) {
            return;
          }

          settled = true;
          subscription?.remove();
          player.release();
          resolve([key, duration]);
        };

        const readDuration = () => {
          const status = player.currentStatus;

          if (status.isLoaded && status.duration > 0) {
            finish(status.duration);
          } else if (status.error) {
            finish(0);
          }
        };

        subscription = player.addListener("playbackStatusUpdate", readDuration);
        cancelLoads.push(() => finish(0));
        readDuration();
      });

    Promise.all([...uniqueSources.values()].map(loadDuration)).then((entries) => {
      if (cancelled) {
        return;
      }

      const durationsBySource = new Map(entries);
      const durations = sources.map(
        (source) => durationsBySource.get(sourceKey(source)) ?? 0,
      );

      setResult({
        durations,
        isReady: durations.every((duration) => duration > 0),
      });
    });

    return () => {
      cancelled = true;
      cancelLoads.forEach((cancel) => cancel());
    };
  }, [sources]);

  return result;
}
