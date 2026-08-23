import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "expo-router/react-navigation";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Colors } from "@/constants/Colors";
import { AudioEnvironmentProvider } from "@/contexts/AudioEnvironmentContext";
import { useColorScheme } from "@/hooks/useColorScheme";

const LightNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    card: Colors.light.background,
  },
};

const DarkNavigationTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    card: Colors.dark.background,
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const backgroundColor = isDark
    ? Colors.dark.background
    : Colors.light.background;

  return (
    <ThemeProvider value={isDark ? DarkNavigationTheme : LightNavigationTheme}>
      <AudioEnvironmentProvider>
        <Stack
          screenOptions={{
            contentStyle: { backgroundColor },
            headerStyle: { backgroundColor },
          }}
        >
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false, title: "Prayers" }}
          />
          <Stack.Screen
            name="pray/index"
            options={{
              title: "Prayer",
              gestureEnabled: false,
              fullScreenGestureEnabled: false,
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AudioEnvironmentProvider>
    </ThemeProvider>
  );
}
