import { buildPrayerSequence } from "@/prayerSequence";
import { PRAYERS } from "@/prayers";
import { DEFAULT_SURAH_SLOTS } from "@/surahAssignment";

describe("Dua Qunut prayer sequence", () => {
  it("plays once after Itidal in Subuh rakaat 2 when enabled", () => {
    const sequence = buildPrayerSequence(PRAYERS.subuh, DEFAULT_SURAH_SLOTS, {
      prayerName: "subuh",
      reciteDuaQunut: true,
    });
    const secondRakaatTitles = sequence
      .filter((step) => step.rakaat === 2)
      .map((step) => step.title);
    const itidalIndex = secondRakaatTitles.indexOf("Itidal");

    expect(
      secondRakaatTitles.filter((title) => title === "Dua Qunut"),
    ).toHaveLength(1);
    expect(secondRakaatTitles.slice(itidalIndex, itidalIndex + 3)).toEqual([
      "Itidal",
      "Dua Qunut",
      "Takbir",
    ]);
  });

  it("omits Dua Qunut from Subuh when disabled", () => {
    const sequence = buildPrayerSequence(PRAYERS.subuh, DEFAULT_SURAH_SLOTS, {
      prayerName: "subuh",
      reciteDuaQunut: false,
    });

    expect(sequence.some((step) => step.title === "Dua Qunut")).toBe(false);
  });

  it("omits Dua Qunut from other prayers when enabled", () => {
    const sequence = buildPrayerSequence(PRAYERS.zuhr, DEFAULT_SURAH_SLOTS, {
      prayerName: "zuhr",
      reciteDuaQunut: true,
    });

    expect(sequence.some((step) => step.title === "Dua Qunut")).toBe(false);
  });
});
