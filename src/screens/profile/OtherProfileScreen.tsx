import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { MatchCard } from '../../components/MatchCard';
import { EmptyState } from '../../components/EmptyState';
import { MOCK_USERS, MOCK_POSTS, MOCK_MATCHES } from '../../data/mockData';

type TabType = 'activites' | 'replays';

interface OtherProfileScreenProps {
  navigation: any;
  route: { params: { userId: string } };
}

export function OtherProfileScreen({ navigation, route }: OtherProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const user = MOCK_USERS.find(u => u.id === route.params?.userId) ?? MOCK_USERS[0];
  const [isFollowing, setIsFollowing] = useState(user.isFollowing ?? false);
  const [followersCount, setFollowersCount] = useState(user.followersCount);
  const [activeTab, setActiveTab] = useState<TabType>('activites');

  const userPosts = MOCK_POSTS.filter(p => p.author.id === user.id);
  const userMatches = MOCK_MATCHES.filter(m =>
    m.playersA.some(p => p.id === user.id) || m.playersB.some(p => p.id === user.id)
  );

  const handleFollow = () => {
    setIsFollowing(prev => {
      setFollowersCount(c => prev ? c - 1 : c + 1);
      return !prev;
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.pseudo}</Text>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="ellipsis-horizontal" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarRow}>
            <Avatar user={user} size={80} showBorder />
            <View style={styles.ctaArea}>
              <TouchableOpacity
                style={[styles.followBtn, isFollowing && styles.followingBtn]}
                onPress={handleFollow}
              >
                <Text style={[styles.followBtnText, isFollowing && styles.followingBtnText]}>
                  {isFollowing ? 'Suivi ✓' : 'Suivre'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareBtn}>
                <Ionicons name="share-outline" size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.pseudo}>{user.pseudo}</Text>
          {user.club && (
            <View style={styles.clubRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.club}>{user.club}</Text>
            </View>
          )}

          <View style={styles.sportsRow}>
            {user.sports.map(sport => (
              <SportTag key={sport} sport={sport} />
            ))}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.matchCount}</Text>
              <Text style={styles.statLabel}>Matchs</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowList', { userId: user.id, type: 'following' })}
            >
              <Text style={styles.statValue}>{user.followingCount}</Text>
              <Text style={styles.statLabel}>Suivis</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowList', { userId: user.id, type: 'followers' })}
            >
              <Text style={styles.statValue}>{followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {(['activites', 'replays'] as TabType[]).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'activites' ? 'Activités' : 'Replays'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'activites' ? (
          userPosts.length === 0 ? (
            <EmptyState
              icon="camera-outline"
              title="Pas encore d'activité"
              subtitle={`${user.pseudo} n'a pas encore posté.`}
            />
          ) : (
            userPosts.map(post => (
              <MatchCard
                key={post.id}
                post={post}
                onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
              />
            ))
          )
        ) : (
          <View style={{ paddingHorizontal: spacing.base }}>
            {userMatches.length === 0 ? (
              <EmptyState
                icon="videocam-outline"
                title="Pas encore de replays"
                subtitle={`${user.pseudo} n'a pas encore de match filmé.`}
              />
            ) : (
              userMatches.map(match => (
                <TouchableOpacity
                  key={match.id}
                  style={styles.replayRow}
                  onPress={() => navigation.navigate('MatchDetail', { matchId: match.id })}
                >
                  <View style={styles.replayThumb}>
                    <Ionicons name="play-circle" size={28} color={colors.lime} />
                  </View>
                  <View style={styles.replayInfo}>
                    <Text style={styles.replayScore}>{match.finalScore}</Text>
                    <Text style={styles.replayMeta}>{match.sport} · {match.club}</Text>
                    <Text style={styles.replayMeta}>{match.duration}</Text>
                  </View>
                  <SportTag sport={match.sport} size="sm" />
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
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
  heroSection: {
    padding: spacing.base,
    gap: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctaArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  followBtn: {
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.sm,
  },
  followingBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  followBtnText: {
    color: colors.textInverse,
    fontSize: typography.base,
    fontWeight: typography.bold,
  },
  followingBtnText: {
    color: colors.textSecondary,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pseudo: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
  },
  clubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  club: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
  sportsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    flexWrap: 'wrap',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.base,
    gap: 3,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
  },
  statLabel: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
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
  replayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  replayThumb: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: colors.limeDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  replayInfo: {
    flex: 1,
    gap: 3,
  },
  replayScore: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  replayMeta: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
});
