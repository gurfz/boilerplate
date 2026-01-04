// app/index.tsx – Unified Gurfz Cyberpunk Dashboard (RevenueCat Paywall on All Platforms)

import { StyleSheet, Text, View, TouchableOpacity, Animated, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Purchases from 'react-native-purchases';
import PurchasesUI from 'react-native-purchases-ui';
import { useEffect, useRef, useState } from 'react';

export default function Index() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkPremium = async () => {
      try {
        const info = await Purchases.getCustomerInfo();
        setIsPremium(!!info.entitlements.active['premium_access']);
      } catch (e) {
        console.log("No premium yet (normal in Expo Go/web preview):", e);
      } finally {
        setLoading(false);
      }
    };

    checkPremium();
  }, []);

  const handleSubscribe = async () => {
    try {
      const result = await PurchasesUI.presentPaywall();

      if (result?.customerInfo?.entitlements?.active['premium_access']) {
        setIsPremium(true);
      }
    } catch (e) {
      console.log("Paywall dismissed or preview mode:", e);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loading}>Initializing Gurfz...</Text>
      </SafeAreaView>
    );
  }

  if (!isPremium) {
    // Unified Paywall Screen (same look on mobile & web)
    return (
      <SafeAreaView style={styles.paywallContainer}>
        <StatusBar style="light" />
        <View style={styles.paywallContent}>
          <Text style={styles.paywallTitle}>GURFZ Premium</Text>
          <Text style={styles.paywallSubtitle}>Unlock the future of innovation</Text>

          <View style={styles.features}>
            <Text style={styles.feature}>✓ Advanced AI insights</Text>
            <Text style={styles.feature}>✓ Real-time hardware control</Text>
            <Text style={styles.feature}>✓ Unlimited projects & data</Text>
            <Text style={styles.feature}>✓ Priority support & updates</Text>
            <Text style={styles.feature}>✓ Zero ads</Text>
          </View>

          <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
            <Text style={styles.subscribeText}>Start Subscription – $9.99/month</Text>
          </TouchableOpacity>

          <Text style={styles.trial}>7-day free trial • Cancel anytime</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Premium Floating Dashboard
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <Text style={styles.dashboardTitle}>GURFZ</Text>
      <Text style={styles.dashboardSubtitle}>Premium Dashboard</Text>

      <FloatingCard title="Revenue" value="$432,502" subtitle="+23% this week" />
      <FloatingCard title="Active Projects" value="29" subtitle="Running" />
      <FloatingCard title="Hardware Connected" value="12" subtitle="Online" />
      <FloatingCard title="AI Insights" value="215" subtitle="Today" />
      <FloatingCard title="Uptime" value="99.9%" subtitle="Last 30 days" />
    </SafeAreaView>
  );
}

// Floating Card with bounce & glow on touch/hover
const FloatingCard = ({ title, value, subtitle }) => {
  const floatY = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const glow = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -20, duration: 4000, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 20, duration: 4000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const onPressIn = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1.08, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    floatY.stopAnimation();
  };

  const onPressOut = () => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
      Animated.timing(glow, { toValue: 0.3, duration: 400, useNativeDriver: true }),
    ]).start();
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPressIn={onPressIn} onPressOut={onPressOut}>
      <Animated.View
        style={[
          styles.card,
          {
            transform: [{ translateY: floatY }, { scale }],
            shadowOpacity: glow,
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
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: 60,
    gap: 40,
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
    maxWidth: 420,
  },
  paywallTitle: {
    fontSize: 52,
    fontWeight: '900',
    color: '#00FFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: '#00FFFF',
    textShadowRadius: 40,
  },
  paywallSubtitle: {
    fontSize: 22,
    color: '#AAAAAA',
    textAlign: 'center',
    marginBottom: 48,
  },
  features: {
    gap: 18,
    marginBottom: 56,
    alignItems: 'flex-start',
  },
  feature: {
    fontSize: 19,
    color: '#00FFFF',
  },
  subscribeButton: {
    backgroundColor: 'transparent',
    borderColor: '#00FFFF',
    borderWidth: 3,
    paddingVertical: 22,
    paddingHorizontal: 70,
    borderRadius: 999,
    minWidth: 340,
    shadowColor: '#00FFFF',
    shadowOpacity: 0.9,
    shadowRadius: 40,
    elevation: 25,
  },
  subscribeText: {
    color: '#00FFFF',
    fontSize: 23,
    fontWeight: '800',
    textAlign: 'center',
  },
  trial: {
    marginTop: 32,
    fontSize: 17,
    color: '#888888',
  },
  loading: {
    flex: 1,
    color: '#00FFFF',
    fontSize: 26,
    textAlign: 'center',
  },
  dashboardTitle: {
    fontSize: 72,
    fontWeight: '900',
    color: '#00FFFF',
    letterSpacing: 16,
    textShadowColor: '#00FFFF',
    textShadowRadius: 50,
  },
  dashboardSubtitle: {
    fontSize: 26,
    color: '#00CCCC',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'rgba(10, 15, 30, 0.85)',
    borderRadius: 32,
    padding: 32,
    width: 340,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FFFF22',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 50,
    elevation: 30,
  },
  cardTitle: {
    fontSize: 19,
    color: '#AAAAAA',
    marginBottom: 10,
  },
  cardValue: {
    fontSize: 44,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 17,
    color: '#00FFFF',
  },
});