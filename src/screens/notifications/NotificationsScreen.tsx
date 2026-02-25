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
import { LiveBadge } from '../../components/LiveBadge';
import { EmptyState } from '../../components/EmptyState';
import { MOCK_NOTIFICATIONS, Notification, formatRelativeTime } from '../../data/mockData';

const NOTIF_ICONS: Record<Notification['type'], { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
  live: { icon: 'radio', color: '#FF3B30' },
  moment_fort: { icon: 'star', color: '#C5FF00' },
  follower: { icon: 'person-add', color: '#5E5CE6' },
  like: { icon: 'heart', color: '#FF375F' },
  comment: { icon: 'chatbubble', color: '#64D2FF' },
  replay: { icon: 'play-circle', color: '#9A9A9A' },
};

interface NotificationsScreenProps {
  navigation: any;
}

export function NotificationsScreen({ navigation }: NotificationsScreenProps) {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleNotifPress = (notif: Notification) => {
    markRead(notif.id);
    if (notif.match) {
      navigation.navigate('PostDetail', { postId: 'p1' });
    } else if (notif.fromUser) {
      navigation.navigate('OtherProfile', { userId: notif.fromUser.id });
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>Notifications</Text>
          {unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} hitSlop={8}>
              <Text style={styles.markAllText}>Tout lire</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => navigation.navigate('NotifSettings')}
            hitSlop={8}
          >
            <Ionicons name="settings-outline" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
        renderItem={({ item }) => {
          const iconConfig = NOTIF_ICONS[item.type];
          return (
            <TouchableOpacity
              style={[styles.notifRow, !item.isRead && styles.notifUnread]}
              onPress={() => handleNotifPress(item)}
              activeOpacity={0.8}
            >
              {/* Left indicator */}
              {!item.isRead && <View style={styles.unreadDot} />}

              {/* Icon */}
              <View style={[styles.notifIcon, { backgroundColor: `${iconConfig.color}20` }]}>
                <Ionicons name={iconConfig.icon} size={18} color={iconConfig.color} />
              </View>

              {/* Avatar */}
              {item.fromUser && (
                <Avatar user={item.fromUser} size={36} />
              )}
              {!item.fromUser && (
                <View style={styles.sysAvatar}>
                  <Ionicons name="videocam" size={18} color={colors.lime} />
                </View>
              )}

              {/* Content */}
              <View style={styles.notifContent}>
                <Text style={[styles.notifMessage, !item.isRead && styles.notifMessageUnread]}>
                  {item.message}
                </Text>
                <Text style={styles.notifTime}>{formatRelativeTime(item.createdAt)}</Text>
              </View>

              {/* LIVE badge for live notifs */}
              {item.type === 'live' && <LiveBadge />}
              {/* Chevron for navigable notifs */}
              {item.type !== 'live' && (
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-outline"
            title="Pas de notifications"
            subtitle="Tu verras ici les likes, commentaires, matchs en live et moments forts de tes abonnements."
          />
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.xl,
    fontWeight: typography.extrabold,
  },
  unreadBadge: {
    backgroundColor: colors.live,
    borderRadius: radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    color: colors.textPrimary,
    fontSize: typography.xs,
    fontWeight: typography.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.base,
  },
  markAllText: {
    color: colors.lime,
    fontSize: typography.sm,
    fontWeight: typography.medium,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.sm,
    position: 'relative',
  },
  notifUnread: {
    backgroundColor: `${colors.lime}06`,
  },
  unreadDot: {
    position: 'absolute',
    left: 6,
    top: '50%',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.lime,
    marginTop: -3,
  },
  notifIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sysAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.limeDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
    gap: 2,
  },
  notifMessage: {
    color: colors.textSecondary,
    fontSize: typography.sm,
    lineHeight: 18,
  },
  notifMessageUnread: {
    color: colors.textPrimary,
    fontWeight: typography.medium,
  },
  notifTime: {
    color: colors.textMuted,
    fontSize: typography.xs,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
  },
});
