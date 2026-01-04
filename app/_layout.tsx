// app/_layout.tsx – Cyberpunk Immersive Root Layout (No White Bars, Full Dark)

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" backgroundColor="#000000" translucent={false} />
      <Stack
        screenOptions={{
          headerShown: false, // No header bars on any screen
          contentStyle: { backgroundColor: "#000000" }, // Force black on all screens
        }}
      />
    </SafeAreaView>
  );
}