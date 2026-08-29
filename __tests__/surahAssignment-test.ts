import {
  DEFAULT_SURAH_SLOTS,
  parseStoredSurahSlots,
  resolveSlotsForPlayback,
  serializeSurahSlots,
  toggleSurahAssignment,
  type SurahSlots,
} from "@/surahAssignment";

describe("toggleSurahAssignment", () => {
  const empty: SurahSlots = [null, null];

  it("fills the lowest empty rakaat first", () => {
    const afterFirst = toggleSurahAssignment(empty, "alkafirun");
    expect(afterFirst).toEqual(["alkafirun", null]);

    const afterSecond = toggleSurahAssignment(afterFirst, "alikhlas");
    expect(afterSecond).toEqual(["alkafirun", "alikhlas"]);
  });

  it("assigns the same surah to the empty slot", () => {
    expect(toggleSurahAssignment(["alkafirun", null], "alkafirun")).toEqual([
      "alkafirun",
      "alkafirun",
    ]);
  });

  it("does not replace a full pair with an unassigned surah", () => {
    expect(
      toggleSurahAssignment(["alikhlas", "alikhlas"], "alkafirun"),
    ).toEqual(["alikhlas", "alikhlas"]);
  });

  it("unassigns the matching rakaat when both slots are filled", () => {
    const full: SurahSlots = ["alkafirun", "alikhlas"];
    expect(toggleSurahAssignment(full, "alkafirun")).toEqual([null, "alikhlas"]);
    expect(toggleSurahAssignment(full, "alikhlas")).toEqual(["alkafirun", null]);
  });

  it("removes rakaat 2 first when both slots use the same surah", () => {
    expect(
      toggleSurahAssignment(["alikhlas", "alikhlas"], "alikhlas"),
    ).toEqual(["alikhlas", null]);
  });

  it("ignores unknown surah keys", () => {
    const slots: SurahSlots = ["alkafirun", null];
    expect(toggleSurahAssignment(slots, "alfatihah")).toEqual(slots);
    expect(toggleSurahAssignment(slots, "unknown")).toEqual(slots);
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
