import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
// We've replaced react-native-vector-icons/FontAwesome with Ionicons from @expo/vector-icons.
// This is a more reliable way to use icons in Expo projects and resolves the TypeScript issue.
import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { useAccount } from '@/hooks/useAccount';


const SettingsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [modalVisible, setModalVisible] = useState(false);
  const [testInput, setTestInput] = useState('');
  const {logout} = useAccount()

  const handleLoad = () => {
    console.log('Loading test data:', testInput);
    setModalVisible(false); 
    navigation.navigate("MoveScreen", { dappUrl: testInput }); 
  };
  
  const handleLogout = () => {
    navigation.navigate('UnlockScreen', { nextScreen: 'DeactivateScreen' })
  }

  return (
    <View
     style={styles.container}>
      {/* Wallet Address Link */}
      <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('AddressScreen')}>
        <View style={styles.iconWrap}>
          {/* Using Ionicons: `id-card-outline` instead of `address-card` */}
          <Ionicons name="id-card-outline" size={20} color="#007bff" />
        </View>
        <Text style={styles.label}>Wallet Address</Text>
        {/* Using Ionicons: `chevron-forward-outline` instead of `chevron-right` */}
        <Ionicons name="chevron-forward-outline" size={18} color="white" />
      </TouchableOpacity>

      {/* Recovery Phrase Link */}
      <TouchableOpacity
        style={styles.item}
        onPress={() => navigation.navigate('UnlockScreen', { nextScreen: 'RecoveryPhraseScreen' })}
      >
        <View style={styles.iconWrap}>
          {/* Using Ionicons: `key-outline` instead of `key` */}
          <Ionicons name="key-outline" size={20} color="#007bff" />
        </View>
        <Text style={styles.label}>Recovery Phrase</Text>
        <Ionicons name="chevron-forward-outline" size={18} color="white" />
      </TouchableOpacity>

      {/* Load Test */}
      <TouchableOpacity style={styles.item} onPress={() => setModalVisible(true)}>
        <View style={styles.iconWrap}>
          {/* Using Ionicons: `flask-outline` instead of `flask` */}
          <Ionicons name="flask-outline" size={20} color="green" />
        </View>
        <Text style={styles.label}>Load Test</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={handleLogout}>
        <View style={styles.iconWrap}>
          <Ionicons name="flask-outline" size={20} color="green" />
        </View>
        <Text style={styles.label}>Deactivate</Text>
      </TouchableOpacity>

      {/* Modal for Load Test */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter Test Link</Text>
            <TextInput
              value={testInput}
              onChangeText={setTestInput}
              style={styles.input}
              placeholder="https://test.com"
            />
            <PrimaryButton style={styles.loadbtn} title="Load" onPress={handleLoad} />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
              <Text style={{ color: '#007bff', marginTop: 10 }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default SettingsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F1A',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#2A2A2A',
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e7f0ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#F2F4F8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1C1F2A',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    color:"#F2F4F8",
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
    borderRadius: 6,
    color:"#A0A0A0"
  },
  closeBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
  loadbtn: {
    backgroundColor:"#00F0FF"
  }

});
