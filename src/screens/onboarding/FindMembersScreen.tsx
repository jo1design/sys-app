import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Button } from '../../components/Button';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { MOCK_USERS } from '../../data/mockData';

interface FindMembersScreenProps {
  navigation: any;
}

export function FindMembersScreen({ navigation }: FindMembersScreenProps) {
  const insets = useSafeAreaInsets();
  const suggestions = MOCK_USERS.filter(u => u.id !== 'me');
  const [following, setFollowing] = useState<Set<string>>(new Set(['u2', 'u3', 'u5']));

  const toggleFollow = (id: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Progress */}
      <View style={styles.progress}>
        {[1, 2, 3, 4].map(i => (
          <View key={i} style={[styles.dot, i <= 3 && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.header}>
        <Text style={styles.step}>Étape 2 sur 3</Text>
        <Text style={styles.title}>Suis tes amis</Text>
        <Text style={styles.subtitle}>
          Retrouve les membres de ton club et suis leurs matchs en direct.
        </Text>
      </View>

      {/* Club filter chip */}
      <View style={styles.filterRow}>
        <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
          <Text style={styles.filterChipActiveText}>Mon club</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Text style={styles.filterChipText}>Tous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterChip}>
          <Ionicons name="search-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.filterChipText}>Rechercher</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={suggestions}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isFollowing = following.has(item.id);
          return (
            <View style={styles.memberCard}>
              <Avatar user={item} size={48} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{item.pseudo}</Text>
                {item.club && (
                  <Text style={styles.memberClub}>
                    <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                    {' '}{item.club}
                  </Text>
                )}
                <View style={styles.sportsRow}>
                  {item.sports.slice(0, 2).map(sport => (
                    <SportTag key={sport} sport={sport} size="sm" />
                  ))}
                </View>
              </View>
              <View style={styles.memberRight}>
                <Text style={styles.matchCount}>{item.matchCount} matchs</Text>
                <TouchableOpacity
                  style={[styles.followBtn, isFollowing && styles.followingBtn]}
                  onPress={() => toggleFollow(item.id)}
                >
                  <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                    {isFollowing ? '✓ Suivi' : 'Suivre'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        ListFooterComponent={
          <View style={styles.footer}>
            <Button
              label={`Continuer (${following.size} suivi${following.size > 1 ? 's' : ''})`}
              onPress={() => navigation.navigate('NotificationsPermission')}
              size="lg"
            />
            <TouchableOpacity
              style={styles.skipBtn}
              onPress={() => navigation.navigate('NotificationsPermission')}
            >
              <Text style={styles.skipText}>Passer cette étape</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  header: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.base,
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
    lineHeight: 22,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
    marginBottom: spacing.base,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    backgroundColor: colors.bgSurface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.limeDim,
    borderColor: colors.lime,
  },
  filterChipText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  filterChipActiveText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  list: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.sm,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  memberInfo: {
    flex: 1,
    gap: 3,
  },
  memberName: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  memberClub: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  sportsRow: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 2,
  },
  memberRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  matchCount: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  followBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.lime,
    minWidth: 72,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  followBtnText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  followingBtnText: {
    color: colors.textSecondary,
  },
  footer: {
    paddingTop: spacing.base,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  skipText: {
    color: colors.textMuted,
    fontSize: typography.base,
  },
});
