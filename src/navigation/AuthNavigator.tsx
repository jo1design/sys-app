import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/auth/SplashScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { ChooseSportsScreen } from '../screens/onboarding/ChooseSportsScreen';
import { FindMembersScreen } from '../screens/onboarding/FindMembersScreen';
import { NotificationsPermScreen } from '../screens/onboarding/NotificationsPermScreen';
import { TabNavigator } from './TabNavigator';

export type AuthStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ChooseSports: undefined;
  FindMembers: undefined;
  NotificationsPermission: undefined;
  MainApp: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'fade' }}
      initialRouteName="Splash"
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <Stack.Screen name="ChooseSports" component={ChooseSportsScreen} />
      <Stack.Screen name="FindMembers" component={FindMembersScreen} />
      <Stack.Screen name="NotificationsPermission" component={NotificationsPermScreen} />
      <Stack.Screen
        name="MainApp"
        component={TabNavigator}
        options={{ animation: 'fade' }}
      />
    </Stack.Navigator>
  );
}
