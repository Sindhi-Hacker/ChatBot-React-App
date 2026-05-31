/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Drawer } from '@react-navigation/drawer';
import { useColorScheme } from 'react-native';

export default function DrawerLayout() {
  const scheme = useColorScheme();
  const themeColors = {
    background: scheme === 'dark' ? '#0e0e11' : '#f8f9fa',
    text: scheme === 'dark' ? '#ffffff' : '#111827',
    primary: scheme === 'dark' ? '#6366f1' : '#4f46e5',
  };

  return (
    <Drawer
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        drawerStyle: {
          backgroundColor: themeColors.background,
          width: 280,
        },
        drawerActiveTintColor: themeColors.primary,
        drawerInactiveTintColor: '#6b7280',
      }}
    >
      <Drawer.Screen 
        name="index" 
        options={{ title: 'Dashboard' }} 
      />
      <Drawer.Screen 
        name="chat" 
        options={{ title: 'AI Chat' }} 
      />
      <Drawer.Screen 
        name="image-gen" 
        options={{ title: 'Image Generation' }} 
      />
      <Drawer.Screen 
        name="models" 
        options={{ title: 'AI Models' }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ title: 'Settings' }} 
      />
    </Drawer>
  );
}
