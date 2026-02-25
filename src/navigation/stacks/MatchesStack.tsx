import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MatchListScreen } from '../../screens/matches/MatchListScreen';
import { MatchDetailScreen } from '../../screens/matches/MatchDetailScreen';
import { OtherProfileScreen } from '../../screens/profile/OtherProfileScreen';
import { PostDetailScreen } from '../../screens/feed/PostDetailScreen';

export type MatchesStackParamList = {
  MatchList: undefined;
  MatchDetail: { matchId: string };
  OtherProfile: { userId: string };
  PostDetail: { postId: string };
};

const Stack = createNativeStackNavigator<MatchesStackParamList>();

export function MatchesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MatchList" component={MatchListScreen} />
      <Stack.Screen name="MatchDetail" component={MatchDetailScreen} />
      <Stack.Screen name="OtherProfile" component={OtherProfileScreen} />
      <Stack.Screen name="PostDetail" component={PostDetailScreen} />
    </Stack.Navigator>
  );
}
