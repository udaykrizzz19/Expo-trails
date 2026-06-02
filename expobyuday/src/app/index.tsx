import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* Premium Background Blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobMiddleLeft]} />
      <View style={[styles.blob, styles.blobBottomRight]} />
      <View style={[styles.blob, styles.blobTopLeft]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Greeting */}
          <Text style={styles.headerGreeting}>Hey Welcome To LifePulse</Text>

          {/* Onboarding Illustration Wrapper */}
          <View style={styles.illustrationContainer}>
            <Image
              source={require('@/assets/images/onboarding_illustration.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <Text style={styles.title}>Task Management &{"\n"}To-Do List</Text>
            <Text style={styles.description}>
              This productive tool is designed to help you better manage your task project-wise conveniently!
            </Text>
          </View>

          {/* Let's Start Button */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.replace('/home')}
          >
            <Text style={styles.buttonText}>Let's Start</Text>
            <View style={styles.buttonIconContainer}>
              <Ionicons name="arrow-forward" size={20} color="#5C3BFF" />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  headerGreeting: {
    fontSize: 16,
    fontWeight: '600',
    color: '#A29EB6',
    marginTop: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: '100%',
    maxHeight: height * 0.45,
  },
  illustration: {
    width: width * 0.85,
    height: width * 0.85,
    maxHeight: 320,
    maxWidth: 320,
  },
  textContainer: {
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    color: '#1E1A34',
    lineHeight: 40,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'normal',
  },
  description: {
    fontSize: 15,
    color: '#7C7890',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5C3BFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 20,
    width: '100%',
    maxWidth: 320,
    shadowColor: '#5C3BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginRight: 10,
  },
  buttonIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  /* Background Blobs for Premium Glassmorphism styling */
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.15,
  },
  blobTopRight: {
    top: -50,
    right: -50,
    width: 250,
    height: 250,
    backgroundColor: '#EBE8FF', // Soft purple
  },
  blobMiddleLeft: {
    top: height * 0.3,
    left: -80,
    width: 200,
    height: 200,
    backgroundColor: '#E3F2FD', // Soft blue
  },
  blobBottomRight: {
    bottom: -60,
    right: -60,
    width: 280,
    height: 280,
    backgroundColor: '#FFFDE7', // Soft yellow
  },
  blobTopLeft: {
    top: 50,
    left: -40,
    width: 120,
    height: 120,
    backgroundColor: '#E8F5E9', // Soft green
  },
});
