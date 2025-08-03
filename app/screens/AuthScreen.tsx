import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAccount } from '@/hooks/useAccount';
import { getUserPin } from '@/utills/storage';


const AuthScreen = () => {
    const navigation = useNavigation<any>();
    
  const { account } = useAccount();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const pin = await getUserPin();

      if (account?.publicAddress && pin) {
        // Redirect to UnlockScreen for verification
        navigation.replace('UnlockScreen', {
          nextScreen: 'Wallet',
        });
      } else {
        // If no wallet is set, redirect to create pin/setup screen
        navigation.replace('Home');
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.text}>Authenticating...</Text>
    </View>
  );
};

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#444',
  },
});
