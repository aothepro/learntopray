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

import {
  DEFAULT_SURAH_SLOTS,
  SURAH_SELECTION_STORAGE_KEY,
  type SurahSlots,
  areBothSlotsEmpty,
  parseStoredSurahSlots,
  resolveSlotsForPlayback,
  serializeSurahSlots,
  toggleSurahAssignment,
} from "@/surahAssignment";

type SurahSelection = {
  slots: SurahSlots;
  isHydrated: boolean;
  toggleSurah: (surahKey: string) => void;
  ensurePlaybackSlots: () => SurahSlots;
};

const SurahSelectionContext = createContext<SurahSelection | null>(null);

export function SurahSelectionProvider({ children }: PropsWithChildren) {
  const [slots, setSlots] = useState<SurahSlots>([...DEFAULT_SURAH_SLOTS]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    void AsyncStorage.getItem(SURAH_SELECTION_STORAGE_KEY)
      .then((value) => {
        if (!active) {
          return;
        }

        setSlots(parseStoredSurahSlots(value));
        setIsHydrated(true);
      })
      .catch((error) => {
        console.warn("Unable to load surah assignments", error);
        if (active) {
          setIsHydrated(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const persistSlots = useCallback((nextSlots: SurahSlots) => {
    setSlots(nextSlots);
    void AsyncStorage.setItem(
      SURAH_SELECTION_STORAGE_KEY,
      serializeSurahSlots(nextSlots),
    ).catch((error) => {
      console.warn("Unable to save surah assignments", error);
    });
  }, []);

  const toggleSurah = useCallback(
    (surahKey: string) => {
      persistSlots(toggleSurahAssignment(slots, surahKey));
    },
    [persistSlots, slots],
  );

  const ensurePlaybackSlots = useCallback(() => {
    const playbackSlots = resolveSlotsForPlayback(slots);
    if (areBothSlotsEmpty(slots)) {
      persistSlots(playbackSlots);
    }
    return playbackSlots;
  }, [persistSlots, slots]);

  const value = useMemo(
    () => ({
      slots,
      isHydrated,
      toggleSurah,
      ensurePlaybackSlots,
    }),
    [ensurePlaybackSlots, isHydrated, slots, toggleSurah],
  );

  return (
    <SurahSelectionContext.Provider value={value}>
      {children}
    </SurahSelectionContext.Provider>
  );
}

export function useSurahSelection() {
  const surahSelection = useContext(SurahSelectionContext);

  if (!surahSelection) {
    throw new Error(
      "useSurahSelection must be used within a SurahSelectionProvider",
    );
  }

  return surahSelection;
}
