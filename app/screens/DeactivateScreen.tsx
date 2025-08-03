import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAccount } from '@/hooks/useAccount';
import { clearUserPin } from '@/utills/storage';


const DeactivateAccountWarning = ({ navigation }: any) => {
    const {logout} = useAccount()
    

  const handleCancel = () => {
    navigation.goBack(); // or close modal
  };

  const handleConfirm = () => {
      // Add your deactivation logic here

      clearUserPin()
      logout()   
    navigation.navigate("Home")
  };

  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={64} color="#FF6B6B" style={styles.icon} />
      
      <Text style={styles.title}>Are You Sure?</Text>

      <Text style={styles.message}>
        Deactivating your account will permanently remove access to your wallet.
      </Text>
      <Text style={styles.messageBold}>
        Please make sure you've backed up your seed phrase before continuing.
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DeactivateAccountWarning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  message: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  messageBold: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#2C2C2E',
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#FF3B30',
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
