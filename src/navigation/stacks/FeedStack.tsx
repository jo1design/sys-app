import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../../screens/feed/FeedScreen';
import { PostDetailScreen } from '../../screens/feed/PostDetailScreen';
import { OtherProfileScreen } from '../../screens/profile/OtherProfileScreen';
import { FollowListScreen } from '../../screens/profile/FollowListScreen';
import { SearchScreen } from '../../screens/search/SearchScreen';
import { MatchDetailScreen } from '../../screens/matches/MatchDetailScreen';

export type FeedStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  OtherProfile: { userId: string };
  FollowList: { userId: string; type: 'followers' | 'following' };
  Search: undefined;
  MatchDetail: { matchId: string };
};

const Stack = createNativeStackNavigator<FeedStackParamList>();

export function FeedStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Feed" component={FeedScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
      <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      <Stack.Screen name="FollowList" component={FollowListScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
    </Stack.Navigator>
  );
}
