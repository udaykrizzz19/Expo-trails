import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/app-context';
import { BottomBar } from '@/components/bottom-bar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { projects } = useApp();

  // Helper to render task group icons
  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'Office Project':
        return { name: 'briefcase', color: '#FF4C8B', bg: '#FFEBF0' }; // Pinkish
      case 'Personal Project':
        return { name: 'person', color: '#5C3BFF', bg: '#EEECFF' }; // Purple
      case 'Daily Study':
      default:
        return { name: 'book', color: '#FF9F1C', bg: '#FFF3E0' }; // Orange
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Decorative background blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobBottomLeft]} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Profile Header */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Image
                source={require('@/assets/images/user_avatar.png')}
                style={styles.avatar}
              />
              <View style={styles.profileText}>
                <Text style={styles.greetingLabel}>Hello!</Text>
                <Text style={styles.userName}>Livia Vaccaro</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
              <Ionicons name="notifications" size={24} color="#1E1A34" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          {/* Progress Banner */}
          <View style={styles.banner}>
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Your today's task{"\n"}almost done!</Text>
              <TouchableOpacity 
                style={styles.bannerBtn} 
                activeOpacity={0.9}
                onPress={() => router.push('/tasks')}
              >
                <Text style={styles.bannerBtnText}>View Task</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.bannerRight}>
              {/* Progress Circle Ring */}
              <View style={styles.progressRingOuter}>
                <View style={[styles.progressRingSegment, styles.progressRingSegLeft]} />
                <View style={[styles.progressRingSegment, styles.progressRingSegRight]} />
                <View style={styles.progressRingInner}>
                  <Text style={styles.progressPercentText}>85%</Text>
                </View>
              </View>
              {/* Ellipsis menu */}
              <TouchableOpacity style={styles.bannerEllipsis} activeOpacity={0.7}>
                <Ionicons name="ellipsis-horizontal" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* In Progress Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>In Progress</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>6</Text>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {projects.slice(0, 2).map((project, idx) => {
              const iconData = getGroupIcon(project.group);
              const isBlue = idx === 0;

              return (
                <View 
                  key={project.id} 
                  style={[
                    styles.projectCard, 
                    isBlue ? styles.projectCardBlue : styles.projectCardOrange
                  ]}
                >
                  <View style={styles.projectCardHeader}>
                    <Text style={styles.projectGroupText}>{project.group}</Text>
                    <View style={[styles.projectCardIconContainer, { backgroundColor: iconData.bg }]}>
                      <Ionicons name={iconData.name as any} size={16} color={iconData.color} />
                    </View>
                  </View>
                  
                  <Text style={styles.projectTitle} numberOfLines={2}>
                    {project.name}
                  </Text>
                  
                  <View style={styles.projectProgressContainer}>
                    <View style={styles.progressBarBg}>
                      <View 
                        style={[
                          styles.progressBarFill, 
                          { 
                            width: `${project.progress}%`,
                            backgroundColor: isBlue ? '#007FFF' : '#FF6B35'
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* Task Groups Section */}
          <View style={[styles.sectionHeader, { marginTop: 12 }]}>
            <Text style={styles.sectionTitle}>Task Groups</Text>
            <View style={[styles.countBadge, { backgroundColor: '#F1EFFF' }]}>
              <Text style={[styles.countBadgeText, { color: '#5C3BFF' }]}>4</Text>
            </View>
          </View>

          <View style={styles.taskGroupsList}>
            {projects.map((project) => {
              const iconData = getGroupIcon(project.group);
              return (
                <View key={project.id} style={styles.groupItem}>
                  <View style={styles.groupItemLeft}>
                    <View style={[styles.groupIconContainer, { backgroundColor: iconData.bg }]}>
                      <Ionicons name={iconData.name as any} size={22} color={iconData.color} />
                    </View>
                    <View style={styles.groupTextContainer}>
                      <Text style={styles.groupName}>{project.group}</Text>
                      <Text style={styles.groupTasksCount}>{project.tasksCount} Tasks</Text>
                    </View>
                  </View>
                  
                  {/* Task Group Progress Circle */}
                  <View style={[styles.groupProgressCircle, { borderColor: iconData.color + '30' }]}>
                    <View style={[styles.groupProgressCircleFill, { borderColor: iconData.color }]} />
                    <Text style={[styles.groupProgressText, { color: iconData.color }]}>
                      {project.progress}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Custom Bottom Navigation Bar */}
      <BottomBar activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 110, // Ensure space for floating bottom bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#DDD',
  },
  profileText: {
    justifyContent: 'center',
  },
  greetingLabel: {
    fontSize: 13,
    color: '#7C7890',
    fontWeight: '500',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E1A34',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 13,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#5C3BFF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  /* Purple Progress Banner */
  banner: {
    backgroundColor: '#5C3BFF',
    marginHorizontal: 24,
    marginTop: 16,
    borderRadius: 28,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#5C3BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  bannerLeft: {
    flex: 1.2,
    gap: 16,
  },
  bannerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  bannerBtn: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: '#5C3BFF',
    fontSize: 13,
    fontWeight: '700',
  },
  bannerRight: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bannerEllipsis: {
    position: 'absolute',
    top: -24,
    right: -8,
    padding: 8,
  },
  progressRingOuter: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Light background track
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  progressRingSegment: {
    position: 'absolute',
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: '#FFFFFF',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  progressRingSegLeft: {
    transform: [{ rotate: '45deg' }],
  },
  progressRingSegRight: {
    transform: [{ rotate: '180deg' }],
    opacity: 0.5,
  },
  progressRingInner: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressPercentText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  /* Section Header */
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 26,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E1A34',
  },
  countBadge: {
    backgroundColor: '#EAE6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5C3BFF',
  },
  /* Horizontal Scroll active project cards */
  horizontalScroll: {
    paddingLeft: 24,
    paddingRight: 8,
    marginTop: 14,
    gap: 16,
  },
  projectCard: {
    width: width * 0.54,
    maxWidth: 220,
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  projectCardBlue: {
    backgroundColor: '#EAF4FF',
  },
  projectCardOrange: {
    backgroundColor: '#FFEFEA',
  },
  projectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  projectGroupText: {
    fontSize: 12,
    color: '#7C7890',
    fontWeight: '500',
  },
  projectCardIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1A34',
    lineHeight: 22,
    height: 44, // Align heights for two lines
  },
  projectProgressContainer: {
    marginTop: 4,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
    width: '100%',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  /* Task Groups list style */
  taskGroupsList: {
    paddingHorizontal: 24,
    marginTop: 14,
    gap: 12,
  },
  groupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  groupItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  groupIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTextContainer: {
    justifyContent: 'center',
    gap: 4,
  },
  groupName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1A34',
  },
  groupTasksCount: {
    fontSize: 12,
    color: '#A29EB6',
    fontWeight: '500',
  },
  groupProgressCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  groupProgressCircleFill: {
    position: 'absolute',
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 3,
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  groupProgressText: {
    fontSize: 11,
    fontWeight: '700',
  },
  /* Decorative Blobs */
  blob: {
    position: 'absolute',
    borderRadius: 200,
    opacity: 0.1,
  },
  blobTopRight: {
    top: -80,
    right: -80,
    width: 300,
    height: 300,
    backgroundColor: '#EBE8FF',
  },
  blobBottomLeft: {
    bottom: 40,
    left: -100,
    width: 250,
    height: 250,
    backgroundColor: '#E3F2FD',
  },
});
