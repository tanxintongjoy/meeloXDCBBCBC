import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 

const LeaderboardScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.centerContainer}>
        <Ionicons name="trophy-outline" size={80} color="#007AFF" />
        <Text style={styles.placeholderTitle}>Leaderboard</Text>
        <Text style={styles.placeholderText}>Rankings and scores will appear here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
});

export default LeaderboardScreen;
