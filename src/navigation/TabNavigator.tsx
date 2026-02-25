import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../constants/colors';
import { typography, spacing } from '../constants/theme';

// Stack navigators for each tab
import { FeedStack } from './stacks/FeedStack';
import { MatchesStack } from './stacks/MatchesStack';
import { NotificationsStack } from './stacks/NotificationsStack';
import { ProfileStack } from './stacks/ProfileStack';

export type TabParamList = {
  FeedTab: undefined;
  MatchesTab: undefined;
  NotificationsTab: undefined;
  ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TABS = [
  {
    name: 'FeedTab' as const,
    label: 'Feed',
    icon: 'home',
    activeIcon: 'home',
    component: FeedStack,
  },
  {
    name: 'MatchesTab' as const,
    label: 'Mes Matchs',
    icon: 'videocam-outline',
    activeIcon: 'videocam',
    component: MatchesStack,
  },
  {
    name: 'NotificationsTab' as const,
    label: 'Notifs',
    icon: 'notifications-outline',
    activeIcon: 'notifications',
    component: NotificationsStack,
    badge: 3,
  },
  {
    name: 'ProfileTab' as const,
    label: 'Profil',
    icon: 'person-outline',
    activeIcon: 'person',
    component: ProfileStack,
  },
];

export function TabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.bgDeep,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60 + (insets.bottom > 0 ? insets.bottom : 8),
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.lime,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: typography.xs,
          fontWeight: typography.medium,
          marginTop: 2,
        },
      }}
    >
      {TABS.map(tab => (
        <Tab.Screen
          key={tab.name}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.label,
            tabBarIcon: ({ focused, color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons
                  name={(focused ? tab.activeIcon : tab.icon) as keyof typeof Ionicons.glyphMap}
                  size={24}
                  color={color}
                />
                {tab.badge && !focused ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </View>
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: colors.live,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.textPrimary,
    fontSize: 9,
    fontWeight: typography.bold,
  },
});
