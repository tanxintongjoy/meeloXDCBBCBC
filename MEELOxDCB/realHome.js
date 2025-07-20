import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Modal,
  TextInput,
  Alert,
  NativeModules,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { InstalledAppsModule } = NativeModules;

const ScreenTimeApp = () => {
  const [appUsage, setAppUsage] = useState([]);
  const [showAddAppModal, setShowAddAppModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('📱');
  const [selectedColor, setSelectedColor] = useState('#69C9FF');

  const availableIcons = ['📱', '🎵', '📷', '🎮', '💬'];
  const availableColors = ['#69C9FF', '#FF6B6B', '#4ECDC4', '#25D366'];

  useEffect(() => {
    const loadApps = async () => {
      try {
        const apps = await InstalledAppsModule.getInstalledApps();
        const parsed = typeof apps === 'string' ? JSON.parse(apps) : apps;

        const formattedApps = parsed.map((app, index) => ({
          id: index + 1,
          name: app.name,
          icon: '📱',
          color: '#69C9FF',
          todayTime: 0,
          averageSession: 15,
          currentSession: 0,
          isActive: false,
        }));

        setAppUsage(formattedApps);
      } catch (error) {
        console.error("Failed to fetch installed apps:", error);
        Alert.alert("Error", "Unable to load installed apps.");
      }
    };

    loadApps();
  }, []);

  const handleAddApp = () => {
    if (!newAppName.trim()) {
      Alert.alert('Error', 'Please enter an app name');
      return;
    }

    const newApp = {
      id: appUsage.length + 1,
      name: newAppName,
      icon: selectedIcon,
      color: selectedColor,
      todayTime: 0,
      averageSession: 15,
      currentSession: 0,
      isActive: false,
    };

    setAppUsage([...appUsage, newApp]);
    setNewAppName('');
    setSelectedIcon('📱');
    setSelectedColor('#69C9FF');
    setShowAddAppModal(false);
    Alert.alert('Success', `${newAppName} has been added!`);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const AppUsageItem = ({ app }) => (
    <View style={styles.appUsageItem}>
      <View style={styles.appInfo}>
        <View style={styles.appIcon}>
          <Text style={styles.appIconText}>{app.icon}</Text>
        </View>
        <View style={styles.appDetails}>
          <Text style={styles.appName}>{app.name}</Text>
          <Text style={styles.timeText}>
            Today: {formatTime(app.todayTime)}
            {app.isActive && <Text style={styles.activeText}> • Active</Text>}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>ScreenTimeApp</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddAppModal(true)}
          >
            <Ionicons name="add" size={30} color="#333" />
          </TouchableOpacity>
        </View>

        {appUsage.map((app, index) => (
          <AppUsageItem key={index} app={app} />
        ))}

        <Modal
          visible={showAddAppModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowAddAppModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New App</Text>
              <TextInput
                style={styles.textInput}
                placeholder="App Name"
                value={newAppName}
                onChangeText={setNewAppName}
              />

              <View style={styles.row}>
                {availableIcons.map((icon, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedIcon(icon)}
                    style={[
                      styles.iconOption,
                      selectedIcon === icon && styles.selectedIcon,
                    ]}
                  >
                    <Text style={styles.iconText}>{icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.row}>
                {availableColors.map((color, i) => (
                  <TouchableOpacity
                    key={i}
                    onPress={() => setSelectedColor(color)}
                    style={[
                      styles.colorOption,
                      { backgroundColor: color },
                      selectedColor === color && styles.selectedColor,
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.confirmButton} onPress={handleAddApp}>
                <Text style={styles.confirmButtonText}>Add App</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5', paddingTop: 40 },
  scrollView: { paddingHorizontal: 20 },
  headerRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20,
  },
  title: { fontSize: 28, fontWeight: 'bold' },
  addButton: {
    backgroundColor: '#FFD700', padding: 8, borderRadius: 10,
  },
  appUsageItem: {
    backgroundColor: '#FFF9E6', borderRadius: 10, padding: 15, marginBottom: 10,
  },
  appInfo: { flexDirection: 'row', alignItems: 'center' },
  appIcon: {
    backgroundColor: '#FFF', borderRadius: 10, width: 40, height: 40,
    justifyContent: 'center', alignItems: 'center', marginRight: 10,
  },
  appIconText: { fontSize: 20 },
  appDetails: { flex: 1 },
  appName: { fontSize: 18, fontWeight: 'bold' },
  timeText: { fontSize: 14, color: '#555' },
  activeText: { color: 'green', fontWeight: 'bold' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center',
  },
  modalContent: {
    width: '90%', backgroundColor: '#FFF', borderRadius: 15, padding: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  textInput: {
    borderWidth: 1, borderColor: '#DDD', borderRadius: 8, padding: 10, marginBottom: 10,
  },
  row: { flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' },
  iconOption: {
    backgroundColor: '#EEE', padding: 10, borderRadius: 10, marginRight: 10, marginBottom: 10,
  },
  selectedIcon: { backgroundColor: '#ADD8E6' },
  iconText: { fontSize: 20 },
  colorOption: {
    width: 40, height: 40, borderRadius: 20, marginRight: 10,
    borderWidth: 2, borderColor: 'transparent',
  },
  selectedColor: { borderColor: '#000' },
  confirmButton: {
    backgroundColor: '#007AFF', padding: 12, borderRadius: 10, alignItems: 'center',
  },
  confirmButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
});

export default ScreenTimeApp;
