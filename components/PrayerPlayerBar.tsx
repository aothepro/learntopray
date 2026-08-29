import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useRef, useState } from "react";
import {
  GestureResponderEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { type RakaatMarker } from "@/prayerProgress";
import { useThemeColor } from "@/hooks/useThemeColor";

type PrayerPlayerBarProps = {
  elapsed: number;
  total: number;
  playing: boolean;
  canSeek: boolean;
  rakaatCount: number;
  markers: RakaatMarker[];
  chapterLabel: string;
  onSeek: (time: number) => void;
  onScrubChange?: (time: number | null) => void;
  onTogglePlayback: () => void;
};

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(Math.max(value, minimum), maximum);

const formatTime = (seconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(safeSeconds / 60);
  const remainder = safeSeconds % 60;

  return `${minutes}:${remainder.toString().padStart(2, "0")}`;
};

export function PrayerPlayerBar({
  elapsed,
  total,
  playing,
  canSeek,
  rakaatCount,
  markers,
  chapterLabel,
  onSeek,
  onScrubChange,
  onTogglePlayback,
}: PrayerPlayerBarProps) {
  const insets = useSafeAreaInsets();
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");
  const mutedColor = useThemeColor(
    { light: "#A7A7A7", dark: "#5E5E5E" },
    "icon",
  );
  const [trackWidth, setTrackWidth] = useState(0);
  const [dragTime, setDragTime] = useState<number | null>(null);
  const dragStartX = useRef(0);
  const onScrubChangeRef = useRef(onScrubChange);
  onScrubChangeRef.current = onScrubChange;
  const displayedElapsed = dragTime ?? elapsed;
  const progress = total > 0 ? clamp(displayedElapsed / total, 0, 1) : 0;

  const timeAtPosition = (position: number) => {
    if (trackWidth <= 0 || total <= 0) {
      return 0;
    }

    return (clamp(position, 0, trackWidth) / trackWidth) * total;
  };

  const updateDragTime = (time: number | null) => {
    setDragTime(time);
    onScrubChangeRef.current?.(time);
  };

  const beginDrag = (event: GestureResponderEvent) => {
    dragStartX.current = event.nativeEvent.locationX;
    updateDragTime(timeAtPosition(dragStartX.current));
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => canSeek && total > 0,
        onMoveShouldSetPanResponder: () => canSeek && total > 0,
        onStartShouldSetPanResponderCapture: () => canSeek && total > 0,
        onMoveShouldSetPanResponderCapture: () => canSeek && total > 0,
        onPanResponderTerminationRequest: () => false,
        onShouldBlockNativeResponder: () => true,
        onPanResponderGrant: beginDrag,
        onPanResponderMove: (_, gestureState) => {
          updateDragTime(timeAtPosition(dragStartX.current + gestureState.dx));
        },
        onPanResponderRelease: (_, gestureState) => {
          const seekTime = timeAtPosition(
            dragStartX.current + gestureState.dx,
          );
          updateDragTime(null);
          onSeek(seekTime);
        },
        onPanResponderTerminate: () => updateDragTime(null),
      }),
    [canSeek, total, trackWidth, onSeek],
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 16 }]}>
      <ThemedText style={styles.chapterLabel}>{chapterLabel}</ThemedText>
      <View
        style={styles.seekTouchTarget}
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        accessibilityRole="adjustable"
        accessibilityLabel={`Prayer progress, ${rakaatCount} rakaats`}
        accessibilityValue={{
          min: 0,
          max: Math.round(total),
          now: Math.round(displayedElapsed),
          text: `${chapterLabel}, ${formatTime(displayedElapsed)} of ${formatTime(total)}`,
        }}
        accessibilityActions={[
          { name: "increment", label: "Forward 10 seconds" },
          { name: "decrement", label: "Back 10 seconds" },
        ]}
        onAccessibilityAction={(event) => {
          const adjustment =
            event.nativeEvent.actionName === "increment" ? 10 : -10;
          onSeek(clamp(displayedElapsed + adjustment, 0, total));
        }}
        {...panResponder.panHandlers}
      >
        <View style={[styles.track, { backgroundColor: mutedColor }]}>
          <View
            style={[
              styles.fill,
              { width: `${progress * 100}%`, backgroundColor: textColor },
            ]}
          />
          {total > 0
            ? markers.map((marker) => (
                <View
                  key={marker.rakaat}
                  pointerEvents="none"
                  accessibilityElementsHidden
                  importantForAccessibility="no"
                  style={[
                    styles.marker,
                    {
                      left: `${(marker.startTime / total) * 100}%`,
                      backgroundColor,
                    },
                  ]}
                />
              ))
            : null}
          <View
            style={[
              styles.thumb,
              dragTime !== null && styles.draggingThumb,
              {
                left: `${progress * 100}%`,
                backgroundColor: textColor,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.timeRow}>
        <ThemedText style={styles.time}>{formatTime(displayedElapsed)}</ThemedText>
        <ThemedText style={styles.time}>
          -{formatTime(total - displayedElapsed)}
        </ThemedText>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={playing ? "Pause prayer" : "Play prayer"}
        hitSlop={12}
        onPress={onTogglePlayback}
        style={({ pressed }) => [
          styles.playButton,
          { backgroundColor: textColor },
          pressed && styles.pressed,
        ]}
      >
        <Ionicons
          name={playing ? "pause" : "play"}
          size={32}
          color={backgroundColor}
          style={!playing && styles.playIcon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 24,
    paddingTop: 8,
    alignItems: "center",
  },
  seekTouchTarget: {
    width: "100%",
    height: 44,
    justifyContent: "center",
  },
  chapterLabel: {
    alignSelf: "flex-start",
    marginBottom: 4,
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
  },
  track: {
    width: "100%",
    height: 4,
    borderRadius: 2,
    overflow: "visible",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
  marker: {
    position: "absolute",
    top: -3,
    width: 2,
    height: 10,
    marginLeft: -1,
    borderRadius: 1,
  },
  thumb: {
    position: "absolute",
    width: 12,
    height: 12,
    marginLeft: -6,
    top: -4,
    borderRadius: 6,
    zIndex: 2,
  },
  draggingThumb: {
    transform: [{ scale: 1.5 }],
  },
  timeRow: {
    width: "100%",
    marginTop: -2,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  time: {
    fontSize: 12,
    lineHeight: 16,
    opacity: 0.7,
    fontVariant: ["tabular-nums"],
  },
  playButton: {
    width: 64,
    height: 64,
    marginTop: 16,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: {
    marginLeft: 3,
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.96 }],
  },
});
