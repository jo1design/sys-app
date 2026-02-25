import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/colors';
import { typography, spacing, radius } from '../constants/theme';
import { Sport, SPORT_LABELS, SPORT_ICONS } from '../data/mockData';

interface SportTagProps {
  sport: Sport;
  size?: 'sm' | 'md';
}

const SPORT_COLORS: Record<Sport, string> = {
  tennis: colors.sports.tennis,
  padel: colors.sports.padel,
  pingpong: colors.sports.pingpong,
  squash: colors.sports.squash,
  badminton: colors.sports.badminton,
};

export function SportTag({ sport, size = 'md' }: SportTagProps) {
  const sportColor = SPORT_COLORS[sport];
  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${sportColor}20`,
          borderColor: `${sportColor}40`,
          paddingHorizontal: isSmall ? spacing.xs : spacing.sm,
          paddingVertical: isSmall ? 2 : 4,
        },
      ]}
    >
      <Text style={[styles.label, { color: sportColor, fontSize: isSmall ? typography.xs : typography.sm }]}>
        {SPORT_ICONS[sport]} {SPORT_LABELS[sport]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.full,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    fontWeight: typography.semibold,
    letterSpacing: 0.2,
  },
});
