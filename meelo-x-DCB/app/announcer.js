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
import { router } from 'expo-router';

const AnnouncementPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('https://api.sheetbest.com/sheets/0a5e867e-2e01-4211-a422-066db24730ad');
      const data = await response.json();
      setAnnouncements(data);
      setFilteredAnnouncements(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching announcements:', error);
      Alert.alert('Error', 'Failed to load announcements');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter(item =>
        item.title?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearchText('');
      setFilteredAnnouncements(announcements);
    }
  };

  const handleCardPress = (item) => {
    router.push({
      pathname: '/details',
      params: { event: JSON.stringify(item) }
    });
  };

  const renderAnnouncementItem = ({ item, index }) => {
    const isEven = index % 2 === 0;
    return (
      <TouchableOpacity 
        style={[
          styles.announcementCard,
          isEven ? styles.evenCard : styles.oddCard
        ]}
        activeOpacity={0.8}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.cardContent}>
          <Image
            source={{ uri: item.image || 'https://via.placeholder.com/300x200' }}
            style={styles.cardImage}
            resizeMode="cover"
          />
          <View style={styles.cardOverlay}>
            <Text style={styles.cardTitle}>
              {item.title || 'Event Title'}
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
      
    // the header
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>announcer</Text>
          <Text style={styles.headerSubtitle}>DCB events/campaigns</Text>
        </View>
        <TouchableOpacity style={styles.themeButton}>
          <Text style={styles.themeText}>theme ideas/questions</Text>
          <Ionicons name="document-text-outline" size={32} color="#666" />
        </TouchableOpacity>
      </View>

      {/*the searchbar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={searchText}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
          <TouchableOpacity onPress={toggleSearch}>
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredAnnouncements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderAnnouncementItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchAnnouncements}
        refreshing={loading}
      />
    </SafeAreaView>
  );
}; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  themeButton: {
    alignItems: 'center',
    paddingTop: 10,
  },
  themeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 5,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  themeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  listContainer: {
    paddingVertical: 10,
  },
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
  },
  evenCard: {
    backgroundColor: '#4A90E2',
  },
  oddCard: {
    backgroundColor: '#7B68EE',
  },
  cardContent: {
    position: 'relative',
    height: 200,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    opacity: 0.3,
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
  cardArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    justifyContent: 'space-around',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default AnnouncementPage;