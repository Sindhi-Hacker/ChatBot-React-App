/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, useColorScheme } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    // Attempt standard enterprise validation check of secure token cache on launch
    async function checkAuthSession() {
      try {
        const sessionToken = await SecureStore.getItemAsync('user_session_token');
        if (sessionToken) {
          console.log('Secure authenticated cloud state found natively.');
        }
      } catch (error) {
        console.error('SecureStore storage unreachable:', error);
      }
    }
    checkAuthSession();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="auth/index" options={{ presentation: 'modal' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
