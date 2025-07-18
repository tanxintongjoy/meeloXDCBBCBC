import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, SafeAreaView, Alert, PermissionsAndroid, Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import InstalledApplication from 'react-native-installed-application';
import UsageStats from 'react-native-usage-stats';

const emojiMap = {
  instagram: '📷',
  tiktok: '🎵',
  whatsapp: '💬',
  brawlstars: '🎮',
  youtube: '📺',
  netflix: '🎬',
  default: '📱'
};

const colorList = ['#69C9FF', '#FF6B6B', '#4ECDC4', '#25D366', '#FFD700', '#FF69B4'];

export default function RealApp() {
  const [appUsage, setAppUsage] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.PACKAGE_USAGE_STATS
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission required',
            'Enable usage access in settings to view screen time.',
            [
              { text: 'Go to Settings', onPress: () => Linking.openSettings() },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          return;
        }

        const apps = await InstalledApplication.getApps();
        const stats = await UsageStats.getUsageStats();

        const selectedApps = apps
          .filter(app => !app.systemApp)
          .slice(0, 5)
          .map((app, index) => {
            const pkg = app.packageName.toLowerCase();
            const emojiKey = Object.keys(emojiMap).find(key => pkg.includes(key)) || 'default';
            const timeMs = stats[app.packageName]?.totalTimeInForeground || 0;

            return {
              id: app.packageName,
              name: app.appName,
              icon: emojiMap[emojiKey],
              color: colorList[index % colorList.length],
              todayTime: Math.floor(timeMs / 60000),
              dailyGoal: 60,
              currentSession: 0,
              isActive: false,
            };
          });

        setAppUsage(selectedApps);
      } catch (error) {
        console.error('Error fetching apps or stats:', error);
        Alert.alert('Error', 'Could not fetch installed apps or usage stats.');
      }
    };

    fetchApps();
  }, []);

  const showNotification = (appName, timeLeft) => {
    const newNotification = {
      id: Date.now(),
      message: `Only ${timeLeft} min left for ${appName} today`,
      timestamp: new Date().toLocaleTimeString(),
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
  };

  const simulateAppUsage = (appId) => {
    setAppUsage(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const newTodayTime = app.todayTime + 1;
          const timeLeft = app.dailyGoal - newTodayTime;

          if ([30, 15, 5, 0].includes(timeLeft)) {
            showNotification(app.name, timeLeft);
          }

          return {
            ...app,
            currentSession: app.currentSession + 1,
            todayTime: newTodayTime,
            isActive: true,
          };
        }
        return { ...app, isActive: false };
      })
    );
  };

  const startAppSession = (appId) => {
    const interval = setInterval(() => simulateAppUsage(appId), 1000);
    setTimeout(() => clearInterval(interval), 30000);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const AppUsageItem = ({ app }) => {
    const progressPercentage = Math.min((app.todayTime / app.dailyGoal) * 100, 100);
    const isOverGoal = app.todayTime > app.dailyGoal;
    const timeRemaining = app.dailyGoal - app.todayTime;

    return (
      <View style={styles.appUsageItem}>
        <View style={styles.appInfo}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>{app.icon}</Text>
          </View>
          <View style={styles.appDetails}>
            <Text style={styles.appName}>{app.name}</Text>
            <Text style={styles.timeText}>
              Used: {formatTime(app.todayTime)} / {formatTime(app.dailyGoal)}
              {app.isActive && <Text style={styles.activeText}> • Active</Text>}
            </Text>
            {isOverGoal ? (
              <Text style={styles.overGoalText}>Over by {formatTime(app.todayTime - app.dailyGoal)}</Text>
            ) : (
              <Text style={styles.remainingText}>{formatTime(timeRemaining)} remaining</Text>
            )}
            {app.currentSession > 0 && (
              <Text style={styles.sessionText}>Current session: {formatTime(app.currentSession)}</Text>
            )}
          </View>
          <TouchableOpacity
            style={[styles.demoButton, app.isActive && styles.demoButtonActive]}
            onPress={() => startAppSession(app.id)}
          >
            <Text style={styles.demoButtonText}>{app.isActive ? 'Active' : 'Demo'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { backgroundColor: app.color + '20' }]}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercentage}%`,
                  backgroundColor: isOverGoal ? '#FF5252' : app.color
                }
              ]}
            />
          </View>
        </View>
        {isOverGoal && (
          <Text style={styles.overGoalStatus}>Goal exceeded!</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Tracked Apps</Text>
        {appUsage.map((app) => (
          <AppUsageItem key={app.id} app={app} />
        ))}
        {notifications.length > 0 && (
          <View style={styles.notificationsSection}>
            <Text style={styles.notificationsTitle}>Recent Notifications</Text>
            {notifications.map(notification => (
              <View key={notification.id} style={styles.notificationItem}>
                <Text style={styles.notificationText}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.timestamp}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContainer: {
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  appUsageItem: {
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  appInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  appIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#F1F1F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIconText: {
    fontSize: 22,
  },
  appDetails: {
    flex: 1,
    marginLeft: 12,
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timeText: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  activeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  remainingText: {
    fontSize: 12,
    color: '#4CAF50',
  },
  overGoalText: {
    fontSize: 12,
    color: '#FF5252',
    fontWeight: 'bold',
  },
  sessionText: {
    fontSize: 12,
    color: '#FF9800',
  },
  demoButton: {
    backgroundColor: '#E0E0E0',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  demoButtonActive: {
    backgroundColor: '#4CAF50',
  },
  demoButtonText: {
    fontSize: 12,
    color: '#FFF',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#EEE',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  overGoalStatus: {
    marginTop: 6,
    fontSize: 12,
    textAlign: 'center',
    color: '#FF5252',
    fontWeight: 'bold',
  },
  notificationsSection: {
    marginTop: 20,
  },
  notificationsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  notificationItem: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});
