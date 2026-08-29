import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const START_DELAY_STORAGE_KEY = "playback.startDelaySeconds";
export const MIN_START_DELAY_SECONDS = 0;
export const MAX_START_DELAY_SECONDS = 10;

type PlaybackSettings = {
  startDelaySeconds: number;
  setStartDelaySeconds: (seconds: number) => void;
};

const PlaybackSettingsContext = createContext<PlaybackSettings | null>(null);

export function clampStartDelaySeconds(seconds: number) {
  if (!Number.isFinite(seconds)) {
    return MIN_START_DELAY_SECONDS;
  }

  return Math.min(
    MAX_START_DELAY_SECONDS,
    Math.max(MIN_START_DELAY_SECONDS, Math.round(seconds)),
  );
}

function parseStoredDelay(value: string | null) {
  if (value === null) {
    return MIN_START_DELAY_SECONDS;
  }

  return clampStartDelaySeconds(Number(value));
}

export function PlaybackSettingsProvider({ children }: PropsWithChildren) {
  const [startDelaySeconds, setStartDelaySecondsState] = useState(
    MIN_START_DELAY_SECONDS,
  );

  useEffect(() => {
    let active = true;

    void AsyncStorage.getItem(START_DELAY_STORAGE_KEY)
      .then((value) => {
        if (active) {
          setStartDelaySecondsState(parseStoredDelay(value));
        }
      })
      .catch((error) => {
        console.warn("Unable to load start delay", error);
      });

    return () => {
      active = false;
    };
  }, []);

  const setStartDelaySeconds = useCallback((seconds: number) => {
    const nextDelay = clampStartDelaySeconds(seconds);
    setStartDelaySecondsState(nextDelay);
    void AsyncStorage.setItem(
      START_DELAY_STORAGE_KEY,
      String(nextDelay),
    ).catch((error) => {
      console.warn("Unable to save start delay", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      startDelaySeconds,
      setStartDelaySeconds,
    }),
    [setStartDelaySeconds, startDelaySeconds],
  );

  return (
    <PlaybackSettingsContext.Provider value={value}>
      {children}
    </PlaybackSettingsContext.Provider>
  );
}

export function usePlaybackSettings() {
  const playbackSettings = useContext(PlaybackSettingsContext);

  if (!playbackSettings) {
    throw new Error(
      "usePlaybackSettings must be used within a PlaybackSettingsProvider",
    );
  }

  return playbackSettings;
}
