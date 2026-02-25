import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';

interface NotificationSettingsScreenProps {
  navigation: any;
}

type NotifType = {
  key: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  label: string;
  description: string;
  defaultEnabled: boolean;
};

const NOTIF_TYPES: NotifType[] = [
  {
    key: 'live',
    icon: 'radio',
    iconColor: colors.live,
    label: 'Match en direct',
    description: 'Quand un membre suivi commence un match',
    defaultEnabled: true,
  },
  {
    key: 'moment_fort',
    icon: 'star',
    iconColor: colors.lime,
    label: 'Moments forts',
    description: 'Quand un moment fort est marqué pendant un match',
    defaultEnabled: true,
  },
  {
    key: 'replay',
    icon: 'play-circle',
    iconColor: colors.textSecondary,
    label: 'Replay disponible',
    description: 'Quand ton match est disponible en replay',
    defaultEnabled: true,
  },
  {
    key: 'like',
    icon: 'heart',
    iconColor: '#FF375F',
    label: 'Likes',
    description: 'Quand quelqu\'un like ton post ou match',
    defaultEnabled: true,
  },
  {
    key: 'comment',
    icon: 'chatbubble',
    iconColor: '#64D2FF',
    label: 'Commentaires',
    description: 'Quand quelqu\'un commente ton post',
    defaultEnabled: true,
  },
  {
    key: 'follower',
    icon: 'person-add',
    iconColor: '#5E5CE6',
    label: 'Nouveaux followers',
    description: 'Quand quelqu\'un commence à te suivre',
    defaultEnabled: false,
  },
];

export function NotificationSettingsScreen({ navigation }: NotificationSettingsScreenProps) {
  const insets = useSafeAreaInsets();
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(NOTIF_TYPES.map(n => [n.key, n.defaultEnabled]))
  );
  const [globalEnabled, setGlobalEnabled] = useState(true);

  const toggle = (key: string) => {
    setEnabled(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Global toggle */}
        <View style={styles.globalCard}>
          <View style={styles.globalLeft}>
            <View style={styles.globalIcon}>
              <Ionicons name="notifications" size={22} color={globalEnabled ? colors.lime : colors.textMuted} />
            </View>
            <View>
              <Text style={styles.globalLabel}>Toutes les notifications</Text>
              <Text style={styles.globalSub}>
                {globalEnabled ? 'Activées' : 'Désactivées'}
              </Text>
            </View>
          </View>
          <Switch
            value={globalEnabled}
            onValueChange={setGlobalEnabled}
            trackColor={{ false: colors.bgSurface, true: colors.lime }}
            thumbColor={globalEnabled ? colors.textInverse : colors.textMuted}
          />
        </View>

        <Text style={styles.sectionTitle}>Par type de notification</Text>

        <View style={styles.notifList}>
          {NOTIF_TYPES.map((notif, index) => {
            const isEnabled = globalEnabled && enabled[notif.key];
            const isLast = index === NOTIF_TYPES.length - 1;
            return (
              <View key={notif.key} style={[styles.notifRow, isLast && styles.notifRowLast]}>
                <View style={[styles.notifIcon, { backgroundColor: `${notif.iconColor}20` }]}>
                  <Ionicons name={notif.icon} size={18} color={notif.iconColor} />
                </View>
                <View style={styles.notifText}>
                  <Text style={[styles.notifLabel, !isEnabled && styles.notifLabelDisabled]}>
                    {notif.label}
                  </Text>
                  <Text style={styles.notifDesc}>{notif.description}</Text>
                </View>
                <Switch
                  value={isEnabled}
                  onValueChange={() => toggle(notif.key)}
                  disabled={!globalEnabled}
                  trackColor={{ false: colors.bgSurface, true: colors.lime }}
                  thumbColor={isEnabled ? colors.textInverse : colors.textMuted}
                />
              </View>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.infoText}>
            Les notifications sont envoyées via Firebase Cloud Messaging (Android) et APNs (iOS).
            Tu peux aussi gérer les permissions dans les paramètres de ton téléphone.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  scroll: {
    paddingTop: spacing.base,
    paddingHorizontal: spacing.base,
  },
  globalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  globalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  globalIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.limeDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  globalLabel: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  globalSub: {
    color: colors.textMuted,
    fontSize: typography.xs,
    marginTop: 2,
  },
  sectionTitle: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  notifList: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  notifRowLast: {
    borderBottomWidth: 0,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifText: {
    flex: 1,
    gap: 2,
  },
  notifLabel: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  notifLabelDisabled: {
    color: colors.textMuted,
  },
  notifDesc: {
    color: colors.textMuted,
    fontSize: typography.xs,
    lineHeight: 16,
  },
  infoBox: {
    flexDirection: 'row',
    gap: spacing.sm,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.xs,
    lineHeight: 16,
  },
});
