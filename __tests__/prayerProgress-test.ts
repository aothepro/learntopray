import { rakaatMarkers, stepAtTime } from "@/prayerProgress";
import { type TPrayerStep } from "@/prayerSequence";

const niyat = {
  title: "Niyat",
  source: 0,
  rakaat: null,
} as TPrayerStep;

const rakaatStep = (rakaat: number, title: string) =>
  ({
    title,
    source: 0,
    rakaat,
  }) as TPrayerStep;

describe("rakaatMarkers", () => {
  it("places rakaat 1 after niyat, not at time zero", () => {
    const steps = [
      niyat,
      rakaatStep(1, "Takbir"),
      rakaatStep(1, "Al Fatihah"),
      rakaatStep(2, "Takbir"),
    ];
    const durations = [10, 4, 6, 5];

    expect(rakaatMarkers(steps, durations)).toEqual([
      { rakaat: 1, startTime: 10 },
      { rakaat: 2, startTime: 20 },
    ]);
  });

  it("records each rakaat once at its first step", () => {
    const steps = [
      niyat,
      rakaatStep(1, "A"),
      rakaatStep(1, "B"),
      rakaatStep(2, "C"),
      rakaatStep(2, "D"),
      rakaatStep(3, "E"),
    ];
    const durations = [3, 2, 2, 4, 1, 8];

    expect(rakaatMarkers(steps, durations).map((marker) => marker.rakaat)).toEqual(
      [1, 2, 3],
    );
  });
});

describe("stepAtTime", () => {
  const steps = [
    niyat,
    rakaatStep(1, "Takbir"),
    rakaatStep(1, "Al Fatihah"),
    rakaatStep(2, "Ruku"),
  ];
  const durations = [10, 4, 6, 5];

  it("returns niyat before the first rakaat", () => {
    expect(stepAtTime(steps, durations, 0)?.title).toBe("Niyat");
    expect(stepAtTime(steps, durations, 9.9)?.title).toBe("Niyat");
  });

  it("returns the clip covering the given time", () => {
    expect(stepAtTime(steps, durations, 10)?.title).toBe("Takbir");
    expect(stepAtTime(steps, durations, 16)?.title).toBe("Al Fatihah");
    expect(stepAtTime(steps, durations, 20)?.title).toBe("Ruku");
  });
});
