import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ThemeIdeasScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = useState('main');
  const [themeIdea, setThemeIdea] = useState('');
  const [themeQuestion, setThemeQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_URL = 'https://api.sheetbest.com/sheets/9ccf6dab-2ca4-4225-913d-aee1735da00a';

  const submitToSheet = async (data) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Successfully submitted!', [
          {
            text: 'OK',
            onPress: () => {
              if (data.type === 'theme_idea') {
                setThemeIdea('');
              } else if (data.type === 'theme_question') {
                setThemeQuestion('');
              }
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Error submitting. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThemeIdeaSubmit = () => {
    if (themeIdea.trim()) {
      submitToSheet({
        type: 'theme_idea',
        content: themeIdea.trim(),
        category: 'Theme Ideas',
      });
    }
  };

  const handleThemeQuestionSubmit = () => {
    if (themeQuestion.trim()) {
      submitToSheet({
        type: 'theme_question',
        content: themeQuestion.trim(),
        category: 'Theme Questions',
      });
    }
  };

  const MainScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theme Ideas/Questions</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.subtitle}>
          Submit theme ideas or questions anonymously! or vote on campaign themes and features
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.redButton]}
            onPress={() => setCurrentScreen('themeIdeas')}
          >
            <Text style={styles.buttonTitle}>Theme ideas</Text>
            <Text style={styles.buttonSubtitle}>Any ideas which came into mind?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.slateButton]}
            onPress={() => setCurrentScreen('themeQuestions')}
          >
            <Text style={styles.buttonTitle}>Theme questions</Text>
            <Text style={styles.buttonSubtitle}>Curious? Feel free to ask!</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.grayButton]}
            onPress={() => setCurrentScreen('voting')}
          >
            <Text style={styles.buttonTitle}>Voting</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const ThemeIdeasFormScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('main')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Any ideas which came into mind?</Text>

          <TextInput
            style={styles.textArea}
            value={themeIdea}
            onChangeText={setThemeIdea}
            placeholder="Type your idea here"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              styles.redButton,
              (!themeIdea.trim() || isSubmitting) && styles.disabledButton,
            ]}
            onPress={handleThemeIdeaSubmit}
            disabled={isSubmitting || !themeIdea.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Idea</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const ThemeQuestionsFormScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('main')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theme questions</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Curious? Feel free to ask!</Text>

          <TextInput
            style={styles.textArea}
            value={themeQuestion}
            onChangeText={setThemeQuestion}
            placeholder="Type your question here"
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            editable={!isSubmitting}
          />

          <TouchableOpacity
            style={[
              styles.submitButton,
              styles.slateButton,
              (!themeQuestion.trim() || isSubmitting) && styles.disabledButton,
            ]}
            onPress={handleThemeQuestionSubmit}
            disabled={isSubmitting || !themeQuestion.trim()}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit Question</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  const VotingScreen = () => (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => setCurrentScreen('main')}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Voting</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.votingContainer}>
          <Text style={styles.subtitle}>idk</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );

  switch (currentScreen) {
    case 'themeIdeas':
      return <ThemeIdeasFormScreen />;
    case 'themeQuestions':
      return <ThemeQuestionsFormScreen />;
    case 'voting':
      return <VotingScreen />;
    default:
      return <MainScreen />;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  buttonContainer: {
    gap: 20,
  },
  actionButton: {
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  redButton: {
    backgroundColor: '#E74C3C',
  },
  slateButton: {
    backgroundColor: '#64748B',
  },
  grayButton: {
    backgroundColor: '#6B7280',
  },
  buttonTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  buttonSubtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    height: 120,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  submitButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  votingContainer: {
    gap: 15,
  },
});

export default ThemeIdeasScreen;
