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
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { MOCK_USERS } from '../../data/mockData';

type ListType = 'followers' | 'following';

interface FollowListScreenProps {
  navigation: any;
  route: { params: { userId: string; type: ListType } };
}

export function FollowListScreen({ navigation, route }: FollowListScreenProps) {
  const insets = useSafeAreaInsets();
  const { type } = route.params;
  const [following, setFollowing] = useState<Set<string>>(
    new Set(MOCK_USERS.filter(u => u.isFollowing).map(u => u.id))
  );

  const users = MOCK_USERS.filter(u => u.id !== 'me');

  const toggle = (id: string) => {
    setFollowing(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {type === 'followers' ? 'Followers' : 'Suivis'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, type === 'followers' && styles.tabActive]}
        >
          <Text style={[styles.tabText, type === 'followers' && styles.tabTextActive]}>
            Followers {type === 'followers' ? `(${users.length})` : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, type === 'following' && styles.tabActive]}
        >
          <Text style={[styles.tabText, type === 'following' && styles.tabTextActive]}>
            Suivis {type === 'following' ? `(${following.size})` : ''}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={type === 'following' ? users.filter(u => following.has(u.id)) : users}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isFollowing = following.has(item.id);
          return (
            <View style={styles.userRow}>
              <TouchableOpacity
                style={styles.userInfo}
                onPress={() => navigation.navigate('OtherProfile', { userId: item.id })}
              >
                <Avatar user={item} size={48} />
                <View style={styles.userText}>
                  <Text style={styles.userName}>{item.pseudo}</Text>
                  {item.club && <Text style={styles.userClub}>{item.club}</Text>}
                  <View style={styles.sportsRow}>
                    {item.sports.slice(0, 2).map(sport => (
                      <SportTag key={sport} sport={sport} size="sm" />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={() => toggle(item.id)}
              >
                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                  {isFollowing ? 'Suivi' : 'Suivre'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="people-outline" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              {type === 'following' ? 'Tu ne suis personne encore' : 'Pas encore de followers'}
            </Text>
          </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.lime,
  },
  tabText: {
    color: colors.textMuted,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
  tabTextActive: {
    color: colors.textPrimary,
    fontWeight: typography.bold,
  },
  list: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  userText: {
    flex: 1,
    gap: 3,
  },
  userName: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
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
  followBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
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
  emptyText: {
    color: colors.textMuted,
    fontSize: typography.base,
    textAlign: 'center',
  },
});
