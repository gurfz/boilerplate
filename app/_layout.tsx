// app/_layout.tsx – Full RevenueCat Integration (Test Key + Paywall + Entitlement Check)

import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Purchases, { LOG_LEVEL } from "react-native-purchases";
import RevenueCatUI, { PAYWALL_RESULT } from "react-native-purchases-ui";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function RootLayout() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initRevenueCat = async () => {
      try {
        // 1. Enable verbose logs
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);

        // 2. Configure with your test key (works for both platforms in test mode)
        const testApiKey = "test_TstGAwKnaOyPtOmHnjcbFuRslUZ";
        await Purchases.configure({ apiKey: testApiKey });

        console.log("RevenueCat configured with test key");

        // 3. Check current entitlement
        const customerInfo = await Purchases.getCustomerInfo();
        const hasPro = typeof customerInfo.entitlements.active["Gurfz Pro"] !== "undefined";

        if (hasPro) {
          setIsPremium(true);
        }
      } catch (error) {
        console.warn("RevenueCat setup error (normal in Expo Go):", error);
      } finally {
        setLoading(false);
      }
    };

    initRevenueCat();
  }, []);

  const presentPaywall = async (): Promise<boolean> => {
    try {
      const paywallResult: PAYWALL_RESULT = await RevenueCatUI.presentPaywall();

      switch (paywallResult) {
        case PAYWALL_RESULT.PURCHASED:
        case PAYWALL_RESULT.RESTORED:
          setIsPremium(true);
          return true;
        case PAYWALL_RESULT.NOT_PRESENTED:
        case PAYWALL_RESULT.ERROR:
        case PAYWALL_RESULT.CANCELLED:
        default:
          return false;
      }
    } catch (e) {
      console.log("Paywall dismissed or error:", e);
      return false;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Initializing Gurfz...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {!isPremium ? (
        // Paywall Screen
        <View style={styles.paywall}>
          <Text style={styles.paywallTitle}>GURFZ Pro</Text>
          <Text style={styles.paywallSubtitle}>Unlock the full experience</Text>

          <View style={styles.features}>
            <Text style={styles.feature}>✓ Advanced AI tools</Text>
            <Text style={styles.feature}>✓ Hardware integration</Text>
            <Text style={styles.feature}>✓ Unlimited projects</Text>
            <Text style={styles.feature}>✓ Priority updates</Text>
          </View>

          <Text style={styles.price}>$9.99 / month</Text>

          <Text style={styles.trial}>7-day free trial • Cancel anytime</Text>

          <Text style={styles.subscribeButton} onPress={presentPaywall}>
            Start Free Trial
          </Text>

          <Text style={styles.terms}>
            By subscribing, you agree to our Terms and Privacy Policy
          </Text>
        </View>
      ) : (
        // Premium Content (replace with your actual dashboard)
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  loadingText: {
    flex: 1,
    color: "#00FFFF",
    fontSize: 24,
    textAlign: "center",
  },
  paywall: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  paywallTitle: {
    fontSize: 56,
    fontWeight: "900",
    color: "#00FFFF",
    textAlign: "center",
    marginBottom: 16,
    textShadowColor: "#00FFFF",
    textShadowRadius: 30,
  },
  paywallSubtitle: {
    fontSize: 22,
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 40,
  },
  features: {
    marginBottom: 40,
    gap: 16,
  },
  feature: {
    fontSize: 20,
    color: "#00CCCC",
  },
  price: {
    fontSize: 36,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 8,
  },
  trial: {
    fontSize: 18,
    color: "#888888",
    marginBottom: 40,
  },
  subscribeButton: {
    backgroundColor: "transparent",
    borderColor: "#00FFFF",
    borderWidth: 3,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 999,
    color: "#00FFFF",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    minWidth: 300,
    marginBottom: 30,
    shadowColor: "#00FFFF",
    shadowOpacity: 0.8,
    shadowRadius: 30,
  },
  terms: {
    fontSize: 14,
    color: "#555555",
    textAlign: "center",
    maxWidth: 300,
  },
});