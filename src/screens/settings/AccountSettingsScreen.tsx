import React from 'react';
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
import { Avatar } from '../../components/Avatar';
import { ME } from '../../data/mockData';

interface AccountSettingsScreenProps {
  navigation: any;
}

export function AccountSettingsScreen({ navigation }: AccountSettingsScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Account section */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Avatar user={ME} size={52} showBorder />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{ME.pseudo}</Text>
            <Text style={styles.profileSub}>{ME.club}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        {/* Settings groups */}
        <SettingsGroup title="Compte">
          <SettingsRow
            icon="person-outline"
            label="Modifier le profil"
            onPress={() => navigation.navigate('EditProfile')}
          />
          <SettingsRow
            icon="at-outline"
            label="Changer le pseudo"
            onPress={() => {}}
          />
          <SettingsRow
            icon="mail-outline"
            label="Email"
            value="alex@email.com"
            onPress={() => {}}
          />
          <SettingsRow
            icon="lock-closed-outline"
            label="Changer le mot de passe"
            onPress={() => {}}
          />
        </SettingsGroup>

        <SettingsGroup title="Notifications">
          <SettingsRow
            icon="notifications-outline"
            label="Paramètres des notifications"
            onPress={() => navigation.navigate('NotifSettings')}
          />
        </SettingsGroup>

        <SettingsGroup title="Confidentialité">
          <SettingsRowToggle
            icon="eye-outline"
            label="Profil public"
            sublabel="Tout le monde peut voir ton profil"
            value={true}
            onChange={() => {}}
          />
        </SettingsGroup>

        <SettingsGroup title="À propos">
          <SettingsRow
            icon="document-text-outline"
            label="Conditions d'utilisation"
            onPress={() => {}}
          />
          <SettingsRow
            icon="shield-outline"
            label="Politique de confidentialité"
            onPress={() => {}}
          />
          <SettingsRow
            icon="information-circle-outline"
            label="Version"
            value="1.0.0 (V1)"
            onPress={() => {}}
          />
        </SettingsGroup>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.navigate('Splash')}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Stream Your Sport · V1 · Barcelone 2026</Text>
      </ScrollView>
    </View>
  );
}

function SettingsGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      <View style={styles.groupCard}>
        {children}
      </View>
    </View>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
      <View style={styles.rowRight}>
        {value && <Text style={styles.rowValue}>{value}</Text>}
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );
}

function SettingsRowToggle({
  icon,
  label,
  sublabel,
  value,
  onChange,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sublabel?: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <Ionicons name={icon} size={18} color={colors.textSecondary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.rowLabel}>{label}</Text>
        {sublabel && <Text style={styles.rowSublabel}>{sublabel}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.bgSurface, true: colors.lime }}
        thumbColor={value ? colors.textInverse : colors.textMuted}
      />
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
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.base,
    marginBottom: spacing.base,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  profileSub: {
    color: colors.textMuted,
    fontSize: typography.sm,
    marginTop: 2,
  },
  group: {
    marginBottom: spacing.base,
    paddingHorizontal: spacing.base,
  },
  groupTitle: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
    paddingLeft: spacing.xs,
  },
  groupCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: {
    flex: 1,
  },
  rowLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.base,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
  rowSublabel: {
    color: colors.textMuted,
    fontSize: typography.xs,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginHorizontal: spacing.base,
    marginTop: spacing.sm,
    marginBottom: spacing.base,
    backgroundColor: `${colors.error}10`,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  logoutText: {
    color: colors.error,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  version: {
    color: colors.textMuted,
    fontSize: typography.xs,
    textAlign: 'center',
    paddingBottom: spacing.xl,
  },
});
