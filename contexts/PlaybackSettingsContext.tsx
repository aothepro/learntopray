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
const RECITE_DUA_QUNUT_STORAGE_KEY = "playback.reciteDuaQunut.v1";
export const MIN_START_DELAY_SECONDS = 0;
export const MAX_START_DELAY_SECONDS = 10;

type PlaybackSettings = {
  startDelaySeconds: number;
  setStartDelaySeconds: (seconds: number) => void;
  reciteDuaQunut: boolean;
  setReciteDuaQunut: (enabled: boolean) => void;
  isHydrated: boolean;
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

export function parseStoredReciteDuaQunut(value: string | null) {
  if (value === "false") {
    return false;
  }

  return true;
}

export function PlaybackSettingsProvider({ children }: PropsWithChildren) {
  const [startDelaySeconds, setStartDelaySecondsState] = useState(
    MIN_START_DELAY_SECONDS,
  );
  const [reciteDuaQunut, setReciteDuaQunutState] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    void Promise.all([
      AsyncStorage.getItem(START_DELAY_STORAGE_KEY),
      AsyncStorage.getItem(RECITE_DUA_QUNUT_STORAGE_KEY),
    ])
      .then(([storedDelay, storedReciteDuaQunut]) => {
        if (active) {
          setStartDelaySecondsState(parseStoredDelay(storedDelay));
          setReciteDuaQunutState(
            parseStoredReciteDuaQunut(storedReciteDuaQunut),
          );
          setIsHydrated(true);
        }
      })
      .catch((error) => {
        console.warn("Unable to load playback settings", error);
        if (active) {
          setIsHydrated(true);
        }
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

  const setReciteDuaQunut = useCallback((enabled: boolean) => {
    setReciteDuaQunutState(enabled);
    void AsyncStorage.setItem(
      RECITE_DUA_QUNUT_STORAGE_KEY,
      String(enabled),
    ).catch((error) => {
      console.warn("Unable to save Dua Qunut setting", error);
    });
  }, []);

  const value = useMemo(
    () => ({
      startDelaySeconds,
      setStartDelaySeconds,
      reciteDuaQunut,
      setReciteDuaQunut,
      isHydrated,
    }),
    [
      isHydrated,
      reciteDuaQunut,
      setReciteDuaQunut,
      setStartDelaySeconds,
      startDelaySeconds,
    ],
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
