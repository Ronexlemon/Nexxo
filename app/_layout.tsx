import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-get-random-values';
//import 'text-encoding'; 

import React, { useEffect, useCallback, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native';
//import StackNavigator from './src/screens/navigation/StackNavigator';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import * as SplashScreen from 'expo-splash-screen';
//import { Stack } from 'expo-router'; // We still need this for the RootLayout itself, but not for the main navigation

// The StackNavigator you provided, with a slight modification

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SessionProvider, useSession } from '@/context/Sessioncontext';
import HomeScreen from './screens/HomeScreen';

// import { useSession } from '../../../context/Sessioncontext';
// import HomeScreen from '../HomeScreen';
import DetailsScreen from './screens/DetailScreen';
import PinScreen from './screens/PinScreen';
import SettingsScreen from './screens/SettingScreen';
import AddressScreen from './screens/AddressScren';
import RecoveryPhraseScreen from './screens/PhraseScreen';
import UnlockScreen from './screens/UnlockScreen';
import AuthScreen from './screens/AuthScreen';
import SendAddressScreen from './screens/SendAddressScreen';
import SendAmountScreen from './screens/SendAmountscreen';
import SendScreen from './screens/SendScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import MoveScreen from './screens/discover/MoveScreen';
import MainTabs from './tabs/bottomtabs';
import ScanScreen from './screens/scan/ScanningScreen';
import ImportWalletScreen from './screens/ImportWalletScreen';
import DeactivateAccountWarning from './screens/DeactivateScreen';
import store, { persistor } from '@/store/redux';


const Stack = createNativeStackNavigator();

const AppStack = () => {
  const { resetInactivityTimer } = useSession();

  const handleUserInteraction = () => {
    resetInactivityTimer();
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={handleUserInteraction}>
      <View style={{ flex: 1 }}>
        <Stack.Navigator
          initialRouteName="AuthScreen"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Wallet" component={MainTabs} />
          <Stack.Screen name="PinScreen" component={PinScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="DiscoverScreen" component={DiscoverScreen} />
          <Stack.Screen name="ImportWalletScreen" component={ImportWalletScreen} />
          <Stack.Screen name="MoveScreen" component={MoveScreen} />
          <Stack.Screen name="DeactivateScreen" component={DeactivateAccountWarning} />
          <Stack.Screen name="ScanScreen" component={ScanScreen} />
          <Stack.Screen name="UnlockScreen" component={UnlockScreen} />
          <Stack.Screen name="AuthScreen" component={AuthScreen} />
          
          <Stack.Screen
            name="SendAddress"
            component={SendAddressScreen}
            options={{
              headerShown: true,
              title: 'Send',
              headerBackVisible: true,
              headerTintColor: '#FFFFFF',
              headerTitleAlign: 'center',
              headerBackground: () => (
                <View style={{ flex: 1, backgroundColor: "#0B0F1A" }} />
              ),
            }}
          />
          <Stack.Screen
            name="AddressScreen"
            component={AddressScreen}
            options={{
              headerShown: true,
              title: 'Wallet Address',
              headerBackVisible: true,
              headerTintColor: '#FFFFFF',
              headerTitleAlign: 'center',
              headerBackground: () => (
                <View style={{ flex: 1, backgroundColor: "#0B0F1A" }} />
              ),
            }}
          />
          <Stack.Screen
            name="RecoveryPhraseScreen"
            component={RecoveryPhraseScreen}
            options={{
              title: 'Recovery Phrase',
              headerShown: true,
              headerBackVisible: true,
              headerTitleAlign: 'center',
              headerBackground: () => (
                <View style={{ flex: 1, backgroundColor: "#0B0F1A" }} />
              ),
            }}
          />
          <Stack.Screen
            name="AmountScreen"
            component={SendAmountScreen}
            options={{
              headerShown: true,
              headerTitle: '',
              headerBackVisible: true,
              headerTitleAlign: 'center',
              headerTintColor: '#FFFFFF',
              headerBackground: () => (
                <View style={{ flex: 1, backgroundColor: "#0B0F1A" }} />
              ),
            }}
          />
          <Stack.Screen
            name="SendScreen"
            component={SendScreen}
            options={{
              headerShown: true,
              headerTitle: 'Review Send',
              headerBackVisible: true,
              headerTitleAlign: 'center',
              headerTintColor: '#FFFFFF',
              headerBackground: () => (
                <View style={{ flex: 1, backgroundColor: "#0B0F1A" }} />
              ),
            }}
          />
        </Stack.Navigator>
      </View>
    </TouchableWithoutFeedback>
  );
};


export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <BottomSheetModalProvider>
        <NavigationContainer>
          <SessionProvider>
            <Provider store={store}>
              <PersistGate loading={<ActivityIndicator />} persistor={persistor}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* We are now using your custom stack navigator instead of the expo-router one */}
      <AppStack />
      <StatusBar style="auto" />
                </ThemeProvider>
                </PersistGate>
            </Provider>
          </SessionProvider>
        </NavigationContainer>
      </BottomSheetModalProvider>
      <Toast />
    </GestureHandlerRootView>
  );
}