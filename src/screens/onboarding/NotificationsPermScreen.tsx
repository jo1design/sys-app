import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Button } from '../../components/Button';

interface NotificationsPermScreenProps {
  navigation: any;
}

const NOTIF_EXAMPLES = [
  {
    icon: 'radio' as const,
    color: colors.live,
    title: 'Match en direct',
    message: 'SofiaM vient de commencer un match au Club du Lac',
  },
  {
    icon: 'star' as const,
    color: colors.lime,
    title: 'Moment fort',
    message: 'MaxBouleau a marqué un point de ouf !',
  },
  {
    icon: 'heart' as const,
    color: '#FF375F',
    title: 'Like',
    message: 'RaphaelDupont a aimé votre match',
  },
  {
    icon: 'play-circle' as const,
    color: colors.textSecondary,
    title: 'Replay dispo',
    message: 'Votre match du 25 février est disponible en replay',
  },
];

export function NotificationsPermScreen({ navigation }: NotificationsPermScreenProps) {
  const insets = useSafeAreaInsets();

  const handleEnable = () => {
    // In a real app: await Notifications.requestPermissionsAsync()
    navigation.navigate('MainApp');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + spacing.xl }]}>
      {/* Progress */}
      <View style={styles.progress}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.dot, styles.dotActive]} />
        ))}
      </View>

      <View style={styles.content}>
        {/* Icon */}
        <LinearGradient
          colors={[colors.limeDim, 'transparent']}
          style={styles.iconBg}
        >
          <Ionicons name="notifications" size={52} color={colors.lime} />
        </LinearGradient>

        <Text style={styles.step}>Étape 3 sur 3</Text>
        <Text style={styles.title}>Ne rate rien !</Text>
        <Text style={styles.subtitle}>
          Active les notifications pour suivre les matchs en direct, les moments forts et l'activité de ta communauté.
        </Text>

        {/* Examples */}
        <View style={styles.examples}>
          {NOTIF_EXAMPLES.map((ex, index) => (
            <View key={index} style={styles.exampleRow}>
              <View style={[styles.exampleIcon, { backgroundColor: `${ex.color}20` }]}>
                <Ionicons name={ex.icon} size={16} color={ex.color} />
              </View>
              <View style={styles.exampleText}>
                <Text style={styles.exampleTitle}>{ex.title}</Text>
                <Text style={styles.exampleMessage}>{ex.message}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          label="Activer les notifications"
          onPress={handleEnable}
          size="lg"
          icon="notifications"
        />
        <TouchableOpacity style={styles.skipBtn} onPress={() => navigation.navigate('MainApp')}>
          <Text style={styles.skipText}>Plus tard</Text>
        </TouchableOpacity>
        <Text style={styles.legal}>
          Tu pourras modifier tes préférences dans les paramètres à tout moment.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
    paddingHorizontal: spacing.xl,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    paddingTop: spacing.md,
    marginBottom: spacing.xl,
  },
  dot: {
    height: 4,
    flex: 1,
    borderRadius: 2,
    backgroundColor: colors.bgSurface,
  },
  dotActive: {
    backgroundColor: colors.lime,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: spacing.xl,
  },
  iconBg: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  step: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.base,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  examples: {
    width: '100%',
    gap: spacing.sm,
  },
  exampleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exampleIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exampleText: {
    flex: 1,
  },
  exampleTitle: {
    color: colors.textSecondary,
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  exampleMessage: {
    color: colors.textPrimary,
    fontSize: typography.sm,
  },
  actions: {
    gap: spacing.sm,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.textSecondary,
    fontSize: typography.base,
  },
  legal: {
    color: colors.textMuted,
    fontSize: typography.xs,
    textAlign: 'center',
    lineHeight: 16,
  },
});
