import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Share,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { typography, spacing, radius } from '../../constants/theme';
import { MatchCard } from '../../components/MatchCard';
import { EmptyState } from '../../components/EmptyState';
import { Avatar } from '../../components/Avatar';
import { MOCK_POSTS, MOCK_USERS, Post } from '../../data/mockData';

interface FeedScreenProps {
  navigation: any;
}

export function FeedScreen({ navigation }: FeedScreenProps) {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [refreshing, setRefreshing] = useState(false);
  const me = MOCK_USERS.find(u => u.id === 'me')!;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  const handleShare = async (post: Post) => {
    try {
      await Share.share({
        message: `Regarde ce match sur Stream Your Sport : ${post.match?.finalScore ?? ''}`,
        url: `https://youtube.com/watch?v=${post.match?.youtubeVideoId}`,
      });
    } catch (e) {}
  };

  const livePost = posts.find(p => p.match?.isLive);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.logoRow}>
          <View style={styles.logoDot} />
          <Text style={styles.logoText}>Stream Your Sport</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Search')}
          hitSlop={8}
        >
          <Ionicons name="search-outline" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.lime}
            colors={[colors.lime]}
          />
        }
        ListHeaderComponent={
          <>
            {/* LIVE banner */}
            {livePost && livePost.match && (
              <TouchableOpacity
                style={styles.liveBanner}
                onPress={() => navigation.navigate('PostDetail', { postId: livePost.id })}
                activeOpacity={0.9}
              >
                <View style={styles.liveDot} />
                <Text style={styles.liveBannerText}>
                  {livePost.match.playersA[0]?.pseudo} est EN DIRECT au {livePost.match.club}
                </Text>
                <Ionicons name="chevron-forward" size={16} color={colors.live} />
              </TouchableOpacity>
            )}

            {/* Stories-like quick access */}
            <View style={styles.storyRow}>
              <TouchableOpacity style={styles.myStory}>
                <View style={styles.myStoryAvatar}>
                  <Avatar user={me} size={52} showBorder />
                  <View style={styles.addIcon}>
                    <Ionicons name="add" size={14} color={colors.textInverse} />
                  </View>
                </View>
                <Text style={styles.storyLabel}>Toi</Text>
              </TouchableOpacity>
              {MOCK_USERS.filter(u => u.id !== 'me').slice(0, 4).map(user => (
                <TouchableOpacity
                  key={user.id}
                  style={styles.myStory}
                  onPress={() => navigation.navigate('OtherProfile', { userId: user.id })}
                >
                  <View style={[styles.storyRing, user.isFollowing && styles.storyRingActive]}>
                    <Avatar user={user} size={52} />
                  </View>
                  <Text style={styles.storyLabel} numberOfLines={1}>{user.pseudo.slice(0, 8)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.sectionDivider}>
              <Text style={styles.sectionTitle}>Activité récente</Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <MatchCard
            post={item}
            onPress={() => navigation.navigate('PostDetail', { postId: item.id })}
            onComment={() => navigation.navigate('PostDetail', { postId: item.id })}
            onShare={() => handleShare(item)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="videocam-outline"
            title="Ton feed est vide"
            subtitle="Suis des membres pour voir leurs matchs et moments forts apparaître ici."
            ctaLabel="Trouver des membres"
            onCta={() => navigation.navigate('Search')}
          />
        }
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  logoDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.lime,
  },
  logoText: {
    color: colors.textPrimary,
    fontSize: typography.base,
    fontWeight: typography.extrabold,
    letterSpacing: 0.5,
  },
  liveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.live}15`,
    borderBottomWidth: 1,
    borderBottomColor: `${colors.live}30`,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.live,
  },
  liveBannerText: {
    flex: 1,
    color: colors.live,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  storyRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    gap: spacing.base,
  },
  myStory: {
    alignItems: 'center',
    gap: 4,
    width: 64,
  },
  myStoryAvatar: {
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.bgDeep,
  },
  storyRing: {
    padding: 2,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  storyRingActive: {
    borderColor: colors.lime,
  },
  storyLabel: {
    color: colors.textSecondary,
    fontSize: typography.xs,
    textAlign: 'center',
  },
  sectionDivider: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});
