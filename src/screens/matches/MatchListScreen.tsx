import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { EmptyState } from '../../components/EmptyState';
import { SportTag } from '../../components/SportTag';
import { AvatarGroup } from '../../components/Avatar';
import { LiveBadge } from '../../components/LiveBadge';
import { MOCK_MATCHES, Match, Sport, formatMatchDate, formatMatchTime, SPORT_ICONS } from '../../data/mockData';

type FilterType = 'all' | 'padel' | 'tennis' | 'squash' | 'pingpong' | 'badminton';

interface MatchListScreenProps {
  navigation: any;
}

export function MatchListScreen({ navigation }: MatchListScreenProps) {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<FilterType>('all');

  const filtered = filter === 'all'
    ? MOCK_MATCHES
    : MOCK_MATCHES.filter(m => m.sport === filter);

  const stats = {
    total: MOCK_MATCHES.length,
    wins: MOCK_MATCHES.filter(m => m.winner === 'A').length,
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Matchs</Text>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="options-outline" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Stats summary */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.total}</Text>
          <Text style={styles.statLabel}>Matchs joués</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.wins}</Text>
          <Text style={styles.statLabel}>Victoires</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: colors.lime }]}>
            {Math.round((stats.wins / stats.total) * 100)}%
          </Text>
          <Text style={styles.statLabel}>Win rate</Text>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filters}>
        {(['all', 'padel', 'tennis', 'squash', 'pingpong'] as FilterType[]).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tous' : `${SPORT_ICONS[f as Exclude<FilterType, 'all'>]} ${f.charAt(0).toUpperCase() + f.slice(1)}`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing.base, paddingBottom: insets.bottom + 80 }}
        renderItem={({ item }) => (
          <MatchRowCard
            match={item}
            onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="videocam-outline"
            title="Aucun match trouvé"
            subtitle="Joue ton premier match filmé dans un club équipé Stream Your Sport."
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
      />
    </View>
  );
}

function MatchRowCard({ match, onPress }: { match: Match; onPress: () => void }) {
  const allPlayers = [...match.playersA, ...match.playersB];
  const isWin = match.winner === 'A';

  return (
    <TouchableOpacity style={styles.matchCard} onPress={onPress} activeOpacity={0.85}>
      {/* Left accent */}
      <View style={[styles.accent, { backgroundColor: isWin ? colors.lime : colors.bgSurface }]} />

      <View style={styles.matchCardContent}>
        {/* Top row */}
        <View style={styles.matchTopRow}>
          <SportTag sport={match.sport} size="sm" />
          <Text style={styles.matchDate}>{formatMatchDate(match.date)}</Text>
          {match.isLive && <LiveBadge />}
        </View>

        {/* Score */}
        <View style={styles.matchScoreRow}>
          <Text style={[styles.finalScore, isWin && { color: colors.lime }]}>
            {match.finalScore}
          </Text>
          <View style={[styles.resultBadge, isWin ? styles.winBadge : styles.loseBadge]}>
            <Text style={[styles.resultText, isWin ? styles.winText : styles.loseText]}>
              {isWin ? 'Victoire' : 'Défaite'}
            </Text>
          </View>
        </View>

        {/* Players */}
        <View style={styles.matchPlayersRow}>
          <AvatarGroup users={allPlayers} size={24} />
          <Text style={styles.matchPlayersText}>
            {match.playersA.map(p => p.pseudo).join(' & ')} vs {match.playersB.map(p => p.pseudo).join(' & ')}
          </Text>
        </View>

        {/* Bottom row */}
        <View style={styles.matchBottomRow}>
          <View style={styles.matchMeta}>
            <Ionicons name="location-outline" size={12} color={colors.textMuted} />
            <Text style={styles.matchMetaText}>{match.club}</Text>
          </View>
          <View style={styles.matchMeta}>
            <Ionicons name="time-outline" size={12} color={colors.textMuted} />
            <Text style={styles.matchMetaText}>{match.duration}</Text>
          </View>
          {match.momentsFortsCount > 0 && (
            <View style={styles.matchMeta}>
              <Ionicons name="star" size={12} color={colors.lime} />
              <Text style={[styles.matchMetaText, { color: colors.lime }]}>{match.momentsFortsCount}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} style={{ marginLeft: 'auto' }} />
        </View>
      </View>
    </TouchableOpacity>
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
  title: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
  },
  statsRow: {
    flexDirection: 'row',
    margin: spacing.base,
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  statCard: {
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
  filters: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    marginBottom: spacing.base,
    flexWrap: 'wrap',
  },
  filterChip: {
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
  filterText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  filterTextActive: {
    color: colors.lime,
    fontWeight: typography.semibold,
  },
  matchCard: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  accent: {
    width: 4,
  },
  matchCardContent: {
    flex: 1,
    padding: spacing.md,
    gap: spacing.xs + 2,
  },
  matchTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  matchDate: {
    flex: 1,
    color: colors.textMuted,
    fontSize: typography.xs,
    textAlign: 'right',
  },
  matchScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  finalScore: {
    color: colors.textPrimary,
    fontSize: typography.lg,
    fontWeight: typography.extrabold,
    letterSpacing: 0.5,
  },
  resultBadge: {
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  winBadge: {
    backgroundColor: colors.limeDim,
  },
  loseBadge: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  resultText: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  winText: {
    color: colors.lime,
  },
  loseText: {
    color: colors.textMuted,
  },
  matchPlayersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  matchPlayersText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: typography.xs,
  },
  matchBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  matchMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  matchMetaText: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
});
