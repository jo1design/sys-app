import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyProfileScreen } from '../../screens/profile/MyProfileScreen';
import { EditProfileScreen } from '../../screens/profile/EditProfileScreen';
import { FollowListScreen } from '../../screens/profile/FollowListScreen';
import { OtherProfileScreen } from '../../screens/profile/OtherProfileScreen';
import { PostDetailScreen } from '../../screens/feed/PostDetailScreen';
import { MatchDetailScreen } from '../../screens/matches/MatchDetailScreen';
import { AccountSettingsScreen } from '../../screens/settings/AccountSettingsScreen';
import { NotificationSettingsScreen } from '../../screens/settings/NotificationSettingsScreen';

export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  FollowList: { userId: string; type: 'followers' | 'following' };
  OtherProfile: { userId: string };
  PostDetail: { postId: string };
  MatchDetail: { matchId: string };
  Settings: undefined;
  NotifSettings: undefined;
};

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProfile" component={MyProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="FollowList" component={FollowListScreen} />
      <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
      <Stack.Screen name="Settings" component={AccountSettingsScreen} />
      <Stack.Screen name="NotifSettings" component={NotificationSettingsScreen} />
    </Stack.Navigator>
  );
}
