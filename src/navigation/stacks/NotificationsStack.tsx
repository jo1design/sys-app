import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotificationsScreen } from '../../screens/notifications/NotificationsScreen';
import { PostDetailScreen } from '../../screens/feed/PostDetailScreen';
import { OtherProfileScreen } from '../../screens/profile/OtherProfileScreen';
import { NotificationSettingsScreen } from '../../screens/settings/NotificationSettingsScreen';

export type NotificationsStackParamList = {
  Notifications: undefined;
  PostDetail: { postId: string };
  OtherProfile: { userId: string };
  NotifSettings: undefined;
};

const Stack = createNativeStackNavigator<NotificationsStackParamList>();

export function NotificationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      <Stack.Screen name="NotifSettings" component={NotificationSettingsScreen} />
    </Stack.Navigator>
  );
}
