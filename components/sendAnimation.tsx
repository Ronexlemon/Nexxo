import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import sendAnimation from "../assets/send.json";

const SendAnimation = () => {
  return (
    <View style={styles.animation_send}>
      <LottieView source={sendAnimation} autoPlay loop style={styles.lottie} />
      <Text style={styles.sendingText}>Sending your funds...</Text>
    </View>
  );
};

export default SendAnimation;

const styles = StyleSheet.create({
  animation_send: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
  },
  lottie: {
    width: 250,
    height: 250,
  },
  sendingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
