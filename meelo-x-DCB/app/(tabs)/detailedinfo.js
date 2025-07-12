import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  Share,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export const options = {
  headerBackTitleVisible: false,
  headerTitle: 'Event Details',
  headerStyle: { backgroundColor: '#fff' },
  headerTintColor: '#333',
};

export default function DetailedInfo() {
  const params = useLocalSearchParams();
  let event = {};

  try {
    event = params.event ? JSON.parse(params.event) : {};
  } catch (e) {
    event = {};
  }

  // Share event details (simple text)
  const handleShare = async () => {
    try {
      const message = `
${event.title || event.name || 'Event'}
Organized by ${event.organizer || 'DCB'}

Date: ${event.date || 'TBD'}
Time: ${event.time || 'TBD'}
Location: ${event.location || 'TBD'}

${event.description || ''}
      `;
      await Share.share({ message });
    } catch (error) {
      Alert.alert('Error', 'Failed to share the event');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Event Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: event.image || 'https://via.placeholder.com/400x250' }}
            style={styles.eventImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {event.category || 'DCB Event'}
              </Text>
            </View>
          </View>
        </View>

        {/* Event Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.eventTitle}>
            {event.title || event.name || 'DCB Event'}
          </Text>

          <Text style={styles.organizer}>
            Organized by {event.organizer || 'DCB'}
          </Text>

          {/* Event Info Cards */}
          <View style={styles.infoCardsContainer}>
            <View style={styles.infoCard}>
              <Ionicons name="calendar-outline" size={24} color="#4A90E2" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Date & Time</Text>
                <Text style={styles.infoCardText}>{event.date || 'TBD'}</Text>
                <Text style={styles.infoCardText}>{event.time || 'Time TBD'}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Ionicons name="location-outline" size={24} color="#4A90E2" />
              <View style={styles.infoCardContent}>
                <Text style={styles.infoCardTitle}>Location</Text>
                <Text style={styles.infoCardText}>{event.location || 'Location TBD'}</Text>
              </View>
            </View>

            {event.duration && (
              <View style={styles.infoCard}>
                <Ionicons name="time-outline" size={24} color="#4A90E2" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardTitle}>Duration</Text>
                  <Text style={styles.infoCardText}>{event.duration}</Text>
                </View>
              </View>
            )}

            {event.contact && (
              <View style={styles.infoCard}>
                <Ionicons name="person-outline" size={24} color="#4A90E2" />
                <View style={styles.infoCardContent}>
                  <Text style={styles.infoCardTitle}>Contact</Text>
                  <Text style={styles.infoCardText}>{event.contact}</Text>
                </View>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.descriptionContainer}>
            <Text style={styles.descriptionTitle}>About This Event</Text>
            <Text style={styles.descriptionText}>
              {event.description || 'More details about this event will be available soon.'}
            </Text>
          </View>

          {/* Additional Info */}
          {(event.requirements || event.notes) && (
            <View style={styles.additionalInfoContainer}>
              <Text style={styles.additionalInfoTitle}>Additional Information</Text>

              {event.requirements && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Requirements:</Text>
                  <Text style={styles.infoSectionText}>{event.requirements}</Text>
                </View>
              )}

              {event.notes && (
                <View style={styles.infoSection}>
                  <Text style={styles.infoSectionTitle}>Notes:</Text>
                  <Text style={styles.infoSectionText}>{event.notes}</Text>
                </View>
              )}
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => alert('Add to calendar feature coming soon')}>
              <Ionicons name="calendar-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Add to Calendar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#4A90E2" />
              <Text style={styles.secondaryButtonText}>Share Event</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  scrollContainer: { paddingBottom: 20 },
  imageContainer: { position: 'relative', height: 250, backgroundColor: '#e0e0e0' },
  eventImage: { width: '100%', height: '100%' },
  imageOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', justifyContent: 'flex-end', padding: 20,
  },
  categoryBadge: {
    backgroundColor: 'rgba(74, 144, 226, 0.9)',
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, alignSelf: 'flex-start',
  },
  categoryText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  detailsContainer: {
    backgroundColor: '#fff', marginTop: -20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingTop: 25,
  },
  eventTitle: { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  organizer: { fontSize: 16, color: '#666', marginBottom: 25 },
  infoCardsContainer: { marginBottom: 25 },
  infoCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8f9fa', padding: 16, borderRadius: 12,
    marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#4A90E2',
  },
  infoCardContent: { marginLeft: 15, flex: 1 },
  infoCardTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 4 },
  infoCardText: { fontSize: 14, color: '#666', lineHeight: 20 },
  descriptionContainer: { marginBottom: 25 },
  descriptionTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  descriptionText: { fontSize: 16, color: '#555', lineHeight: 24 },
  additionalInfoContainer: { marginBottom: 25 },
  additionalInfoTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  infoSection: { marginBottom: 15 },
  infoSectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 6 },
  infoSectionText: { fontSize: 14, color: '#666', lineHeight: 20 },
  actionButtonsContainer: { flexDirection: 'row', gap: 12, marginTop: 10 },
  primaryButton: {
    flex: 1, backgroundColor: '#4A90E2',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 12, gap: 8,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  secondaryButton: {
    flex: 1, backgroundColor: '#fff',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 12, borderWidth: 2, borderColor: '#4A90E2',
    gap: 8,
  },
  secondaryButtonText: { color: '#4A90E2', fontSize: 16, fontWeight: '600' },
});
