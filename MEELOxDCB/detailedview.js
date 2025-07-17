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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const getImageUrl = (url) => {
  if (!url) return null;
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
  return url.startsWith('http') ? url : null;
};

export default function DetailedInfo({ navigation, route }) {
  const { item } = route.params || {};

  const imageUrl = getImageUrl(item?.image);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView contentContainerStyle={styles.content}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#333" />
        </TouchableOpacity>

        <Text style={styles.title}>{item?.title || 'DCB Event!'}</Text>

        <Text style={styles.subtitle}>
          {item?.category ? item.category : 'Category not specified'}
          </Text>

        <Text style={styles.description}>
          {item?.description || 'No additional info.'}
        </Text>

        {imageUrl && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 20 }}>
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </ScrollView>
        )}

        <Text style={styles.contact}>
          {item?.Contacts || 'No contact info'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, paddingTop: 10 },
  backButton: { marginBottom: 10, width: 36 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginBottom: 8 },
  subtitle: {
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#f2f2f2',
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderRadius: 6,
  },
  description: { fontSize: 16, lineHeight: 22, color: '#333', marginBottom: 20 },
  image: { width: 250, height: 140, borderRadius: 10, marginRight: 12 },
  contact: { fontSize: 14, color: '#888', marginTop: 30, textAlign: 'center' },
});
