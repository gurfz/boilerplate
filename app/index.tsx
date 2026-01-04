// app/index.tsx – Gurfz Floating Cyberpunk Dashboard (Touch-Interactive Cards)

import { StyleSheet, Text, View, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

const FloatingCard = ({ title, value, subtitle, delay = 0 }) => {
  const floatY = useRef(new Animated.Value(0)).current;
  const pressScale = useRef(new Animated.Value(1)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;
  const isPressed = useRef(false);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, {
          toValue: -15,
          duration: 3000 + delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatY, {
          toValue: 15,
          duration: 3000 + delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const onPressIn = () => {
    isPressed.current = true;
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1.08, friction: 8, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    floatY.stopAnimation(); // Stop floating when touched
  };

  const onPressOut = () => {
    isPressed.current = false;
    Animated.parallel([
      Animated.spring(pressScale, { toValue: 1, friction: 8, useNativeDriver: true }),
      Animated.timing(glowOpacity, { toValue: 0.3, duration: 400, useNativeDriver: true }),
    ]).start();
    // Resume floating after release
    if (!isPressed.current) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatY, { toValue: -15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(floatY, { toValue: 15, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
    >
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

export default function Index() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      <View style={styles.container}>
        <Text style={styles.mainTitle}>GURFZ</Text>
        <Text style={styles.mainSubtitle}>Dashboard</Text>

        {/* Floating Cards – positioned freely like in the image */}
        <FloatingCard title="Revenue" value="$432,502" subtitle="+23% this week" delay={0} />
        <FloatingCard title="Tickets Sold" value="29,242" subtitle="Last month" delay={500} />
        <FloatingCard title="Active Users" value="600" subtitle="+21% this week" delay={1000} />
        <FloatingCard title="Events" value="215" subtitle="Pending" delay={1500} />
        <FloatingCard title="Growth" value="52%" subtitle="Event Held" delay={2000} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#000000' },
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    paddingTop: 60,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#00FFFF',
    letterSpacing: 8,
    marginBottom: 10,
    textShadowColor: '#00FFFF',
    textShadowRadius: 20,
  },
  mainSubtitle: {
    fontSize: 20,
    color: '#00CCCC',
    marginBottom: 40,
  },
  card: {
    backgroundColor: 'rgba(20, 25, 35, 0.7)',
    backdropFilter: 'blur(10px)',
    borderRadius: 24,
    padding: 24,
    width: 280,
    marginVertical: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00FFFF22',
    shadowColor: '#00FFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    elevation: 20,
  },
  cardTitle: {
    fontSize: 18,
    color: '#AAAAAA',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#00FFFF',
  },
});