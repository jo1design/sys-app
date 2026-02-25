import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { Avatar } from '../../components/Avatar';
import { SportTag } from '../../components/SportTag';
import { LiveBadge } from '../../components/LiveBadge';
import { MOCK_POSTS, MOCK_COMMENTS, MOCK_USERS, formatRelativeTime, formatMatchDate } from '../../data/mockData';

interface PostDetailScreenProps {
  navigation: any;
  route: { params: { postId: string } };
}

export function PostDetailScreen({ navigation, route }: PostDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const post = MOCK_POSTS.find(p => p.id === route.params?.postId) ?? MOCK_POSTS[0];
  const [liked, setLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const me = MOCK_USERS.find(u => u.id === 'me')!;
  const { match } = post;

  const handleLike = () => {
    setLiked(p => {
      setLikesCount(c => p ? c - 1 : c + 1);
      return !p;
    });
  };

  const handleSendComment = () => {
    if (!comment.trim()) return;
    setComments(prev => [
      ...prev,
      {
        id: `c${Date.now()}`,
        author: me,
        text: comment.trim(),
        createdAt: new Date().toISOString(),
      },
    ]);
    setComment('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match</Text>
        <TouchableOpacity hitSlop={8}>
          <Ionicons name="share-outline" size={22} color={colors.lime} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListHeaderComponent={
          <>
            {/* Post author */}
            <View style={styles.authorRow}>
              <TouchableOpacity
                onPress={() => navigation.navigate('OtherProfile', { userId: post.author.id })}
              >
                <Avatar user={post.author} size={42} />
              </TouchableOpacity>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author.pseudo}</Text>
                <Text style={styles.authorMeta}>{formatRelativeTime(post.createdAt)}</Text>
              </View>
              {match?.isLive && <LiveBadge />}
              {match && <SportTag sport={match.sport} size="sm" />}
            </View>

            {/* Thumbnail */}
            {match && (
              <TouchableOpacity style={styles.videoContainer} activeOpacity={0.9}>
                <Image
                  source={{ uri: match.thumbnailUrl }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
                <View style={styles.playOverlay}>
                  <View style={styles.playCircle}>
                    <Ionicons
                      name={match.isLive ? 'radio' : 'play'}
                      size={32}
                      color={colors.textInverse}
                    />
                  </View>
                  {match.isLive && (
                    <View style={styles.liveWatchBtn}>
                      <Text style={styles.liveWatchText}>Regarder en direct</Text>
                    </View>
                  )}
                </View>
                {/* Score badge */}
                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreBadgeText}>{match.finalScore}</Text>
                </View>
              </TouchableOpacity>
            )}

            {/* Match info */}
            {match && (
              <View style={styles.matchInfo}>
                <View style={styles.matchInfoRow}>
                  <Ionicons name="location-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.matchInfoText}>{match.club} · {match.court}</Text>
                </View>
                <View style={styles.matchInfoRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.matchInfoText}>{formatMatchDate(match.date)}</Text>
                </View>
                <View style={styles.matchInfoRow}>
                  <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                  <Text style={styles.matchInfoText}>{match.duration}</Text>
                </View>
              </View>
            )}

            {/* Players vs block */}
            {match && (
              <View style={styles.vsBlock}>
                <View style={styles.teamBlock}>
                  {match.playersA.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={styles.playerItem}
                      onPress={() => navigation.navigate('OtherProfile', { userId: p.id })}
                    >
                      <Avatar user={p} size={36} showBorder />
                      <Text style={styles.playerName}>{p.pseudo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.vsCenter}>
                  <Text style={styles.vsText}>VS</Text>
                  <View style={styles.setsBlock}>
                    {match.sets.map(set => (
                      <View key={set.set} style={styles.setRow}>
                        <Text style={[styles.setScore, set.scoreA > set.scoreB && styles.setWinner]}>
                          {set.scoreA}
                        </Text>
                        <Text style={styles.setDash}>-</Text>
                        <Text style={[styles.setScore, set.scoreB > set.scoreA && styles.setWinner]}>
                          {set.scoreB}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.teamBlock}>
                  {match.playersB.map(p => (
                    <TouchableOpacity
                      key={p.id}
                      style={[styles.playerItem, { alignItems: 'flex-end' }]}
                      onPress={() => navigation.navigate('OtherProfile', { userId: p.id })}
                    >
                      <Avatar user={p} size={36} showBorder />
                      <Text style={styles.playerName}>{p.pseudo}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Moments forts */}
            {match?.momentsForts && match.momentsForts.length > 0 && (
              <View style={styles.momentsSection}>
                <View style={styles.momentsSectionHeader}>
                  <Ionicons name="star" size={14} color={colors.lime} />
                  <Text style={styles.momentsSectionTitle}>
                    {match.momentsForts.length} Moments forts
                  </Text>
                </View>
                {match.momentsForts.map(mf => (
                  <TouchableOpacity key={mf.id} style={styles.momentRow}>
                    <View style={styles.momentTimestamp}>
                      <Text style={styles.momentTime}>
                        {formatTimestamp(mf.timestamp)}
                      </Text>
                    </View>
                    <Text style={styles.momentLabel}>{mf.label}</Text>
                    <Ionicons name="play-circle-outline" size={20} color={colors.lime} />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Actions */}
            <View style={styles.actions}>
              <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
                <Ionicons
                  name={liked ? 'heart' : 'heart-outline'}
                  size={24}
                  color={liked ? colors.like : colors.textSecondary}
                />
                <Text style={[styles.actionCount, liked && { color: colors.like }]}>{likesCount}</Text>
              </TouchableOpacity>
              <View style={styles.actionBtn}>
                <Ionicons name="chatbubble-outline" size={22} color={colors.textSecondary} />
                <Text style={styles.actionCount}>{comments.length}</Text>
              </View>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="share-outline" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
              {match && (
                <TouchableOpacity style={[styles.replayBtn]}>
                  <Ionicons name="play-circle" size={16} color={colors.textInverse} />
                  <Text style={styles.replayBtnText}>Voir replay</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Comments header */}
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Commentaires</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <View style={styles.commentRow}>
            <Avatar user={item.author} size={32} />
            <View style={styles.commentBubble}>
              <Text style={styles.commentAuthor}>{item.author.pseudo}</Text>
              <Text style={styles.commentText}>{item.text}</Text>
              <Text style={styles.commentTime}>{formatRelativeTime(item.createdAt)}</Text>
            </View>
          </View>
        )}
      />

      {/* Comment input */}
      <View style={[styles.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <Avatar user={me} size={32} />
        <TextInput
          style={styles.commentInput}
          placeholder="Ajouter un commentaire..."
          placeholderTextColor={colors.textMuted}
          value={comment}
          onChangeText={setComment}
          selectionColor={colors.lime}
          multiline
        />
        <TouchableOpacity onPress={handleSendComment} disabled={!comment.trim()} hitSlop={8}>
          <Ionicons
            name="send"
            size={22}
            color={comment.trim() ? colors.lime : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.md,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.semibold,
  },
  authorMeta: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  videoContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: 220,
    backgroundColor: colors.bgSurface,
  },
  playOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },
  playCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveWatchBtn: {
    backgroundColor: colors.live,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  liveWatchText: {
    color: colors.textPrimary,
    fontWeight: typography.bold,
    fontSize: typography.base,
  },
  scoreBadge: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderRadius: radius.full,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: colors.lime,
  },
  scoreBadgeText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.extrabold,
  },
  matchInfo: {
    padding: spacing.base,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  matchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  matchInfoText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
  },
  vsBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  teamBlock: {
    flex: 1,
    gap: spacing.sm,
  },
  playerItem: {
    alignItems: 'center',
    gap: 4,
  },
  playerName: {
    color: colors.textPrimary,
    fontSize: typography.xs,
    fontWeight: typography.medium,
    textAlign: 'center',
  },
  vsCenter: {
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  vsText: {
    color: colors.textMuted,
    fontSize: typography.xs,
    fontWeight: typography.black,
    letterSpacing: 2,
  },
  setsBlock: {
    gap: 4,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  setScore: {
    color: colors.textSecondary,
    fontSize: typography.md,
    fontWeight: typography.bold,
    width: 20,
    textAlign: 'center',
  },
  setWinner: {
    color: colors.lime,
  },
  setDash: {
    color: colors.textMuted,
    fontSize: typography.sm,
  },
  momentsSection: {
    padding: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  momentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  momentsSectionTitle: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  momentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  momentTimestamp: {
    backgroundColor: colors.limeDim,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  momentTime: {
    color: colors.lime,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  momentLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: typography.sm,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.base,
    gap: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.lime,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    marginLeft: 'auto',
  },
  replayBtnText: {
    color: colors.textInverse,
    fontSize: typography.sm,
    fontWeight: typography.bold,
  },
  commentsHeader: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  },
  commentsTitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  commentRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: 3,
  },
  commentAuthor: {
    color: colors.textPrimary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
  },
  commentText: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 18,
  },
  commentTime: {
    color: colors.textMuted,
    fontSize: typography.xs,
    marginTop: 2,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    gap: spacing.sm,
    backgroundColor: colors.bgDeep,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  commentInput: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.textPrimary,
    fontSize: typography.sm,
    maxHeight: 80,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
