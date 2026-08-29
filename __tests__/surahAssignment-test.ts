import {
  DEFAULT_SURAH_SLOTS,
  assignSurahToSlot,
  parseStoredSurahSlots,
  resolveSlotsForPlayback,
  serializeSurahSlots,
  type SurahSlots,
} from "@/surahAssignment";

describe("assignSurahToSlot", () => {
  const empty: SurahSlots = [null, null];

  it("assigns a surah to the chosen rakaat", () => {
    const afterFirst = assignSurahToSlot(empty, 0, "alkafirun");
    expect(afterFirst).toEqual(["alkafirun", null]);

    const afterSecond = assignSurahToSlot(afterFirst, 1, "alikhlas");
    expect(afterSecond).toEqual(["alkafirun", "alikhlas"]);
  });

  it("replaces the chosen rakaat without changing the other", () => {
    expect(
      assignSurahToSlot(["alkafirun", "alikhlas"], 0, "alikhlas"),
    ).toEqual(["alikhlas", "alikhlas"]);
  });

  it("allows the same surah on both rakaats", () => {
    expect(assignSurahToSlot(["alkafirun", null], 1, "alkafirun")).toEqual([
      "alkafirun",
      "alkafirun",
    ]);
  });

  it("ignores unknown surah keys", () => {
    const slots: SurahSlots = ["alkafirun", null];
    expect(assignSurahToSlot(slots, 1, "alfatihah")).toEqual(slots);
    expect(assignSurahToSlot(slots, 0, "unknown")).toEqual(slots);
  });
});

describe("parseStoredSurahSlots", () => {
  it("uses defaults when storage is empty", () => {
    expect(parseStoredSurahSlots(null)).toEqual(DEFAULT_SURAH_SLOTS);
  });

  it("keeps explicit empty assignments", () => {
    expect(
      parseStoredSurahSlots(serializeSurahSlots([null, null])),
    ).toEqual([null, null]);
  });

  it("falls back from malformed or unknown keys", () => {
    expect(parseStoredSurahSlots("{")).toEqual(DEFAULT_SURAH_SLOTS);
    expect(parseStoredSurahSlots(JSON.stringify({ version: 2, slots: [] }))).toEqual(
      DEFAULT_SURAH_SLOTS,
    );
    expect(
      parseStoredSurahSlots(
        serializeSurahSlots(["not-a-surah", "alikhlas"]),
      ),
    ).toEqual([null, "alikhlas"]);
  });
});

describe("resolveSlotsForPlayback", () => {
  it("restores Al Kafirun then Al Ikhlas when both slots are empty", () => {
    expect(resolveSlotsForPlayback([null, null])).toEqual(DEFAULT_SURAH_SLOTS);
  });

  it("leaves a single assignment unchanged", () => {
    expect(resolveSlotsForPlayback(["alikhlas", null])).toEqual([
      "alikhlas",
      null,
    ]);
  });
});
