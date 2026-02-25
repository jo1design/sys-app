import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { MatchCard } from '../../components/MatchCard';
import { EmptyState } from '../../components/EmptyState';
import { ME, MOCK_POSTS, MOCK_MATCHES } from '../../data/mockData';

type TabType = 'activites' | 'replays';

interface MyProfileScreenProps {
  navigation: any;
}

export function MyProfileScreen({ navigation }: MyProfileScreenProps) {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<TabType>('activites');

  const myPosts = MOCK_POSTS.filter(p => p.author.id === 'me' || p.match?.playersA.some(u => u.id === 'me'));
  const myMatches = MOCK_MATCHES.filter(m =>
    m.playersA.some(p => p.id === 'me') || m.playersB.some(p => p.id === 'me')
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mon Profil</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity hitSlop={8} onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}>
        {/* Profile hero */}
        <View style={styles.heroSection}>
          <View style={styles.avatarRow}>
            <Avatar user={ME} size={80} showBorder />
            <View style={styles.heroActions}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => navigation.navigate('EditProfile')}
              >
                <Ionicons name="pencil-outline" size={16} color={colors.textPrimary} />
                <Text style={styles.editBtnText}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.pseudo}>{ME.pseudo}</Text>
          {ME.club && (
            <View style={styles.clubRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.club}>{ME.club}</Text>
            </View>
          )}

          {/* Sports */}
          <View style={styles.sportsRow}>
            {ME.sports.map(sport => (
              <SportTag key={sport} sport={sport} />
            ))}
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{ME.matchCount}</Text>
              <Text style={styles.statLabel}>Matchs</Text>
            </View>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowList', { userId: ME.id, type: 'following' })}
            >
              <Text style={styles.statValue}>{ME.followingCount}</Text>
              <Text style={styles.statLabel}>Suivis</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity
              style={styles.statItem}
              onPress={() => navigation.navigate('FollowList', { userId: ME.id, type: 'followers' })}
            >
              <Text style={styles.statValue}>{ME.followersCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* V2 teaser */}
        <TouchableOpacity style={styles.statsTeaser} activeOpacity={0.8}>
          <View style={styles.statsTeaserIcon}>
            <Ionicons name="stats-chart" size={20} color={colors.lime} />
          </View>
          <View style={styles.statsTeaserText}>
            <Text style={styles.statsTeaserTitle}>Stats avancées</Text>
            <Text style={styles.statsTeaserSubtitle}>Vitesse, zones de jeu, coaching IA — bientôt disponible</Text>
          </View>
          <View style={styles.statsTeaserBadge}>
            <Text style={styles.statsTeaserBadgeText}>V2</Text>
          </View>
        </TouchableOpacity>

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

        {/* Tab content */}
        {activeTab === 'activites' ? (
          myPosts.length === 0 ? (
            <EmptyState
              icon="camera-outline"
              title="Pas encore de posts"
              subtitle="Tes matchs filmés apparaîtront ici automatiquement."
            />
          ) : (
            myPosts.map(post => (
              <MatchCard
                key={post.id}
                post={post}
                onPress={() => navigation.navigate('PostDetail', { postId: post.id })}
              />
            ))
          )
        ) : (
          <View style={{ paddingHorizontal: spacing.base }}>
            {myMatches.length === 0 ? (
              <EmptyState
                icon="videocam-outline"
                title="Pas encore de replays"
                subtitle="Joue dans un club équipé Stream Your Sport pour voir tes replays ici."
              />
            ) : (
              myMatches.map(match => (
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
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.base,
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
  heroActions: {
    gap: spacing.sm,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.bgSurface,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  editBtnText: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.medium,
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
  statsTeaser: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: spacing.base,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.lime}30`,
  },
  statsTeaserIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.limeDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsTeaserText: {
    flex: 1,
  },
  statsTeaserTitle: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  statsTeaserSubtitle: {
    color: colors.textMuted,
    fontSize: typography.xs,
    lineHeight: 16,
    marginTop: 2,
  },
  statsTeaserBadge: {
    backgroundColor: colors.limeDim,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  statsTeaserBadgeText: {
    color: colors.lime,
    fontSize: typography.xs,
    fontWeight: typography.extrabold,
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
