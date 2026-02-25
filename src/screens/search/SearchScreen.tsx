import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { MOCK_USERS, User } from '../../data/mockData';

interface SearchScreenProps {
  navigation: any;
}

export function SearchScreen({ navigation }: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [following, setFollowing] = useState<Set<string>>(
    new Set(MOCK_USERS.filter(u => u.isFollowing).map(u => u.id))
  );

  const results = query.length >= 1
    ? MOCK_USERS.filter(u =>
        u.id !== 'me' &&
        u.pseudo.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const suggested = MOCK_USERS.filter(u => u.id !== 'me');

  const toggleFollow = (id: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const displayUsers = query.length >= 1 ? results : suggested;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        {navigation.canGoBack() && (
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        )}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={query ? colors.lime : colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Chercher un membre..."
            placeholderTextColor={colors.textMuted}
            value={query}
            onChangeText={setQuery}
            autoFocus
            selectionColor={colors.lime}
            autoCapitalize="none"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Section title */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {query.length >= 1
            ? results.length === 0 ? 'Aucun résultat' : `${results.length} résultat${results.length > 1 ? 's' : ''}`
            : 'Suggestions'}
        </Text>
        {query.length === 0 && (
          <Text style={styles.sectionSub}>Membres de ta communauté</Text>
        )}
      </View>

      <FlatList
        data={displayUsers}
        keyExtractor={item => item.id}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isFollowing = following.has(item.id);
          return (
            <TouchableOpacity
              style={styles.userCard}
              onPress={() => navigation.navigate('OtherProfile', { userId: item.id })}
              activeOpacity={0.8}
            >
              <Avatar user={item} size={52} showBorder={isFollowing} />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.pseudo}</Text>
                {item.club && (
                  <View style={styles.clubRow}>
                    <Ionicons name="location-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.userClub}>{item.club}</Text>
                  </View>
                )}
                <View style={styles.sportsRow}>
                  {item.sports.slice(0, 2).map(sport => (
                    <SportTag key={sport} sport={sport} size="sm" />
                  ))}
                </View>
              </View>
              <View style={styles.rightCol}>
                <Text style={styles.matchCount}>{item.matchCount} matchs</Text>
                <TouchableOpacity
                  style={[styles.followBtn, isFollowing && styles.followingBtn]}
                  onPress={() => toggleFollow(item.id)}
                >
                  <Text style={[styles.followText, isFollowing && styles.followingText]}>
                    {isFollowing ? '✓ Suivi' : 'Suivre'}
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          query.length >= 1 ? (
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Aucun membre trouvé</Text>
              <Text style={styles.emptySubtitle}>Essaie avec un autre pseudo</Text>
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={styles.separator} />}
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
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    gap: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 44,
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.base,
    height: '100%',
  },
  sectionHeader: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionSub: {
    color: colors.textMuted,
    fontSize: typography.xs,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: spacing.base,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
    gap: 4,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  userClub: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  sportsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 6,
  },
  matchCount: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  followBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    minWidth: 72,
    alignItems: 'center',
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  followText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  followingText: {
    color: colors.textSecondary,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: spacing.md,
  },
  emptyTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  emptySubtitle: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
});
