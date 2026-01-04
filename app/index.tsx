// app/index.tsx – Gurfz Premium Dashboard with RevenueCat Paywall

import { StyleSheet, Text, View, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Purchases from 'react-native-purchases';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import PurchasesUI from 'react-native-purchases-ui';

export default function Index() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const customerInfo = await Purchases.getCustomerInfo();
        const premiumActive = customerInfo.entitlements.active['premium_access'] !== undefined;
        setIsPremium(premiumActive);
      } catch (e) {
        console.log("Subscription check failed (normal in Expo Go):", e);
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  const showPaywall = async () => {
    try {
      const result = await PurchasesUI.presentPaywall();
      if (result.customerInfo.entitlements.active['premium_access']) {
        setIsPremium(true);
      }
    } catch (e) {
      console.log("Paywall cancelled or error:", e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Loading Gurfz...</Text>
      </SafeAreaView>
    );
  }

  if (!isPremium) {
    // Premium Paywall Screen
    return (
      <SafeAreaView style={styles.paywallContainer}>
        <StatusBar style="light" />

        <View style={styles.paywallContent}>
          <Text style={styles.paywallTitle}>Unlock Gurfz Premium</Text>

          <Text style={styles.paywallSubtitle}>
            Full access to advanced tools and hardware integration
          </Text>

          <View style={styles.features}>
            <Text style={styles.feature}>✓ All AI-powered features</Text>
            <Text style={styles.feature}>✓ Real-time hardware sync</Text>
            <Text style={styles.feature}>✓ Unlimited projects</Text>
            <Text style={styles.feature}>✓ Priority support</Text>
            <Text style={styles.feature}>✓ Ad-free experience</Text>
          </View>

          <TouchableOpacity style={styles.subscribeButton} onPress={showPaywall}>
            <Text style={styles.subscribeText}>Subscribe Now – $9.99/month</Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            Cancel anytime • 7-day free trial
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Premium Dashboard (Your Floating Cards)
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.dashboardTitle}>GURFZ</Text>
      <Text style={styles.dashboardSubtitle}>Premium Dashboard</Text>

      <FloatingCard title="Revenue" value="$432,502" subtitle="+23% this week" />
      <FloatingCard title="Active Projects" value="29" subtitle="Running" />
      <FloatingCard title="Hardware Connected" value="12" subtitle="Online" />
      <FloatingCard title="AI Insights" value="215" subtitle="Generated today" />
      <FloatingCard title="Uptime" value="99.9%" subtitle="Last 30 days" />
    </SafeAreaView>
  );
}

// Reusable Floating Card Component (same as before)
const FloatingCard = ({ title, value, subtitle }) => {
  const floatY = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -15, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 15, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1.1, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    floatY.stopAnimation();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateY: floatY }, { scale: pressScale }],
            shadowOpacity: glowOpacity,
          },
        ]}
      >
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardValue}>{value}</Text>
        <Text style={styles.cardSubtitle}>{subtitle}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: 60,
    gap: 40,
  },
  dashboardTitle: {
    fontSize: 64,
    fontWeight: '900',
    color: '#00FFFF',
    letterSpacing: 12,
    textShadowColor: '#00FFFF',
    textShadowRadius: 30,
  },
  dashboardSubtitle: {
    fontSize: 24,
    color: '#00CCCC',
    marginBottom: 20,
  },
  loading: {
    flex: 1,
    color: '#00FFFF',
    fontSize: 24,
    textAlign: 'center',
  },
  paywallContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  paywallContent: {
    alignItems: 'center',
    maxWidth: 400,
  },
  paywallTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00FFFF',
    textShadowRadius: 30,
  },
  paywallSubtitle: {
    fontSize: 20,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 40,
  },
  features: {
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 50,
  },
  feature: {
    fontSize: 18,
    color: '#00FFFF',
  },
  subscribeButton: {
    backgroundColor: 'transparent',
    borderColor: '#00FFFF',
    borderWidth: 3,
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 999,
    minWidth: 300,
    shadowColor: '#00FFFF',
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
  },
  subscribeText: {
    color: '#00FFFF',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
  },
  terms: {
    marginTop: 30,
    fontSize: 14,
    color: '#666666',
  },
  card: {
    backgroundColor: 'rgba(15, 20, 35, 0.8)',
    borderRadius: 28,
    padding: 28,
    width: 320,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FFFF33',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 40,
    elevation: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#00FFFF',
  },
});