import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '@/context/app-context';

export default function AddProjectScreen() {
  const router = useRouter();
  const { addProject } = useApp();

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  
  // Available groups: 'Office Project', 'Personal Project', 'Daily Study'
  const [group, setGroup] = useState<'Office Project' | 'Personal Project' | 'Daily Study'>('Office Project');
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const [startDate, setStartDate] = useState('01 May, 2022');
  const [endDate, setEndDate] = useState('30 June, 2022');

  const handleAddProject = () => {
    if (!projectName.trim()) {
      alert('Please enter a project name.');
      return;
    }

    addProject({
      name: projectName,
      description: description || 'No description provided.',
      group: group,
      startDate: startDate,
      endDate: endDate,
    });

    // Go back to the previous screen (Home dashboard)
    router.back();
  };

  const getGroupIcon = (g: string) => {
    switch (g) {
      case 'Office Project':
        return { name: 'briefcase', color: '#FF4C8B', bg: '#FFEBF0', label: 'Work' };
      case 'Personal Project':
        return { name: 'person', color: '#5C3BFF', bg: '#EEECFF', label: 'Personal' };
      case 'Daily Study':
      default:
        return { name: 'book', color: '#FF9F1C', bg: '#FFF3E0', label: 'Study' };
    }
  };

  const activeIcon = getGroupIcon(group);

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Decorative background blobs */}
        <View style={[styles.blob, styles.blobTopRight]} />
        <View style={[styles.blob, styles.blobBottomLeft]} />

        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backBtn} 
              activeOpacity={0.7}
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#1E1A34" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Project</Text>
            <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.7}>
              <Ionicons name="notifications" size={24} color="#1E1A34" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Task Group Dropdown Selector */}
            <View style={styles.fieldWrapper}>
              <TouchableOpacity 
                style={styles.groupSelector}
                activeOpacity={0.8}
                onPress={() => setShowGroupDropdown(!showGroupDropdown)}
              >
                <View style={styles.groupSelectorLeft}>
                  <View style={[styles.groupIconContainer, { backgroundColor: activeIcon.bg }]}>
                    <Ionicons name={activeIcon.name as any} size={20} color={activeIcon.color} />
                  </View>
                  <View style={styles.groupTextCol}>
                    <Text style={styles.groupFieldLabel}>Task Group</Text>
                    <Text style={styles.groupFieldValue}>{activeIcon.label}</Text>
                  </View>
                </View>
                <Ionicons 
                  name={showGroupDropdown ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#1E1A34" 
                />
              </TouchableOpacity>

              {/* Group Dropdown Menu Options */}
              {showGroupDropdown && (
                <View style={styles.dropdownMenu}>
                  {(['Office Project', 'Personal Project', 'Daily Study'] as const).map((g) => {
                    const icon = getGroupIcon(g);
                    return (
                      <TouchableOpacity
                        key={g}
                        style={styles.dropdownItem}
                        onPress={() => {
                          setGroup(g);
                          setShowGroupDropdown(false);
                        }}
                      >
                        <View style={[styles.groupIconContainerMini, { backgroundColor: icon.bg }]}>
                          <Ionicons name={icon.name as any} size={14} color={icon.color} />
                        </View>
                        <Text style={styles.dropdownItemText}>{icon.label}</Text>
                        {group === g && <Ionicons name="checkmark" size={16} color="#5C3BFF" />}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Project Name Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Project Name</Text>
              <TextInput
                style={styles.textInput}
                value={projectName}
                onChangeText={setProjectName}
                placeholder="Enter project name..."
                placeholderTextColor="#A29EB6"
              />
            </View>

            {/* Description Card */}
            <View style={styles.inputCard}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter project details..."
                placeholderTextColor="#A29EB6"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Start Date Selector */}
            <View style={styles.inputCardRow}>
              <View style={styles.dateIconWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#5C3BFF" />
              </View>
              <View style={styles.dateTextWrapper}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <Text style={styles.dateValue}>{startDate}</Text>
              </View>
              <Ionicons name="chevron-down" size={16} color="#7C7890" style={styles.dropdownArrowRight} />
            </View>

            {/* End Date Selector */}
            <View style={styles.inputCardRow}>
              <View style={styles.dateIconWrapper}>
                <Ionicons name="calendar-outline" size={20} color="#5C3BFF" />
              </View>
              <View style={styles.dateTextWrapper}>
                <Text style={styles.inputLabel}>End Date</Text>
                <Text style={styles.dateValue}>{endDate}</Text>
              </View>
              <Ionicons name="chevron-down" size={16} color="#7C7890" style={styles.dropdownArrowRight} />
            </View>

            {/* Logo Row Picker */}
            <View style={styles.logoRow}>
              <View style={styles.logoPreview}>
                <View style={styles.logoIconCircle}>
                  <Ionicons name="apps" size={18} color="#007FFF" />
                </View>
                <View style={styles.logoTextContainer}>
                  <Text style={styles.logoTitleBlue}>Grocery</Text>
                  <Text style={styles.logoTitleOrange}>shop</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.changeLogoBtn} activeOpacity={0.7}>
                <Text style={styles.changeLogoText}>Change Logo</Text>
              </TouchableOpacity>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.submitBtn}
              activeOpacity={0.8}
              onPress={handleAddProject}
            >
              <Text style={styles.submitBtnText}>Add Project</Text>
            </TouchableOpacity>
          </ScrollView>
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FAF9FF',
    overflow: 'hidden',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
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
  /* Dropdown Selector */
  fieldWrapper: {
    position: 'relative',
    zIndex: 999,
  },
  groupSelector: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  groupSelectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  groupIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTextCol: {
    justifyContent: 'center',
    gap: 2,
  },
  groupFieldLabel: {
    fontSize: 11,
    color: '#A29EB6',
    fontWeight: '500',
  },
  groupFieldValue: {
    fontSize: 15,
    color: '#1E1A34',
    fontWeight: '700',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 84,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 8,
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    zIndex: 1000,
    gap: 4,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  groupIconContainerMini: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E1A34',
    flex: 1,
  },
  /* Form Cards */
  inputCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    color: '#A29EB6',
    fontWeight: '600',
  },
  textInput: {
    fontSize: 16,
    color: '#1E1A34',
    fontWeight: '700',
    padding: 0,
  },
  textArea: {
    height: 90,
    fontWeight: '500',
    lineHeight: 22,
  },
  inputCardRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  dateIconWrapper: {
    marginRight: 16,
  },
  dateTextWrapper: {
    flex: 1,
    gap: 4,
  },
  dateValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E1A34',
  },
  dropdownArrowRight: {
    marginLeft: 'auto',
  },
  /* Logo row style */
  logoRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1E1A34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  logoPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EAF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTitleBlue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#007FFF',
  },
  logoTitleOrange: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF6B35',
    marginLeft: 4,
  },
  changeLogoBtn: {
    backgroundColor: '#F1EFFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  changeLogoText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#5C3BFF',
  },
  /* Submit Button */
  submitBtn: {
    backgroundColor: '#5C3BFF',
    paddingVertical: 18,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#5C3BFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
    marginTop: 10,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
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
    bottom: -80,
    left: -80,
    width: 250,
    height: 250,
    backgroundColor: '#E3F2FD',
  },
});
