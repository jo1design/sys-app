import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography, spacing, radius } from '../constants/theme';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  fullWidth = true,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const containerStyles = [
    styles.base,
    styles[variant],
    styles[`size_${size}`],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
  ];

  const textColor = variant === 'primary' ? colors.textInverse :
                    variant === 'secondary' ? colors.textPrimary :
                    variant === 'outline' ? colors.lime :
                    variant === 'ghost' ? colors.textSecondary :
                    colors.error;

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 22 : 18;

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={textColor} size="small" />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Ionicons name={icon} size={iconSize} color={textColor} />
          )}
          <Text style={[styles.label, styles[`label_${size}`], { color: textColor }]}>
            {label}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons name={icon} size={iconSize} color={textColor} />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  fullWidth: {
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  // Variants
  primary: {
    backgroundColor: colors.lime,
  },
  secondary: {
    backgroundColor: colors.bgSurface,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.lime,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.error,
  },
  disabled: {
    opacity: 0.4,
  },
  // Sizes
  size_sm: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    minHeight: 36,
    borderRadius: radius.md,
  },
  size_md: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
  },
  size_lg: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.base,
    minHeight: 56,
  },
  label: {
    fontWeight: typography.bold,
    letterSpacing: 0.2,
  },
  label_sm: {
    fontSize: typography.sm,
  },
  label_md: {
    fontSize: typography.base,
  },
  label_lg: {
    fontSize: typography.md,
  },
});
