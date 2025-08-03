import { RootStackParamList } from '@/types';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  
} from 'react-native';


// Main App component
export default function ImportWalletScreen() {
     const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [seedPhraseInput, setSeedPhraseInput] = useState('');
  const [seedWords, setSeedWords] = useState([]);

  // Handles text input changes, splitting the phrase into individual words
  const handleInputChange = (text:string) => {
    setSeedPhraseInput(text);
    // Split the text by spaces, filter out any empty strings
    const words = text.split(/\s+/).filter(word => word.trim() !== '');
    setSeedWords(words as any);
  };

  // Handles the "Import Phrase" button press
  const handleImportPhrase = () => {
    // In a real application, you would add your logic here
    // to validate and import the seed phrase.
      // For this example, we'll just log it.
      
    console.log('Importing phrase:', seedWords.join(' '));
     
      navigation.navigate('PinScreen',{mnemonic:seedPhraseInput})
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Import Seed Phrase</Text>
          <Text style={styles.description}>
            Please paste or type your 12 or 24-word mnemonic seed phrase below.
            Each word will appear in a separate box.
          </Text>

          {/* Input field for the seed phrase */}
          <TextInput
            style={styles.input}
            placeholder="Paste your seed phrase here..."
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            value={seedPhraseInput}
            onChangeText={handleInputChange}
            autoCapitalize="none"
            spellCheck={false}
            autoCorrect={false}
          />

          {/* Display area for individual words */}
          <View style={styles.wordsContainer}>
            {seedWords.length > 0 ? (
              seedWords.map((word, index) => (
                <View key={index} style={styles.wordBox}>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.noWordsText}>
                Your seed phrase words will appear here.
              </Text>
            )}
          </View>

          {/* Import button */}
          <TouchableOpacity
            style={[styles.importButton, seedWords.length === 0 && styles.importButtonDisabled]}
            onPress={handleImportPhrase}
            disabled={seedWords.length === 0}
          >
            <Text style={styles.importButtonText}>Import Phrase</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // Light background
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937', // Dark gray
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#4b5563', // Medium gray
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    minHeight: 120,
    borderColor: '#d1d5db', // Light border
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#ffffff', // White background for input
    marginBottom: 24,
    textAlignVertical: 'top', // Ensures text starts at the top for multiline
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  wordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
    width: '100%',
    paddingHorizontal: 8,
  },
  wordBox: {
    backgroundColor: '#e0f2fe', // Light blue background for words
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    margin: 6,
    borderWidth: 1,
    borderColor: '#90cdf4', // Slightly darker blue border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  wordText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c5282', // Darker blue text
  },
  noWordsText: {
    fontSize: 16,
    color: '#6b7280', // Gray text
    fontStyle: 'italic',
    marginTop: 20,
  },
  importButton: {
    backgroundColor: '#4c51bf', // Indigo button
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  importButtonDisabled: {
    backgroundColor: '#a7b2e0', // Lighter indigo when disabled
  },
  importButtonText: {
    color: '#ffffff', // White text
    fontSize: 18,
    fontWeight: 'bold',
  },
});
