import { useCallback, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";

import { useThemeColor } from "@/hooks/useThemeColor";

import {
  DEFAULT_STEP,
  clampWheelValue,
  defaultFormatLabel,
  rangeValues,
  type NumberWheelInputProps,
} from "./types";

export function NumberWheelInput({
  value,
  onChange,
  min,
  max,
  step = DEFAULT_STEP,
  formatLabel = defaultFormatLabel,
  accessibilityLabel,
}: NumberWheelInputProps) {
  const textColor = useThemeColor({}, "text");
  const options = useMemo(() => rangeValues(min, max, step), [max, min, step]);

  const handleChange = useCallback(
    (selectedValue: number | string) => {
      const nextValue = clampWheelValue(Number(selectedValue), min, max, step);
      if (nextValue === value) {
        return;
      }

      void Haptics.selectionAsync();
      onChange(nextValue);
    },
    [max, min, onChange, step, value],
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
      style={styles.wheel}
    >
      <Picker
        selectedValue={value}
        onValueChange={handleChange}
        itemStyle={[styles.item, { color: textColor }]}
      >
        {options.map((option) => (
          <Picker.Item
            key={option}
            label={formatLabel(option)}
            value={option}
            color={textColor}
          />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  wheel: {
    height: 216,
    justifyContent: "center",
  },
  item: {
    fontSize: 20,
    height: 216,
  },
});
