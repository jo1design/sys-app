import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { typography, spacing } from '../constants/theme';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    icon?: keyof typeof Ionicons.glyphMap;
    label?: string;
    onPress: () => void;
  };
  transparent?: boolean;
}

export function ScreenHeader({ title, subtitle, onBack, rightAction, transparent }: ScreenHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingTop: insets.top + spacing.sm },
      transparent && styles.transparent,
    ]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity style={styles.backBtn} onPress={onBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.backBtn} />
        )}
        <View style={styles.titleBlock}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
        {rightAction ? (
          <TouchableOpacity style={styles.rightBtn} onPress={rightAction.onPress} hitSlop={8}>
            {rightAction.icon ? (
              <Ionicons name={rightAction.icon} size={22} color={colors.lime} />
            ) : (
              <Text style={styles.rightLabel}>{rightAction.label}</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={styles.rightBtn} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.bgDeep,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  titleBlock: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.xs,
    marginTop: 1,
  },
  rightBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  rightLabel: {
    color: colors.lime,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});
