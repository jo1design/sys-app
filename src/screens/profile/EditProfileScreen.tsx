import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { ME, Sport, SPORT_LABELS, SPORT_ICONS } from '../../data/mockData';

const ALL_SPORTS: Sport[] = ['tennis', 'padel', 'pingpong', 'squash', 'badminton'];

interface EditProfileScreenProps {
  navigation: any;
}

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [pseudo, setPseudo] = useState(ME.pseudo);
  const [club, setClub] = useState(ME.club ?? '');
  const [sports, setSports] = useState<Sport[]>(ME.sports);
  const [saving, setSaving] = useState(false);

  const toggleSport = (sport: Sport) => {
    setSports(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      navigation.goBack();
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Text style={styles.cancelText}>Annuler</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modifier le profil</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} hitSlop={8}>
          <Text style={[styles.saveText, saving && styles.savingText]}>
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar change */}
        <View style={styles.avatarSection}>
          <Avatar user={ME} size={90} showBorder />
          <TouchableOpacity style={styles.changePhotoBtn}>
            <View style={styles.changePhotoIcon}>
              <Ionicons name="camera" size={16} color={colors.textPrimary} />
            </View>
          </TouchableOpacity>
          <Text style={styles.changePhotoText}>Changer la photo</Text>
        </View>

        {/* Form */}
        <Input
          label="Pseudo"
          placeholder="TonPseudo"
          value={pseudo}
          onChangeText={setPseudo}
          icon="at-outline"
          hint="Visible par tous les membres de la communauté"
        />
        <Input
          label="Club"
          placeholder="Nom de ton club principal"
          value={club}
          onChangeText={setClub}
          icon="location-outline"
          autoCapitalize="words"
        />

        {/* Sports */}
        <View style={styles.sportsSection}>
          <Text style={styles.sportsLabel}>Sports pratiqués</Text>
          <View style={styles.sportsGrid}>
            {ALL_SPORTS.map(sport => {
              const isSelected = sports.includes(sport);
              return (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.sportToggle,
                    isSelected && styles.sportToggleActive,
                  ]}
                  onPress={() => toggleSport(sport)}
                >
                  <Text style={styles.sportIcon}>{SPORT_ICONS[sport]}</Text>
                  <Text style={[styles.sportName, isSelected && styles.sportNameActive]}>
                    {SPORT_LABELS[sport]}
                  </Text>
                  {isSelected && (
                    <View style={styles.sportCheck}>
                      <Ionicons name="checkmark" size={10} color={colors.textInverse} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Danger zone */}
        <View style={styles.dangerZone}>
          <Text style={styles.dangerTitle}>Zone danger</Text>
          <TouchableOpacity style={styles.dangerBtn}>
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
            <Text style={styles.dangerBtnText}>Se déconnecter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dangerBtn}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
            <Text style={styles.dangerBtnText}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  cancelText: {
    color: colors.textSecondary,
    fontSize: typography.base,
  },
  saveText: {
    color: colors.lime,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  savingText: {
    opacity: 0.5,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    position: 'relative',
  },
  changePhotoBtn: {
    position: 'absolute',
    bottom: 24,
    right: '35%',
  },
  changePhotoIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.bgDeep,
  },
  changePhotoText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginTop: spacing.sm,
  },
  sportsSection: {
    marginBottom: spacing.xl,
  },
  sportsLabel: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginBottom: spacing.md,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  sportToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgCard,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
  },
  sportToggleActive: {
    backgroundColor: colors.limeDim,
    borderColor: colors.lime,
  },
  sportIcon: {
    fontSize: 16,
  },
  sportName: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  sportNameActive: {
    color: colors.lime,
    fontWeight: typography.semibold,
  },
  sportCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerZone: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.xl,
    gap: spacing.sm,
  },
  dangerTitle: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  dangerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: `${colors.error}10`,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.error}30`,
  },
  dangerBtnText: {
    color: colors.error,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
});
