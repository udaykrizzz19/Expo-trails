import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useApp, Task } from '@/context/app-context';
import { BottomBar } from '@/components/bottom-bar';

const { width } = Dimensions.get('window');

interface DateItem {
  dayName: string;
  dayNum: string;
  monthAndDay: string; // matches Task.date format e.g. 'May 25'
}

const dates: DateItem[] = [
  { dayName: 'Fri', dayNum: '23', monthAndDay: 'May 23' },
  { dayName: 'Sat', dayNum: '24', monthAndDay: 'May 24' },
  { dayName: 'Sun', dayNum: '25', monthAndDay: 'May 25' },
  { dayName: 'Mon', dayNum: '26', monthAndDay: 'May 26' },
  { dayName: 'Tue', dayNum: '27', monthAndDay: 'May 27' },
];

export default function TasksScreen() {
  const router = useRouter();
  const { tasks, updateTaskStatus } = useApp();
  
  const [selectedDate, setSelectedDate] = useState<string>('May 25');
  const [selectedFilter, setSelectedFilter] = useState<'All' | 'To-do' | 'In Progress' | 'Done'>('All');

  // Cycle task status on click to make the app interactive
  const handleToggleStatus = (task: Task) => {
    const statusCycle: Record<Task['status'], Task['status']> = {
      'To-do': 'In Progress',
      'In Progress': 'Done',
      'Done': 'To-do',
    };
    updateTaskStatus(task.id, statusCycle[task.status]);
  };

  // Filter tasks based on selected date and filter category
  const filteredTasks = tasks.filter((task) => {
    const matchesDate = task.date === selectedDate;
    const matchesFilter = selectedFilter === 'All' || task.status === selectedFilter;
    return matchesDate && matchesFilter;
  });

  const getGroupIcon = (group: string) => {
    switch (group) {
      case 'Office Project':
        return { name: 'briefcase', color: '#FF4C8B', bg: '#FFEBF0' };
      case 'Personal Project':
        return { name: 'person', color: '#5C3BFF', bg: '#EEECFF' };
      case 'Daily Study':
      default:
        return { name: 'book', color: '#FF9F1C', bg: '#FFF3E0' };
    }
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Done':
        return { text: '#8E2DE2', bg: '#F1EFFF', label: 'Done' }; // Purple tint
      case 'In Progress':
        return { text: '#FF6B35', bg: '#FFEFEA', label: 'In Progress' }; // Orange tint
      case 'To-do':
      default:
        return { text: '#007FFF', bg: '#EAF4FF', label: 'To-do' }; // Blue tint
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Decorative background blobs */}
      <View style={[styles.blob, styles.blobTopRight]} />
      <View style={[styles.blob, styles.blobMiddleLeft]} />

      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            activeOpacity={0.7}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#1E1A34" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Today's Tasks</Text>
          <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
            <Ionicons name="notifications" size={24} color="#1E1A34" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Calendar Date Strip */}
          <View style={styles.dateStrip}>
            {dates.map((date, idx) => {
              const isSelected = date.monthAndDay === selectedDate;
              return (
                <TouchableOpacity
                  key={idx}
                  style={[styles.dateCard, isSelected && styles.dateCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDate(date.monthAndDay)}
                >
                  <Text style={[styles.dateDayName, isSelected && styles.dateDayNameSelected]}>
                    {date.dayName}
                  </Text>
                  <Text style={[styles.dateDayNum, isSelected && styles.dateDayNumSelected]}>
                    {date.dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Filter Tab Row */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterStrip}
          >
            {(['All', 'To-do', 'In Progress', 'Done'] as const).map((filter) => {
              const isSelected = selectedFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  style={[styles.filterBtn, isSelected && styles.filterBtnSelected]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedFilter(filter)}
                >
                  <Text style={[styles.filterText, isSelected && styles.filterTextSelected]}>
                    {filter === 'To-do' ? 'To do' : filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Tasks List */}
          <View style={styles.taskListContainer}>
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons name="checkmark-circle-outline" size={64} color="#A29EB6" />
                <Text style={styles.emptyText}>No tasks for this selection</Text>
              </View>
            ) : (
              filteredTasks.map((task) => {
                const iconData = getGroupIcon(task.group);
                const statusStyle = getStatusColor(task.status);

                return (
                  <View key={task.id} style={styles.taskCard}>
                    <View style={styles.taskCardLeft}>
                      <Text style={styles.taskProjectName}>{task.projectName}</Text>
                      <Text style={styles.taskTitle}>{task.title}</Text>
                      <View style={styles.timeRow}>
                        <Ionicons name="time-outline" size={14} color="#A29EB6" style={{ marginRight: 4 }} />
                        <Text style={styles.timeText}>{task.time}</Text>
                      </View>
                    </View>

                    <View style={styles.taskCardRight}>
                      <View style={[styles.projectIconContainer, { backgroundColor: iconData.bg }]}>
                        <Ionicons name={iconData.name as any} size={16} color={iconData.color} />
                      </View>

                      {/* Clickable interactive status pill */}
                      <TouchableOpacity
                        style={[styles.statusPill, { backgroundColor: statusStyle.bg }]}
                        activeOpacity={0.7}
                        onPress={() => handleToggleStatus(task)}
                      >
                        <Text style={[styles.statusPillText, { color: statusStyle.text }]}>
                          {statusStyle.label}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Custom Bottom Navigation Bar */}
      <BottomBar activeTab="calendar" />
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
    paddingBottom: 110, // Space for bottom bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
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
  /* Calendar Strip */
  dateStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 16,
  },
  dateCard: {
    width: (width - 48 - 40) / 5,
    height: 90,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  dateCardSelected: {
    backgroundColor: '#5C3BFF',
    shadowColor: '#5C3BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  dateDayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#A29EB6',
  },
  dateDayNameSelected: {
    color: '#FFFFFF',
    opacity: 0.8,
  },
  dateDayNum: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1E1A34',
  },
  dateDayNumSelected: {
    color: '#FFFFFF',
  },
  /* Filters strip */
  filterStrip: {
    paddingLeft: 24,
    paddingRight: 8,
    marginTop: 24,
    gap: 12,
    height: 44,
  },
  filterBtn: {
    paddingHorizontal: 22,
    height: 40,
    borderRadius: 14,
    backgroundColor: '#F1EFFF', // Soft lavender default
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnSelected: {
    backgroundColor: '#5C3BFF', // Deep purple selected
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3BFF',
  },
  filterTextSelected: {
    color: '#FFFFFF',
  },
  /* Tasks List styling */
  taskListContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
    gap: 16,
  },
  taskCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  taskCardLeft: {
    flex: 1,
    gap: 8,
  },
  taskProjectName: {
    fontSize: 11,
    color: '#A29EB6',
    fontWeight: '600',
    textTransform: 'none',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E1A34',
    lineHeight: 22,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#A29EB6',
    fontWeight: '500',
  },
  taskCardRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
    minHeight: 70,
  },
  projectIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    color: '#A29EB6',
    fontSize: 15,
    fontWeight: '500',
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
  blobMiddleLeft: {
    top: 250,
    left: -120,
    width: 250,
    height: 250,
    backgroundColor: '#E3F2FD',
  },
});
