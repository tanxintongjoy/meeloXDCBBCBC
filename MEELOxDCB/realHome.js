import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Header = () => (
  <View style={styles.header}>
    <Text style={styles.headerText}>Home</Text>
  </View>
);

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header />
      <View style={styles.centerContainer}>
        <Ionicons name="home-outline" size={80} color="#007AFF" />
        <Text style={styles.placeholderTitle}>Welcome to Home</Text>
        <Text style={styles.placeholderText}>Your dashboard content will go here</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default HomeScreen;
