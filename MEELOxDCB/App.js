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
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

import SettingsScreen from './settings.js';
import LeaderboardScreen from './leaderboardview.js';
import HomeScreen from './realHome.js';
import ThemeIdeasScreen from './suggestionview.js';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const useAnnouncementData = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch(
        'https://api.sheetbest.com/sheets/0a5e867e-2e01-4211-a422-066db24730ad'
      );
      const data = await response.json();
      setAnnouncements(data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to load announcements');
      setLoading(false);
    }
  };

  return { announcements, loading, fetchAnnouncements };
};

const getImageUrl = (url) => {
  if (!url) return 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=No+Image';
  if (url.includes('drive.google.com')) {
    let fileId = '';
    if (url.includes('/open?id=')) fileId = url.split('/open?id=')[1];
    else if (url.includes('/file/d/')) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    } else if (url.includes('id=')) {
      fileId = url.split('id=')[1].split('&')[0];
    }
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }
  return url.startsWith('http') ? url : 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=No+Image';
};

const Header = ({ navigation }) => (
  <View style={styles.header}>
    <View style={styles.headerContent}>
      <Text style={styles.headerTitle}>announcer</Text>
      <Text style={styles.headerSubtitle}>DCB events/campaigns</Text>
    </View>
    <TouchableOpacity style={styles.themeButton} onPress={() => navigation.navigate('ThemeIdeas')}>
      <Text style={styles.themeText}>theme ideas/questions</Text>
      <Ionicons name="document-text-outline" size={24} color="#666" />
    </TouchableOpacity>
  </View>
);

const SearchBar = ({ searchText, onSearch }) => (
  <View style={styles.searchContainer}>
    <View style={styles.searchBar}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchText}
        onChangeText={onSearch}
        placeholderTextColor="#999"
      />
      <Ionicons name="search" size={20} color="#666" />
    </View>
  </View>
);

const AnnouncementCard = ({ item, index }) => {
  const isEven = index % 2 === 0;
  const imageUrl = getImageUrl(item.image);
  return (
    <TouchableOpacity style={[styles.announcementCard, isEven ? styles.evenCard : styles.oddCard]}>
      <View style={styles.cardContent}>
        <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.cardOverlay}>
          <Text style={styles.cardTitle}>{item.title || 'Event Title'}</Text>
        </View>
        <View style={styles.cardArrow}>
          <Ionicons name="chevron-forward" size={30} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const AnnouncementsScreen = ({ navigation }) => {
  const { announcements, loading, fetchAnnouncements } = useAnnouncementData();
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setFilteredAnnouncements(announcements);
  }, [announcements]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const filtered = announcements.filter((item) =>
        item.title?.toLowerCase().includes(text.toLowerCase()) ||
        item.description?.toLowerCase().includes(text.toLowerCase()) ||
        item.category?.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredAnnouncements(filtered);
    }
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
      <Header navigation={navigation} />
      <SearchBar searchText={searchText} onSearch={handleSearch} />
      <FlatList
        data={filteredAnnouncements}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => <AnnouncementCard item={item} index={index} />}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchAnnouncements}
        refreshing={loading}
      />
    </SafeAreaView>
  );
};
// tabs
const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Leaderboard':
            iconName = focused ? 'trophy' : 'trophy-outline';
            break;
          case 'Announcements':
            iconName = focused ? 'megaphone' : 'megaphone-outline';
            break;
          case 'Settings':
            iconName = focused ? 'settings' : 'settings-outline';
            break;
          default:
            iconName = 'help-circle-outline';
        }

        return (
          <View style={[styles.tabIconContainer, focused && styles.activeTabIconContainer]}>
            <Ionicons name={iconName} size={24} color={focused ? '#fff' : '#666'} />
          </View>
        );
      },
      tabBarLabel: ({ focused }) => (
        <Text style={[styles.tabText, focused && styles.activeTabText]}>{route.name}</Text>
      ),
      headerShown: false,
      tabBarStyle: styles.tabBar,
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Tab.Screen name="Announcements" component={AnnouncementsScreen} />
    <Tab.Screen name="Settings" component={SettingsScreen} />
  </Tab.Navigator>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="ThemeIdeas" component={ThemeIdeasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 16, color: '#666' },
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
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 36, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  themeButton: { alignItems: 'center', paddingTop: 10 },
  themeText: { fontSize: 12, color: '#666', textAlign: 'center', marginBottom: 5 },
  searchContainer: { paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#fff' },
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
  },
  evenCard: { backgroundColor: '#4A90E2' },
  oddCard: { backgroundColor: '#7B68EE' },
  cardContent: { position: 'relative', height: 200 },
  cardImage: { width: '100%', height: '100%', opacity: 0.3 },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  cardArrow: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -15 }],
  },
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 5,
    height: 100,
  },
  tabIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTabIconContainer: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '700',
  },
});
