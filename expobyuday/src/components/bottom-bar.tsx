import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BottomBarProps {
  activeTab: 'home' | 'calendar' | 'document' | 'people';
}

export function BottomBar({ activeTab }: BottomBarProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        {/* Home Tab */}
        <TouchableOpacity
          onPress={() => router.replace('/home')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'home' ? 'home' : 'home-outline'}
            size={26}
            color={activeTab === 'home' ? '#5C3BFF' : '#A29EB6'}
          />
        </TouchableOpacity>

        {/* Calendar Tab (Today's Tasks) */}
        <TouchableOpacity
          onPress={() => router.replace('/tasks')}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'calendar' ? 'calendar' : 'calendar-outline'}
            size={26}
            color={activeTab === 'calendar' ? '#5C3BFF' : '#A29EB6'}
          />
        </TouchableOpacity>

        {/* Center Placeholder to spacing out the floating button */}
        <View style={styles.centerPlaceholder} />

        {/* Documents Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'document' ? 'document-text' : 'document-text-outline'}
            size={26}
            color={activeTab === 'document' ? '#5C3BFF' : '#A29EB6'}
          />
        </TouchableOpacity>

        {/* People/Users Tab */}
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name={activeTab === 'people' ? 'people' : 'people-outline'}
            size={26}
            color={activeTab === 'people' ? '#5C3BFF' : '#A29EB6'}
          />
        </TouchableOpacity>
      </View>

      {/* Floating Plus Button */}
      <TouchableOpacity
        onPress={() => router.push('/add-project')}
        style={styles.floatingButton}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={32} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 100,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#F1EFFF', // Soft lavender tint
    height: 75,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
    shadowColor: '#5C3BFF',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  centerPlaceholder: {
    width: 65,
    height: '100%',
  },
  floatingButton: {
    position: 'absolute',
    top: -24, // Floats halfway above the bottom tab bar
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#5C3BFF', // Vibrant deep purple
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C3BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
});
