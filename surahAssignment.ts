import { isSelectableSurahKey } from "@/surah";

export type SurahSlot = string | null;
export type SurahSlots = [SurahSlot, SurahSlot];

export const DEFAULT_SURAH_SLOTS: SurahSlots = ["alkafirun", "alikhlas"];
export const SURAH_SELECTION_STORAGE_KEY = "surah.rakaatAssignments.v1";
export const SURAH_SELECTION_STORAGE_VERSION = 1;

export function parseStoredSurahSlots(value: string | null): SurahSlots {
  if (value === null) {
    return [...DEFAULT_SURAH_SLOTS];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("version" in parsed) ||
      parsed.version !== SURAH_SELECTION_STORAGE_VERSION ||
      !("slots" in parsed) ||
      !Array.isArray(parsed.slots) ||
      parsed.slots.length !== 2
    ) {
      return [...DEFAULT_SURAH_SLOTS];
    }

    return [
      parseSlot(parsed.slots[0]),
      parseSlot(parsed.slots[1]),
    ];
  } catch {
    return [...DEFAULT_SURAH_SLOTS];
  }
}

function parseSlot(value: unknown): SurahSlot {
  if (value === null) {
    return null;
  }

  if (typeof value !== "string" || !isSelectableSurahKey(value)) {
    return null;
  }

  return value;
}

export function serializeSurahSlots(slots: SurahSlots) {
  return JSON.stringify({
    version: SURAH_SELECTION_STORAGE_VERSION,
    slots,
  });
}

export function rakaatsForSurah(slots: SurahSlots, surahKey: string) {
  const rakaats: number[] = [];
  if (slots[0] === surahKey) {
    rakaats.push(1);
  }
  if (slots[1] === surahKey) {
    rakaats.push(2);
  }
  return rakaats;
}

export function areBothSlotsFilled(slots: SurahSlots) {
  return slots[0] !== null && slots[1] !== null;
}

export function areBothSlotsEmpty(slots: SurahSlots) {
  return slots[0] === null && slots[1] === null;
}

export function resolveSlotsForPlayback(slots: SurahSlots): SurahSlots {
  if (areBothSlotsEmpty(slots)) {
    return [...DEFAULT_SURAH_SLOTS];
  }

  return slots;
}

export function toggleSurahAssignment(
  slots: SurahSlots,
  surahKey: string,
): SurahSlots {
  if (!isSelectableSurahKey(surahKey)) {
    return slots;
  }

  const [first, second] = slots;
  const bothFilled = areBothSlotsFilled(slots);
  const assignedToFirst = first === surahKey;
  const assignedToSecond = second === surahKey;

  if (bothFilled) {
    if (assignedToFirst && assignedToSecond) {
      return [first, null];
    }
    if (assignedToFirst) {
      return [null, second];
    }
    if (assignedToSecond) {
      return [first, null];
    }
    return slots;
  }

  if (first === null) {
    return [surahKey, second];
  }

  return [first, surahKey];
}
