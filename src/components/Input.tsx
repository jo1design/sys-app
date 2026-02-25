import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography, spacing, radius } from '../constants/theme';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'words' | 'sentences';
  icon?: keyof typeof Ionicons.glyphMap;
  error?: string;
  hint?: string;
  autoFocus?: boolean;
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'none',
  icon,
  error,
  hint,
  autoFocus,
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[
        styles.container,
        focused && styles.focused,
        !!error && styles.errored,
      ]}>
        {icon && <Ionicons name={icon} size={18} color={focused ? colors.lime : colors.textMuted} style={styles.icon} />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={colors.lime}
        />
        {secureTextEntry && (
          <TouchableOpacity onPress={() => setShowPassword(p => !p)} hitSlop={8}>
            <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.error}>{error}</Text>}
      {hint && !error && <Text style={styles.hint}>{hint}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.base,
  },
  label: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.medium,
    marginBottom: spacing.xs,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 52,
    gap: spacing.sm,
  },
  focused: {
    borderColor: colors.lime,
  },
  errored: {
    borderColor: colors.error,
  },
  icon: {
    width: 20,
  },
  input: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.base,
    height: '100%',
  },
  error: {
    color: colors.error,
    fontSize: typography.xs,
    marginTop: 4,
  },
  hint: {
    color: colors.textMuted,
    fontSize: typography.xs,
    marginTop: 4,
  },
});
