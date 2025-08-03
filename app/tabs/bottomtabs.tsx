import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
// To bypass the TypeScript error with FontAwesome, we'll try using another
// popular and well-supported icon library from the same package.
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

// --- Placeholder Screens for a complete example ---
const DetailsScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.text}>Wallet Screen</Text>
  </View>
);

const HistoryScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.text}>Activity Screen</Text>
  </View>
);

const ExploreScreen = () => (
  <View style={styles.screenContainer}>
    <Text style={styles.text}>Discover Screen</Text>
  </View>
);

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: '#3182ce',
        tabBarInactiveTintColor: '#aaa',
        tabBarIcon: ({ color, size }) => {
          let iconName:any; 

          switch (route.name) {
            case 'Wallt':
              // Using a valid Ionicons name for the Wallet screen
              iconName = 'wallet-outline'; 
              break;
            case 'Activity':
              // Using a valid Ionicons name for the Activity screen
              iconName = 'timer-outline';
              break;
            case 'Discover':
              // Using a valid Ionicons name for the Discover screen
              iconName = 'compass-outline';
              break;
            default:
              iconName = 'circle-outline'; // Fallback icon from Ionicons
          }

          // Returning the Ionicons icon as a JSX component.
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Wallt" component={DetailsScreen} />
      <Tab.Screen name="Activity" component={HistoryScreen} />
      <Tab.Screen name="Discover" component={ExploreScreen} />
    </Tab.Navigator>
  );
};

export default MainTabs;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#121212',
    borderTopColor: '#1f1f1f',
    height: 60,
    paddingBottom: 8,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
