import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const WheelPicker = ({ value, onChange, items }) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const itemHeight = 40;

  const onMomentumScrollEnd = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, items.length - 1));
    onChange(items[clampedIndex]);
  };

  const selectedIndex = items.indexOf(value);

  return (
    <View style={styles.wheelWrapper}>
      <View style={styles.wheelHighlight} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onMomentumScrollEnd={onMomentumScrollEnd}
        contentOffset={{ y: selectedIndex * itemHeight }}
      >
        <View style={{ height: itemHeight * 2 }} />
        {items.map((item, index) => (
          <View key={index} style={styles.wheelItem}>
            <Text style={styles.wheelText}>{item.toString().padStart(2, '0')}</Text>
          </View>
        ))}
        <View style={{ height: itemHeight * 2 }} />
      </Animated.ScrollView>
    </View>
  );
};

const AppleTimePicker = ({ initialHours = 2, initialMinutes = 30, onTimeChange, maxHours = 12, minHours = 0 }) => {
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);

  useEffect(() => {
    onTimeChange && onTimeChange(hours, minutes);
  }, [hours, minutes]);

  const hoursArray = Array.from({ length: maxHours - minHours + 1 }, (_, i) => i + minHours);
  const minutesArray = Array.from({ length: 60 }, (_, i) => i);

  return (
    <View style={styles.pickerRow}>
      <WheelPicker value={hours} onChange={setHours} items={hoursArray} />
      <Text style={styles.unitLabel}>hours</Text>
      <WheelPicker value={minutes} onChange={setMinutes} items={minutesArray} />
      <Text style={styles.unitLabel}>min</Text>
    </View>
  );
};

const ReminderPicker = ({ value, onChange, options }) => {
  useEffect(() => {
    onChange && onChange(value);
  }, [value]);

  return (
    <View style={styles.pickerRow}>
      <WheelPicker value={value} onChange={onChange} items={options} />
      <Text style={styles.unitLabel}>min</Text>
    </View>
  );
};

const SettingsScreen = () => {
  const [screenTimeHours, setScreenTimeHours] = useState(2);
  const [screenTimeMinutes, setScreenTimeMinutes] = useState(30);
  const [reminderInterval, setReminderInterval] = useState(15);
  const [motivationalTips, setMotivationalTips] = useState(true);
  const [pomodoroBreaks, setPomodoroBreaks] = useState(true);
  const [showNickname, setShowNickname] = useState(true);
  const [onlyShowNickname, setOnlyShowNickname] = useState(false);

  const handleTimeChange = (h, m) => {
    setScreenTimeHours(h);
    setScreenTimeMinutes(m);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={styles.title}>Settings</Text>
                <View style={styles.section}></View>
         <Text style={styles.sectionTitle}>What is your goal screen time?</Text>
        <AppleTimePicker
          initialHours={screenTimeHours}
          initialMinutes={screenTimeMinutes}
          onTimeChange={handleTimeChange}
        />
        <Text style={styles.summary}>Current: {screenTimeHours}h {screenTimeMinutes}m</Text>
        <View style={styles.section}></View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reminders</Text>
          <ReminderPicker
            value={reminderInterval}
            onChange={setReminderInterval}
            options={[5, 10, 15, 30, 60]}
          />
          <Text style={styles.summary}>Interval: Every {reminderInterval} min</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivational Tips</Text>
          <Switch
            value={motivationalTips}
            onValueChange={setMotivationalTips}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={motivationalTips ? '#fff' : '#f4f3f4'}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pomodoro Breaks</Text>
          <Switch
            value={pomodoroBreaks}
            onValueChange={setPomodoroBreaks}
            trackColor={{ false: '#767577', true: '#007AFF' }}
            thumbColor={pomodoroBreaks ? '#fff' : '#f4f3f4'}
          />
          <Text style={styles.subText}>25 min work : 5 min rest</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <View style={styles.settingRow}>
            <Text style={styles.label}>Show Nickname</Text>
            <Switch
              value={showNickname}
              onValueChange={setShowNickname}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={showNickname ? '#fff' : '#f4f3f4'}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.label}>Only Show Nickname</Text>
            <Switch
              value={onlyShowNickname}
              onValueChange={setOnlyShowNickname}
              trackColor={{ false: '#767577', true: '#4CAF50' }}
              thumbColor={onlyShowNickname ? '#fff' : '#f4f3f4'}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 20,
  },
  summary: {
    fontSize: 16,
    color: '#555',
    marginTop: 10,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginTop: 5,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  unitLabel: {
    fontSize: 16,
    color: '#888',
    marginHorizontal: 8,
  },
  wheelWrapper: {
    width: 80,
    height: 200,
    overflow: 'hidden',
  },
  wheelHighlight: {
    position: 'absolute',
    top: 80,
    height: 40,
    width: '100%',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',
    zIndex: 1,
  },
  wheelItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wheelText: {
    fontSize: 20,
    color: '#333',
  },
  section: {
    marginTop: 30,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    color: '#444',
  },
});

export default SettingsScreen;
