import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type Announcement = {
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  organizer?: string;
  image?: string;
  date?: string;
  time?: string;
  location?: string;
  duration?: string;
  contact?: string;
  requirements?: string;
  notes?: string;
};

const AnnouncementPage = () => {
  const router = useRouter();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.sheetbest.com/sheets/0a5e867e-2e01-4211-a422-066db24730ad');
      const data = await response.json();
      setAnnouncements(data);
      setFilteredAnnouncements(data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      Alert.alert('Error', 'Failed to load announcements');
      setAnnouncements([]);
      setFilteredAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchText(text);

    if (!announcements || announcements.length === 0) {
      setFilteredAnnouncements([]);
      return;
    }

    if (text === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const lowerText = text.toLowerCase();
      const filtered = announcements.filter(item =>
        (item.title?.toLowerCase().includes(lowerText)) ||
        (item.name?.toLowerCase().includes(lowerText)) ||
        (item.description?.toLowerCase().includes(lowerText)) ||
        (item.category?.toLowerCase().includes(lowerText)) ||
        (item.organizer?.toLowerCase().includes(lowerText))
      );
      setFilteredAnnouncements(filtered);
    }
  };

  const handleCardPress = (item: Announcement) => {
    router.push({
      pathname: '/details',
      params: { event: JSON.stringify(item) }
    });
  };

  const renderAnnouncementItem = ({ item, index }: { item: Announcement; index: number }) => {
    const isEven = index % 2 === 0;
    return (
      <TouchableOpacity
        style={[
          styles.announcementCard,
          isEven ? styles.evenCard : styles.oddCard
        ]}
        activeOpacity={0.8}
        onPress={() => handleCardPress(item)} // <-- This triggers navigation
      >
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>
              {item.title ?? item.name ?? 'Event Title'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {item.category ?? 'Category'}
            </Text>
            <Text style={styles.cardDescription} numberOfLines={2}>
              {item.description ?? 'Event description'}
            </Text>
          </View>
          <View style={styles.cardArrow}>
            <Ionicons name="chevron-forward" size={30} color="#fff" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading announcements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>announcer</Text>
        <Text style={styles.headerSubtitle}>DCB events/campaigns</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search announcements"
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
            clearButtonMode="while-editing"
            returnKeyType="search"
          />
          <Ionicons name="search" size={20} color="#666" />
        </View>
      </View>

      {/* Announcements List */}
      <FlatList
        data={filteredAnnouncements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAnnouncementItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchAnnouncements}
        refreshing={loading}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
  header: { padding: 20, backgroundColor: '#fff' },
  headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  searchContainer: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff' },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#f8f8f8', borderRadius: 25,
    paddingHorizontal: 15, paddingVertical: 10,
    borderWidth: 1, borderColor: '#ddd'
  },
  searchInput: { flex: 1, fontSize: 16, color: '#333' },
  listContainer: { paddingVertical: 10 },
  announcementCard: {
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: '#4A90E2',
  },
  evenCard: { backgroundColor: '#4A90E2' },
  oddCard: { backgroundColor: '#7B68EE' },
  cardContent: { position: 'relative', height: 200 },
  cardImage: { width: '100%', height: '100%', opacity: 0.3 },
  cardOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    padding: 20, justifyContent: 'center',
  },
  cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  cardSubtitle: { fontSize: 16, color: '#fff', opacity: 0.9, marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#fff', opacity: 0.8 },
  cardArrow: {
    position: 'absolute', right: 20, top: '50%',
    transform: [{ translateY: -15 }],
  },
});

export default AnnouncementPage;
