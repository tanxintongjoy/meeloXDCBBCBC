import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const ScreenTimeTracker = () => {
  const [goalHours, setGoalHours] = useState(1);
  const [goalMinutes, setGoalMinutes] = useState(0);
  const [goalSeconds, setGoalSeconds] = useState(0);
  const [currentUsage, setCurrentUsage] = useState(32); // in minutes
  const [showPicker, setShowPicker] = useState(false);

  const usageData = [
    { time: "6h 45m", usage: 0, color: "#e5e7eb" },
    { time: "7h", usage: 15, color: "#3b82f6" },
    { time: "8h", usage: 25, color: "#3b82f6" },
    { time: "9h", usage: 10, color: "#60a5fa" },
    { time: "10h", usage: 30, color: "#1d4ed8" },
    { time: "11h", usage: 20, color: "#60a5fa" },
    { time: "12h", usage: 35, color: "#f59e0b" },
    { time: "1h", usage: 40, color: "#f59e0b" },
    { time: "2h", usage: 15, color: "#3b82f6" },
    { time: "3h", usage: 0, color: "#e5e7eb" },
    { time: "4h 34m", usage: 25, color: "#3b82f6" },
  ];

  const formatGoalTime = () => {
    if (goalHours === 0 && goalMinutes === 0) {
      return `${goalSeconds} sec`;
    } else if (goalHours === 0) {
      return `${goalMinutes} min`;
    } else if (goalMinutes === 0) {
      return `${goalHours} hour`;
    } else {
      return `${goalHours} hour ${goalMinutes} min`;
    }
  };

  const formatCurrentTime = () => {
    return `${currentUsage} min`;
  };

  const UsageChart = () => (
    <View style={styles.chartContainer}>
      <View style={styles.chartBars}>
        {usageData.map((data, index) => (
          <View key={index} style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                {
                  height: Math.max(data.usage * 2, 4),
                  backgroundColor: data.color,
                },
              ]}
            />
          </View>
        ))}
      </View>
      <View style={styles.timeLabels}>
        <Text style={styles.timeLabel}>6h 45m</Text>
        <Text style={styles.timeLabel}>4h 34m</Text>
      </View>
    </View>
  );

  const GoalPicker = () => (
    <Modal
      visible={showPicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPicker(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.pickerModal}>
          <Text style={styles.pickerTitle}>Set Goal Time</Text>

          <View style={styles.pickerContainer}>
            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Hours</Text>
              <Picker
                selectedValue={goalHours}
                onValueChange={setGoalHours}
                style={styles.picker}
              >
                {[...Array(24)].map((_, i) => (
                  <Picker.Item key={i} label={`${i}`} value={i} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Minutes</Text>
              <Picker
                selectedValue={goalMinutes}
                onValueChange={setGoalMinutes}
                style={styles.picker}
              >
                {[...Array(60)].map((_, i) => (
                  <Picker.Item key={i} label={`${i}`} value={i} />
                ))}
              </Picker>
            </View>

            <View style={styles.pickerColumn}>
              <Text style={styles.pickerLabel}>Seconds</Text>
              <Picker
                selectedValue={goalSeconds}
                onValueChange={setGoalSeconds}
                style={styles.picker}
              >
                {[...Array(60)].map((_, i) => (
                  <Picker.Item key={i} label={`${i}`} value={i} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.pickerButtons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.confirmButtonText}>Set Goal</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Text style={styles.backText}>back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Smart Screen Time Goal Tracker</Text>
          <TouchableOpacity style={styles.forwardButton}>
            <Text style={styles.forwardText}>{">"}</Text>
          </TouchableOpacity>
        </View>

        {/* Date */}
        <Text style={styles.dateText}>11 July 2025</Text>

        {/* Main Card */}
        <View style={styles.mainCard}>
          {/* App Icon and Name */}
          <View style={styles.appHeader}>
            <View style={styles.tiktokIcon}>
              <Text style={styles.tiktokText}>TikTok</Text>
            </View>
            <Text style={styles.appName}>TikTok</Text>
          </View>

          {/* Goal Section */}
          <View style={styles.goalSection}>
            <View style={styles.goalRow}>
              <Text style={styles.goalLabel}>Goal:</Text>
              <TouchableOpacity
                style={styles.goalValue}
                onPress={() => setShowPicker(true)}
              >
                <Text style={styles.goalText}>{formatGoalTime()}</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.currentLabel}>Current: {formatCurrentTime()}</Text>
          </View>

          {/* Usage Chart */}
          <UsageChart />

          {/* Badge Button */}
          <TouchableOpacity style={styles.badgeButton}>
            <Text style={styles.badgeButtonText}>
              hit 1 more goal to claim your badge!
            </Text>
          </TouchableOpacity>
        </View>

        {/* Features List */}
        <View style={styles.featuresList}>
          <Text style={styles.featureItem}>• Set screen time goals for specific apps</Text>
          <Text style={styles.featureItem}>• Get gentle reminders when you're nearing your limit</Text>
          <Text style={styles.featureItem}>• View daily summaries (e.g. "You hit 2/3 goals today!")</Text>
        </View>
      </ScrollView>

      <GoalPicker />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#ffffff",
  },
  backButton: {
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: "#374151",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
    textAlign: "center",
  },
  forwardButton: {
    padding: 8,
  },
  forwardText: {
    fontSize: 18,
    color: "#374151",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    marginVertical: 16,
  },
  mainCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  tiktokIcon: {
    width: 80,
    height: 80,
    backgroundColor: "#000000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  tiktokText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  appName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  goalSection: {
    marginBottom: 20,
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  goalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginRight: 12,
  },
  goalValue: {
    backgroundColor: "#fef3c7",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fbbf24",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  currentLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
  },
  chartContainer: {
    marginVertical: 20,
  },
  chartBars: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 100,
    marginBottom: 8,
  },
  barContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    marginHorizontal: 1,
  },
  bar: {
    width: "80%",
    borderRadius: 2,
    minHeight: 4,
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeLabel: {
    fontSize: 12,
    color: "#6b7280",
  },
  badgeButton: {
    backgroundColor: "#dbeafe",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  badgeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1e40af",
  },
  featuresList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  featureItem: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerModal: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    margin: 20,
    minWidth: 300,
  },
  pickerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  pickerColumn: {
    alignItems: "center",
    flex: 1,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  picker: {
    width: 80,
    height: 150,
  },
  pickerButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#374151",
  },
  confirmButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: "#3b82f6",
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "600",
  },
});

export default ScreenTimeTracker;
