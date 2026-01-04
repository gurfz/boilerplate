// app/_layout.tsx – RevenueCat for Native, Safe for Web/Expo Go

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import Constants from "expo-constants";
import { useEffect } from "react";

export default function RootLayout() {
  useEffect(() => {
    const initRevenueCat = async () => {
      // Skip in Expo Go or web — avoid preview mode errors
      if (Constants.appOwnership === "expo" || Platform.OS === "web") {
        console.log("Expo Go or Web — skipping native RevenueCat config");
        return;
      }

      try {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
        await Purchases.configure({ apiKey: "test_TstGAwKnaOyPtOmHnjcbFuRslUZ" }); // switch to real appl_ key later
        console.log("RevenueCat configured natively");
      } catch (e) {
        console.warn("RevenueCat config failed:", e);
      }
    };

    initRevenueCat();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: "#000000" } }} />
    </SafeAreaView>
  );
}