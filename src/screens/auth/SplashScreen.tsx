import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing } from '../../constants/theme';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  navigation: any;
}

export function SplashScreen({ navigation }: SplashScreenProps) {
  const logoAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(taglineAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(btnAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  return (
    <LinearGradient
      colors={[colors.bgDeep, colors.black]}
      style={styles.container}
    >
      {/* Decorative circles */}
      <View style={[styles.circle, styles.circleTop]} />
      <View style={[styles.circle, styles.circleBottom]} />

      {/* Logo area */}
      <Animated.View style={[styles.logoBlock, { opacity: logoAnim, transform: [{ translateY: logoAnim.interpolate({ inputRange: [0, 1], outputRange: [30, 0] }) }] }]}>
        <View style={styles.logoIcon}>
          <Ionicons name="videocam" size={36} color={colors.textInverse} />
        </View>
        <Text style={styles.logoText}>STREAM</Text>
        <Text style={[styles.logoText, styles.logoAccent]}>YOUR SPORT</Text>
      </Animated.View>

      <Animated.View style={{ opacity: taglineAnim }}>
        <Text style={styles.tagline}>Le Strava des sports de raquette</Text>
        <View style={styles.sports}>
          {['🎾 Tennis', '🏓 Padel', '🟡 Squash', '🏸 Badminton'].map(s => (
            <Text key={s} style={styles.sportItem}>{s}</Text>
          ))}
        </View>
      </Animated.View>

      <Animated.View style={[styles.actions, { opacity: btnAnim }]}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('Register')}
          activeOpacity={0.9}
        >
          <Text style={styles.primaryBtnText}>Commencer</Text>
          <Ionicons name="arrow-forward" size={20} color={colors.textInverse} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Login')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>J'ai déjà un compte</Text>
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.legal}>
        SaaS B2B · Tennis · Padel · Ping · Squash
      </Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
    paddingHorizontal: spacing.xl,
  },
  circle: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: colors.limeDim,
  },
  circleTop: {
    top: -80,
    right: -80,
  },
  circleBottom: {
    bottom: -100,
    left: -80,
    backgroundColor: 'rgba(197,255,0,0.05)',
  },
  logoBlock: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoText: {
    color: colors.textPrimary,
    fontSize: 32,
    fontWeight: typography.black,
    letterSpacing: 4,
    lineHeight: 36,
  },
  logoAccent: {
    color: colors.lime,
  },
  tagline: {
    color: colors.textSecondary,
    fontSize: typography.md,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  sports: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  sportItem: {
    color: colors.textMuted,
    fontSize: typography.sm,
    backgroundColor: colors.bgSurface,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 100,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.lime,
    borderRadius: 16,
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  primaryBtnText: {
    color: colors.textInverse,
    fontSize: typography.md,
    fontWeight: typography.extrabold,
  },
  secondaryBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  secondaryBtnText: {
    color: colors.textSecondary,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  legal: {
    color: colors.textMuted,
    fontSize: typography.xs,
    textAlign: 'center',
  },
});
