import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigation/AuthNavigator';
import { colors } from './src/constants/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthNavigator />
        <StatusBar style="light" backgroundColor={colors.bgDeep} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
