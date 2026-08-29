import { useCallback, useEffect, useMemo, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";

import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

import {
  DEFAULT_STEP,
  clampWheelValue,
  defaultFormatLabel,
  rangeValues,
  type NumberWheelInputProps,
} from "./types";

const ROW_HEIGHT = 44;
const VISIBLE_ROWS = 5;
const WHEEL_HEIGHT = ROW_HEIGHT * VISIBLE_ROWS;
const SIDE_PADDING = ROW_HEIGHT * Math.floor(VISIBLE_ROWS / 2);

export function NumberWheelInput({
  value,
  onChange,
  min,
  max,
  step = DEFAULT_STEP,
  formatLabel = defaultFormatLabel,
  accessibilityLabel,
  incrementAccessibilityLabel = "Increase",
  decrementAccessibilityLabel = "Decrease",
}: NumberWheelInputProps) {
  const scrollRef = useRef<ScrollView>(null);
  const lastReportedValue = useRef(value);
  const highlightColor = useThemeColor(
    { light: "#E7EEF0", dark: "#2A3234" },
    "background",
  );
  const mutedColor = useThemeColor({}, "icon");
  const options = useMemo(() => rangeValues(min, max, step), [max, min, step]);

  const offsetForValue = useCallback(
    (nextValue: number) =>
      ((clampWheelValue(nextValue, min, max, step) - min) / step) * ROW_HEIGHT,
    [max, min, step],
  );

  useEffect(() => {
    lastReportedValue.current = value;
    scrollRef.current?.scrollTo({
      y: offsetForValue(value),
      animated: false,
    });
  }, [offsetForValue, value]);

  const reportValue = useCallback(
    (nextValue: number) => {
      if (nextValue === lastReportedValue.current) {
        return;
      }

      lastReportedValue.current = nextValue;
      void Haptics.selectionAsync();
      onChange(nextValue);
    },
    [onChange],
  );

  const valueFromOffset = useCallback(
    (offset: number) => {
      const index = Math.round(offset / ROW_HEIGHT);
      return options[Math.min(Math.max(index, 0), options.length - 1)];
    },
    [options],
  );

  const handleScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      reportValue(valueFromOffset(event.nativeEvent.contentOffset.y));
    },
    [reportValue, valueFromOffset],
  );

  const accessibilityActions = useMemo(
    () => [
      { name: "increment" as const, label: incrementAccessibilityLabel },
      { name: "decrement" as const, label: decrementAccessibilityLabel },
    ],
    [decrementAccessibilityLabel, incrementAccessibilityLabel],
  );

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        min,
        max,
        now: value,
        text: formatLabel(value),
      }}
      accessibilityActions={accessibilityActions}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "increment") {
          onChange(clampWheelValue(value + step, min, max, step));
        } else if (event.nativeEvent.actionName === "decrement") {
          onChange(clampWheelValue(value - step, min, max, step));
        }
      }}
      style={styles.wheel}
    >
      <View
        pointerEvents="none"
        style={[styles.highlight, { backgroundColor: highlightColor }]}
      />
      <ScrollView
        ref={scrollRef}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={ROW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum
        onLayout={() => {
          scrollRef.current?.scrollTo({
            y: offsetForValue(value),
            animated: false,
          });
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        contentContainerStyle={styles.content}
      >
        {options.map((option) => {
          const selected = option === value;

          return (
            <View key={option} style={styles.row}>
              <ThemedText
                style={[
                  styles.label,
                  !selected && { color: mutedColor },
                  selected && styles.selectedLabel,
                ]}
              >
                {formatLabel(option)}
              </ThemedText>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: {
    height: WHEEL_HEIGHT,
    overflow: "hidden",
  },
  highlight: {
    position: "absolute",
    left: 8,
    right: 8,
    top: SIDE_PADDING,
    height: ROW_HEIGHT,
    borderRadius: 12,
  },
  content: {
    paddingVertical: SIDE_PADDING,
  },
  row: {
    height: ROW_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 18,
    lineHeight: 24,
    opacity: 0.55,
  },
  selectedLabel: {
    opacity: 1,
    fontWeight: "600",
  },
});
