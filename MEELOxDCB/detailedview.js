import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function DetailedInfo() {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      const response = await fetch(
        'https://api.sheetbest.com/sheets/0a5e867e-2e01-4211-a422-066db24730ad'
      );
      const data = await response.json();
      if (data.length > 0) {
        setEvent(data[0]); {/*most recent data*/}
      } else {
        Alert.alert('No data', 'No announcement found.');
      }
    } catch (error) {
      console.error('Fetch error:', error);
      Alert.alert('Error', 'Could not load event.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading announcement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No event data available.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* go back button */}
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>

        {/* header */}
        <Text style={styles.title}>{event.title || 'DCB Event!'}</Text>

        {/* brief description/sub */}
        <Text style={styles.subtitle}>
          Igniting passion in little kids! and stuff
        </Text>


        <Text style={styles.description}>
          {event.description || 'No additional info.'}
        </Text>

        {/* images Gallery */}
        {event.image?.startsWith('http') && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[event.image].map((uri, index) => (
              <Image
                key={index}
                source={{ uri }}
                style={styles.image}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
        )}

        {/* Contact */}
        <Text style={styles.contact}>
          {event.Contacts || 'No contact info'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 10,
    width: 36,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
    marginBottom: 20,
  },
  image: {
    width: 250,
    height: 140,
    borderRadius: 10,
    marginRight: 12,
  },
  contact: {
    fontSize: 14,
    color: '#888',
    marginTop: 30,
    textAlign: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 40,
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
