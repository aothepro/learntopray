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

  it("shows the posture held for each clip", () => {
    const sequence = buildPrayerSequence(PRAYERS.subuh, DEFAULT_SURAH_SLOTS, {
      prayerName: "subuh",
      reciteDuaQunut: true,
    });
    const firstRakaat = sequence.filter((step) => step.rakaat === 1);

    expect(sequence[0]).toMatchObject({
      title: "Niyat",
      posture: "standing",
      rakaat: null,
    });
    expect(firstRakaat.map((step) => [step.title, step.posture])).toEqual([
      ["Takbir", "takbir"],
      ["Iftitah", "qiyam"],
      ["Al Fatihah", "qiyam"],
      ["Al Kafirun", "qiyam"],
      ["Takbir", "takbir"],
      ["Ruku'", "ruku"],
      ["Itidal", "standing"],
      ["Takbir", "sujud"],
      ["Sujud", "sujud"],
      ["Takbir", "julus"],
      ["Julus", "julus"],
      ["Takbir", "sujud"],
      ["Sujud", "sujud"],
    ]);
    expect(sequence.find((step) => step.title === "Dua Qunut")).toMatchObject({
      posture: "qunut",
    });
    expect(sequence.at(-3)).toMatchObject({
      title: "Takbir",
      posture: "tawarruk",
    });
    expect(sequence.at(-2)).toMatchObject({
      title: "Tahiyat Akhir",
      posture: "tawarruk",
    });
    expect(sequence.at(-1)).toMatchObject({ title: "Salam", posture: "salam" });
  });

  it("uses iftirash for Tahiyat Awal and tawarruk for Tahiyat Akhir", () => {
    const sequence = buildPrayerSequence(PRAYERS.zuhr, DEFAULT_SURAH_SLOTS, {
      prayerName: "zuhr",
      reciteDuaQunut: false,
    });
    const awalIndex = sequence.findIndex(
      (step) => step.title === "Tahiyat Awal",
    );

    expect(sequence[awalIndex - 1]).toMatchObject({
      title: "Takbir",
      posture: "iftirash",
    });
    expect(sequence[awalIndex]).toMatchObject({
      title: "Tahiyat Awal",
      posture: "iftirash",
    });
    expect(sequence.filter((step) => step.posture === "tawarruk")).toEqual([
      expect.objectContaining({ title: "Takbir" }),
      expect.objectContaining({ title: "Tahiyat Akhir" }),
    ]);
  });
});
