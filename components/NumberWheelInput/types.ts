export type NumberWheelInputProps = {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatLabel?: (value: number) => string;
  accessibilityLabel: string;
  incrementAccessibilityLabel?: string;
  decrementAccessibilityLabel?: string;
};

export const DEFAULT_STEP = 1;

export function rangeValues(
  min: number,
  max: number,
  step = DEFAULT_STEP,
): number[] {
  const count = Math.floor((max - min) / step) + 1;
  return Array.from({ length: Math.max(count, 0) }, (_, index) => min + index * step);
}

export function clampWheelValue(
  value: number,
  min: number,
  max: number,
  step = DEFAULT_STEP,
): number {
  if (!Number.isFinite(value)) {
    return min;
  }

  const snapped = Math.round((value - min) / step) * step + min;
  return Math.min(max, Math.max(min, snapped));
}

export function defaultFormatLabel(value: number) {
  return String(value);
}
