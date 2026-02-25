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

interface RegisterScreenProps {
  navigation: any;
}

export function RegisterScreen({ navigation }: RegisterScreenProps) {
  const insets = useSafeAreaInsets();
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pseudoError, setPseudoError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleContinue = () => {
    if (!pseudo.trim()) {
      setPseudoError('Choisir un pseudo est obligatoire');
      return;
    }
    if (pseudo.length < 3) {
      setPseudoError('Pseudo trop court (min. 3 caractères)');
      return;
    }
    setPseudoError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigation.navigate('ChooseSports');
    }, 800);
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

        {/* Progress dots */}
        <View style={styles.progress}>
          {[1, 2, 3, 4].map(i => (
            <View
              key={i}
              style={[styles.dot, i <= 1 && styles.dotActive, i === 1 && styles.dotCurrent]}
            />
          ))}
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>Rejoins la communauté en moins de 2 minutes</Text>
        </View>

        {/* SSO */}
        <View style={styles.ssoContainer}>
          {[
            { icon: 'logo-google', label: 'Inscription avec Google' },
            { icon: 'logo-apple', label: 'Inscription avec Apple' },
          ].map(sso => (
            <TouchableOpacity
              key={sso.label}
              style={styles.ssoBtn}
              onPress={() => navigation.navigate('ChooseSports')}
              activeOpacity={0.8}
            >
              <Ionicons name={sso.icon as any} size={20} color={colors.textPrimary} />
              <Text style={styles.ssoBtnText}>{sso.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>ou par email</Text>
          <View style={styles.dividerLine} />
        </View>

        <Input
          label="Pseudo *"
          placeholder="TonPseudo (unique)"
          value={pseudo}
          onChangeText={t => { setPseudo(t); setPseudoError(''); }}
          icon="at-outline"
          error={pseudoError}
          hint="Ton pseudo sera visible par les autres membres"
          autoFocus
        />
        <Input
          label="Email *"
          placeholder="ton@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          icon="mail-outline"
        />
        <Input
          label="Mot de passe *"
          placeholder="Min. 8 caractères"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          icon="lock-closed-outline"
          hint="Au moins 8 caractères"
        />

        <View style={styles.termsRow}>
          <View style={[styles.checkbox, styles.checkboxChecked]}>
            <Ionicons name="checkmark" size={12} color={colors.textInverse} />
          </View>
          <Text style={styles.termsText}>
            J'accepte les <Text style={styles.termsLink}>CGU</Text> et la{' '}
            <Text style={styles.termsLink}>Politique de confidentialité</Text>
          </Text>
        </View>

        <Button
          label="Continuer"
          onPress={handleContinue}
          loading={loading}
          size="lg"
          icon="arrow-forward"
          iconPosition="right"
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Déjà inscrit ?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.footerLink}> Se connecter</Text>
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
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  progress: {
    flexDirection: 'row',
    gap: 6,
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
  dotCurrent: {
    backgroundColor: colors.lime,
  },
  header: {
    marginBottom: spacing.xl,
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: {
    backgroundColor: colors.lime,
    borderColor: colors.lime,
  },
  termsText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 20,
  },
  termsLink: {
    color: colors.lime,
    fontWeight: typography.medium,
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
