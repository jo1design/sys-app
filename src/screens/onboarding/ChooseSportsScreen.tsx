import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Button } from '../../components/Button';
import { Sport, SPORT_LABELS, SPORT_ICONS } from '../../data/mockData';

const SPORT_DESCRIPTIONS: Record<Sport, string> = {
  tennis: 'Tennis de table, simple ou double',
  padel: 'Padel en salle ou en extérieur',
  pingpong: 'Ping-pong en club ou loisir',
  squash: 'Squash en box fermé',
  badminton: 'Badminton en salle',
};

const SPORT_COLORS: Record<Sport, string> = {
  tennis: '#4CAF50',
  padel: '#C5FF00',
  pingpong: '#2196F3',
  squash: '#FF9800',
  badminton: '#9C27B0',
};

const ALL_SPORTS: Sport[] = ['tennis', 'padel', 'pingpong', 'squash', 'badminton'];

interface ChooseSportsScreenProps {
  navigation: any;
}

export function ChooseSportsScreen({ navigation }: ChooseSportsScreenProps) {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Sport[]>(['padel']);

  const toggle = (sport: Sport) => {
    setSelected(prev =>
      prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Progress */}
      <View style={styles.progress}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.dot, i <= 2 && styles.dotActive]} />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>Étape 1 sur 3</Text>
        <Text style={styles.title}>Tes sports</Text>
        <Text style={styles.subtitle}>
          Choisis les sports que tu pratiques. Tu pourras en ajouter plus tard.
        </Text>

        <View style={styles.sportsGrid}>
          {ALL_SPORTS.map(sport => {
            const isSelected = selected.includes(sport);
            const sportColor = SPORT_COLORS[sport];
            return (
              <TouchableOpacity
                key={sport}
                style={[
                  styles.sportCard,
                  isSelected && {
                    borderColor: sportColor,
                    backgroundColor: `${sportColor}15`,
                  },
                ]}
                onPress={() => toggle(sport)}
                activeOpacity={0.8}
              >
                {isSelected && (
                  <View style={[styles.checkMark, { backgroundColor: sportColor }]}>
                    <Text style={styles.checkMarkText}>✓</Text>
                  </View>
                )}
                <Text style={styles.sportIcon}>{SPORT_ICONS[sport]}</Text>
                <Text style={[styles.sportName, isSelected && { color: sportColor }]}>
                  {SPORT_LABELS[sport]}
                </Text>
                <Text style={styles.sportDesc}>{SPORT_DESCRIPTIONS[sport]}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selected.length > 0 && (
          <View style={styles.selectedRow}>
            <Text style={styles.selectedText}>
              {selected.length} sport{selected.length > 1 ? 's' : ''} sélectionné{selected.length > 1 ? 's' : ''}
            </Text>
          </View>
        )}

        <Button
          label="Continuer"
          onPress={() => navigation.navigate('FindMembers')}
          disabled={selected.length === 0}
          size="lg"
          icon="arrow-forward"
          iconPosition="right"
        />
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.navigate('FindMembers')}
        >
          <Text style={styles.skipText}>Passer cette étape</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    marginBottom: spacing.md,
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
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
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
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.base,
    marginBottom: spacing.xl,
    lineHeight: 22,
  },
  sportsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  sportCard: {
    width: '47%',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.base,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    minHeight: 110,
    justifyContent: 'flex-end',
  },
  checkMark: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMarkText: {
    color: colors.textInverse,
    fontSize: 12,
    fontWeight: typography.black,
  },
  sportIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  sportName: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
    marginBottom: 2,
  },
  sportDesc: {
    color: colors.textMuted,
    fontSize: typography.xs,
    lineHeight: 16,
  },
  selectedRow: {
    alignItems: 'center',
    marginBottom: spacing.base,
  },
  selectedText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.base,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: typography.base,
  },
});
