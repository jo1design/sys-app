import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

interface LoginScreenProps {
  navigation: any;
}

export function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('MainApp');
    }, 1200);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingTop: insets.top + spacing.base }]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoMini}>
            <Ionicons name="videocam" size={22} color={colors.textInverse} />
          </View>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>Content de te revoir 👋</Text>
        </View>

        {/* SSO */}
        <View style={styles.ssoContainer}>
          <SSOButton
            icon="logo-google"
            label="Continuer avec Google"
            onPress={handleLogin}
          />
          <SSOButton
            icon="logo-apple"
            label="Continuer avec Apple"
            onPress={handleLogin}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou par email</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Form */}
        <Input
          label="Email"
          placeholder="ton@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon="mail-outline"
        />
        <Input
          label="Mot de passe"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock-closed-outline"
        />

        <TouchableOpacity style={styles.forgotBtn}>
          <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        <Button
          label="Se connecter"
          onPress={handleLogin}
          loading={loading}
          size="lg"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Pas encore de compte ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.footerLink}> Créer un compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SSOButton({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.ssoBtn} onPress={onPress} activeOpacity={0.8}>
      <Ionicons name={icon} size={20} color={colors.textPrimary} />
      <Text style={styles.ssoBtnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logoMini: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.base,
  },
  ssoContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  ssoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.lg,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
  },
  ssoBtnText: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  forgotText: {
    color: colors.lime,
    fontSize: typography.sm,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    color: colors.textSecondary,
    fontSize: typography.base,
  },
  footerLink: {
    color: colors.lime,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
});
