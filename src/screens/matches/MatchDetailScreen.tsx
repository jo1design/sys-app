import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { LiveBadge } from '../../components/LiveBadge';
import { Button } from '../../components/Button';
import { MOCK_MATCHES, formatMatchDate, formatMatchTime } from '../../data/mockData';

interface MatchDetailScreenProps {
  navigation: any;
  route: { params: { matchId: string } };
}

export function MatchDetailScreen({ navigation, route }: MatchDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const match = MOCK_MATCHES.find(m => m.id === route.params?.matchId) ?? MOCK_MATCHES[0];
  const [postCreated, setPostCreated] = useState(!!match.postId);

  const handleShare = async () => {
    await Share.share({
      message: `Regarde mon match (${match.finalScore}) en replay sur Stream Your Sport !`,
      url: `https://youtube.com/watch?v=${match.youtubeVideoId}`,
    });
  };

  const handleCreatePost = () => {
    setPostCreated(true);
  };

  const isWin = match.winner === 'A';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Détail du match</Text>
        <TouchableOpacity onPress={handleShare} hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={colors.lime} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}>
        {/* Thumbnail */}
        <TouchableOpacity style={styles.videoBlock} activeOpacity={0.9}>
          <Image source={{ uri: match.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
          <View style={styles.playOverlay}>
            <View style={styles.playBtn}>
              <Ionicons name={match.isLive ? 'radio' : 'play'} size={28} color={colors.textInverse} />
            </View>
          </View>
          {match.isLive && (
            <View style={styles.liveBadgePos}>
              <LiveBadge />
            </View>
          )}
          <View style={styles.durationPos}>
            <Text style={styles.durationText}>{match.duration}</Text>
          </View>
        </TouchableOpacity>

        {/* Result banner */}
        <View style={[styles.resultBanner, isWin ? styles.winBanner : styles.loseBanner]}>
          <Text style={[styles.resultEmoji]}>{isWin ? '🏆' : '💪'}</Text>
          <View>
            <Text style={[styles.resultLabel, { color: isWin ? colors.lime : colors.textSecondary }]}>
              {isWin ? 'Victoire' : 'Défaite'}
            </Text>
            <Text style={styles.resultScore}>{match.finalScore}</Text>
          </View>
          <View style={styles.resultSets}>
            {match.sets.map(set => (
              <Text key={set.set} style={styles.resultSetText}>
                Set {set.set}: {set.scoreA}-{set.scoreB}
              </Text>
            ))}
          </View>
        </View>

        {/* Info cards */}
        <View style={styles.infoGrid}>
          <InfoCard icon="location-outline" label="Club" value={match.club} />
          <InfoCard icon="calendar-outline" label="Date" value={formatMatchDate(match.date)} />
          <InfoCard icon="time-outline" label="Durée" value={match.duration} />
          <InfoCard icon="tv-outline" label="Caméra" value={match.court} />
        </View>

        {/* Sport */}
        <View style={styles.section}>
          <SportTag sport={match.sport} />
        </View>

        {/* Players */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Joueurs</Text>
          <View style={styles.teamsRow}>
            <View style={styles.teamCol}>
              <Text style={styles.teamLabel}>Équipe A</Text>
              {match.playersA.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={styles.playerRow}
                  onPress={() => navigation.navigate('OtherProfile', { userId: player.id })}
                >
                  <Avatar user={player} size={36} showBorder />
                  <Text style={styles.playerName}>{player.pseudo}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.vsCircle}>
              <Text style={styles.vsText}>VS</Text>
            </View>

            <View style={[styles.teamCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.teamLabel}>Équipe B</Text>
              {match.playersB.map(player => (
                <TouchableOpacity
                  key={player.id}
                  style={[styles.playerRow, { flexDirection: 'row-reverse' }]}
                  onPress={() => navigation.navigate('OtherProfile', { userId: player.id })}
                >
                  <Avatar user={player} size={36} showBorder />
                  <Text style={styles.playerName}>{player.pseudo}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Detailed sets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Score détaillé</Text>
          <View style={styles.setsTable}>
            <View style={styles.setsTableHeader}>
              <Text style={[styles.setsCell, { flex: 2 }]}>Set</Text>
              <Text style={styles.setsCell}>{match.playersA[0]?.pseudo ?? 'Éq. A'}</Text>
              <Text style={styles.setsCell}>{match.playersB[0]?.pseudo ?? 'Éq. B'}</Text>
            </View>
            {match.sets.map(set => (
              <View key={set.set} style={styles.setsTableRow}>
                <Text style={[styles.setsCell, { flex: 2, color: colors.textSecondary }]}>Set {set.set}</Text>
                <Text style={[styles.setsCell, set.scoreA > set.scoreB && styles.winnerCell]}>
                  {set.scoreA}
                </Text>
                <Text style={[styles.setsCell, set.scoreB > set.scoreA && styles.winnerCell]}>
                  {set.scoreB}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Moments forts */}
        {match.momentsForts && match.momentsForts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="star" size={14} color={colors.lime} /> Moments forts ({match.momentsForts.length})
            </Text>
            {match.momentsForts.map(mf => (
              <TouchableOpacity key={mf.id} style={styles.momentRow}>
                <View style={styles.momentStamp}>
                  <Text style={styles.momentStampText}>
                    {formatTimestamp(mf.timestamp)}
                  </Text>
                </View>
                <Text style={styles.momentLabel}>{mf.label}</Text>
                <View style={styles.momentPlayBtn}>
                  <Ionicons name="play" size={12} color={colors.textInverse} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            label="Voir le replay"
            onPress={() => {}}
            icon="play-circle-outline"
            size="lg"
          />
          <Button
            label="Partager ce match"
            onPress={handleShare}
            variant="outline"
            icon="share-outline"
            size="lg"
          />
          {!postCreated ? (
            <Button
              label="Créer un post"
              onPress={handleCreatePost}
              variant="secondary"
              icon="add-circle-outline"
              size="lg"
            />
          ) : (
            <View style={styles.postedBadge}>
              <Ionicons name="checkmark-circle" size={18} color={colors.lime} />
              <Text style={styles.postedText}>Déjà posté dans le feed</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function InfoCard({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <View style={styles.infoCard}>
      <Ionicons name={icon} size={18} color={colors.lime} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
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
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.bold,
  },
  videoBlock: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 210,
    backgroundColor: colors.bgSurface,
  },
  playOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveBadgePos: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  durationPos: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: typography.xs,
  },
  resultBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
  },
  winBanner: {
    backgroundColor: `${colors.lime}10`,
  },
  loseBanner: {
    backgroundColor: colors.bgCard,
  },
  resultEmoji: {
    fontSize: 32,
  },
  resultLabel: {
    fontSize: typography.xs,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultScore: {
    color: colors.textPrimary,
    fontSize: typography.xxl,
    fontWeight: typography.extrabold,
  },
  resultSets: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 2,
  },
  resultSetText: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    paddingBottom: spacing.base,
  },
  infoCard: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
    gap: 4,
    flex: 1,
    minWidth: '44%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    gap: spacing.sm,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },
  teamsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  teamCol: {
    flex: 1,
    gap: spacing.sm,
  },
  teamLabel: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  vsCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.bgSurface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.black,
  },
  setsTable: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  setsTableHeader: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setsTableRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setsCell: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  winnerCell: {
    color: colors.lime,
    fontWeight: typography.extrabold,
  },
  momentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.lime}20`,
  },
  momentStamp: {
    backgroundColor: colors.limeDim,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  momentStampText: {
    color: colors.lime,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  momentLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sm,
  },
  momentPlayBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsSection: {
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
    paddingTop: spacing.base,
  },
  postedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  postedText: {
    color: colors.lime,
    fontSize: typography.base,
    fontWeight: typography.medium,
  },
});
