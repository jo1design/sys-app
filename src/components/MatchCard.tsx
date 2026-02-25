import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { typography, spacing, radius } from '../constants/theme';
import { Post, formatRelativeTime, SPORT_ICONS } from '../data/mockData';
import { Avatar, AvatarGroup } from './Avatar';
import { LiveBadge } from './LiveBadge';
import { SportTag } from './SportTag';

interface MatchCardProps {
  post: Post;
  onPress?: () => void;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function MatchCard({ post, onPress, onLike, onComment, onShare }: MatchCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const lastTap = useRef<number>(0);

  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      handleLike();
    }
    lastTap.current = now;
  };

  const handleLike = () => {
    setLiked(prev => {
      setLikesCount(c => prev ? c - 1 : c + 1);
      return !prev;
    });
    onLike?.();
  };

  if (post.type === 'photo') {
    return <PhotoCard post={post} onLike={onLike} onComment={onComment} onPress={onPress} />;
  }

  if (post.type === 'moment_fort') {
    return <MomentFortCard post={post} onLike={onLike} onPress={onPress} />;
  }

  const { match } = post;
  if (!match) return null;

  const allPlayers = [...match.playersA, ...match.playersB];

  return (
    <Pressable onPress={handleDoubleTap} style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar user={post.author} size={38} />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{post.author.pseudo}</Text>
          <Text style={styles.meta}>
            {match.club} · {formatRelativeTime(post.createdAt)}
          </Text>
        </View>
        {match.isLive && <LiveBadge />}
        <SportTag sport={match.sport} size="sm" />
      </View>

      {/* Thumbnail */}
      <TouchableOpacity style={styles.thumbnailContainer} onPress={onPress} activeOpacity={0.9}>
        <Image
          source={{ uri: match.thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        {/* Score overlay */}
        <View style={styles.scoreOverlay}>
          <View style={styles.scorePill}>
            <Text style={styles.scoreText}>{match.finalScore}</Text>
          </View>
        </View>
        {/* Play button */}
        <View style={styles.playBtn}>
          <Ionicons name={match.isLive ? 'radio' : 'play-circle'} size={52} color="rgba(255,255,255,0.9)" />
        </View>
        {/* Live CTA */}
        {match.isLive && (
          <View style={styles.liveCta}>
            <Text style={styles.liveCtaText}>Regarder en direct →</Text>
          </View>
        )}
        {/* Duration */}
        {!match.isLive && (
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{match.duration}</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Players */}
      <View style={styles.playersRow}>
        <AvatarGroup users={allPlayers} size={28} />
        <View style={styles.setsContainer}>
          {match.sets.map(set => (
            <View key={set.set} style={styles.setChip}>
              <Text style={styles.setText}>{set.scoreA}-{set.scoreB}</Text>
            </View>
          ))}
        </View>
        {match.momentsFortsCount > 0 && (
          <View style={styles.momentsChip}>
            <Ionicons name="star" size={12} color={colors.lime} />
            <Text style={styles.momentsText}>{match.momentsFortsCount}</Text>
          </View>
        )}
      </View>

      {/* Players names */}
      <View style={styles.playerNames}>
        <Text style={styles.playerNameText}>
          {match.playersA.map(p => p.pseudo).join(' & ')}
          <Text style={styles.vsText}> vs </Text>
          {match.playersB.map(p => p.pseudo).join(' & ')}
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike} hitSlop={8}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={22}
            color={liked ? colors.like : colors.textSecondary}
          />
          <Text style={[styles.actionCount, liked && { color: colors.like }]}>{likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onComment} hitSlop={8}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionCount}>{post.commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onShare} hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={colors.textSecondary} />
          <Text style={styles.actionCount}>Partager</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.replayBtn]} onPress={onPress}>
          <Text style={styles.replayText}>Voir replay</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.lime} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

function PhotoCard({ post, onLike, onComment, onPress }: MatchCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Avatar user={post.author} size={38} />
        <View style={styles.headerText}>
          <Text style={styles.authorName}>{post.author.pseudo}</Text>
          <Text style={styles.meta}>{formatRelativeTime(post.createdAt)}</Text>
        </View>
      </View>
      {post.photoUrl && (
        <TouchableOpacity onPress={onPress}>
          <Image source={{ uri: post.photoUrl }} style={[styles.thumbnail, { height: 220 }]} resizeMode="cover" />
        </TouchableOpacity>
      )}
      {post.caption && <Text style={styles.caption}>{post.caption}</Text>}
      {post.taggedUsers && post.taggedUsers.length > 0 && (
        <Text style={styles.taggedText}>
          Avec {post.taggedUsers.map(u => u.pseudo).join(', ')}
        </Text>
      )}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => { setLiked(p => !p); setLikesCount(c => liked ? c - 1 : c + 1); }}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.like : colors.textSecondary} />
          <Text style={[styles.actionCount, liked && { color: colors.like }]}>{likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onComment}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionCount}>{post.commentsCount}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function MomentFortCard({ post, onLike, onPress }: MatchCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);

  return (
    <TouchableOpacity style={[styles.card, styles.momentCard]} onPress={onPress}>
      <View style={styles.momentHeader}>
        <View style={styles.momentIconRow}>
          <Ionicons name="star" size={16} color={colors.lime} />
          <Text style={styles.momentLabel}>Moment Fort</Text>
        </View>
        <Text style={styles.meta}>{formatRelativeTime(post.createdAt)}</Text>
      </View>
      <View style={styles.header}>
        <Avatar user={post.author} size={32} />
        <Text style={styles.momentTitle}>{post.moment?.label ?? 'Moment fort'}</Text>
      </View>
      <View style={styles.momentThumb}>
        <Image source={{ uri: post.match?.thumbnailUrl }} style={styles.thumbnail} resizeMode="cover" />
        <View style={styles.playBtn}>
          <Ionicons name="play-circle" size={44} color={colors.lime} />
        </View>
        {post.moment && (
          <View style={styles.timestampBadge}>
            <Text style={styles.timestampText}>{formatTimestamp(post.moment.timestamp)}</Text>
          </View>
        )}
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => { setLiked(p => !p); setLikesCount(c => liked ? c - 1 : c + 1); }}>
          <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? colors.like : colors.textSecondary} />
          <Text style={[styles.actionCount, liked && { color: colors.like }]}>{likesCount}</Text>
        </TouchableOpacity>
        <Text style={styles.replayText}>Voir le match complet →</Text>
      </View>
    </TouchableOpacity>
  );
}

function formatTimestamp(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    marginHorizontal: spacing.base,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  momentCard: {
    borderColor: `${colors.lime}30`,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  authorName: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  meta: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    marginTop: 1,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.bgSurface,
  },
  scoreOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  },
  scorePill: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  scoreText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.extrabold,
    letterSpacing: 0.5,
  },
  playBtn: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveCta: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.live,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
  },
  liveCtaText: {
    color: colors.textPrimary,
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
  durationBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  durationText: {
    color: colors.textSecondary,
    fontSize: typography.xs,
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  setsContainer: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
  },
  setChip: {
    backgroundColor: colors.bgSurface,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  setText: {
    color: colors.textSecondary,
    fontSize: typography.xs,
    fontWeight: typography.medium,
  },
  momentsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.limeDim,
    borderRadius: radius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  momentsText: {
    color: colors.lime,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  playerNames: {
    paddingHorizontal: spacing.md,
    paddingTop: 4,
    paddingBottom: spacing.sm,
  },
  playerNameText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  vsText: {
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    gap: spacing.base,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionCount: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  replayBtn: {
    marginLeft: 'auto',
  },
  replayText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  caption: {
    color: colors.textPrimary,
    fontSize: typography.base,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  taggedText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  momentCard2: {},
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  momentIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  momentLabel: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  momentTitle: {
    color: colors.textPrimary,
    fontSize: typography.md,
    fontWeight: typography.semibold,
    flex: 1,
  },
  momentThumb: {
    position: 'relative',
  },
  timestampBadge: {
    position: 'absolute',
    bottom: spacing.sm,
    left: spacing.sm,
    backgroundColor: colors.limeDim,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  timestampText: {
    color: colors.lime,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
});
