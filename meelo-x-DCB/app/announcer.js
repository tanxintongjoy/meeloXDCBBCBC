import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';

export default function Index() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.sheetbest.com/sheets/0a5e867e-2e01-4211-a422-066db24730ad')
      .then((response) => response.json())
      .then((data) => {
        setAnnouncements(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Announcements</Text>
        <Text style={styles.subheader}>What's new?</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#888" />
        ) : (
          announcements.map((item, idx) => (
            <View key={idx} style={styles.card}>
              <Text style={styles.name}>{item["Announcement name"] || "Untitled Event"}</Text>
              <Text style={styles.info}>Date Shared: {item["Information, if its a sharing/presentation in the morning at school, pls state the date it was shared"] || "TBD"}</Text>
              <Text style={styles.info}>Contact: {item.Contacts || "N/A"}</Text>
              <Text style={styles.info}>Email: {item.Email || "N/A"}</Text>
              <Text style={styles.description}>{item.Information || "No additional information."}</Text>

              {item["Any images/infographic regarding this event?"]?.startsWith("http") && (
                <Image
                  source={{ uri: item["Any images/infographic regarding this event?"] }}
                  style={styles.image}
                  resizeMode="cover"
                />
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 38,
    fontWeight: '700',
    color: 'black',
    marginBottom: 6,
  },
  subheader: {
    fontSize: 24,
    color: '#2d284d',
    fontWeight: '500',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#f3f3fa',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  info: {
    fontSize: 16,
    color: '#444',
    marginBottom: 2,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2d284d',
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    color: '#555',
    marginTop: 8,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
});
