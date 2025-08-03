import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from "react-native";
import { isAddress } from "viem";
import { useNavigation } from "@react-navigation/native";
import debounce from "lodash.debounce";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Clipboard from '@react-native-clipboard/clipboard';
import { RootStackParamList } from "@/types";

const SendAddressScreen = () => {
  const [copiedText, setCopiedText] = useState('');
  
    const [input, setInput] = useState("");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  const onCopyNavigate = useCallback(
    debounce((text: string) => {
      const trimmed = text.trim();
      setInput(trimmed);
      if (isAddress(trimmed)) {
        navigation.navigate("AmountScreen", { address: trimmed });
      }
    }, 500),
    [navigation]
  );

  const handleScan = () => {
    navigation.navigate("ScanScreen")
  }

  const checkAddressAndNavigate = useCallback(
    debounce((value: string) => {
      if (isAddress(value.trim())) {
        navigation.navigate("AmountScreen", { address: value.trim() as string });
      }
    }, 500),
    [copiedText]
  );

  useEffect(() => {
    if (input.length > 0) {
      checkAddressAndNavigate(input);
    }
  }, [input]);
  const fetchCopiedText = async () => {
    const text = await Clipboard.getString();
    if (isAddress(text.trim())) {
      setCopiedText(text);
    }
    
  };

  useEffect(() => {
    const checkClipboard = async () => {
      await fetchCopiedText();
    };

    checkClipboard();
    
  },[copiedText])

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="To Wallet Address"
          placeholderTextColor="#999"
          autoCapitalize="none"
          onChangeText={setInput}
          value={input}
        />
      </View>
      {copiedText && (
  <View>
    <Text style={styles.copiedText}>Copy</Text>

    <TouchableOpacity  onPress={() => onCopyNavigate(copiedText)} style={styles.coppied_address}>
      <Text style={styles.copiedText}>{copiedText}</Text>
    </TouchableOpacity >
  </View>
)}
      
      <TouchableOpacity onPress={handleScan}>
        <Text style={styles.label}>Send via QR Code</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendAddressScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#0A0F1C",
    gap: 30,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#A0A0A0",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 50,
    fontSize: 16,
    color: "#000",
  },
  coppied_address: {
    borderRadius: 10,
    backgroundColor: "#1A1A1A",
    height: 60,
    justifyContent:"center"
  },
  copiedText: {
    color:"#A0A0A0",
  }
});
