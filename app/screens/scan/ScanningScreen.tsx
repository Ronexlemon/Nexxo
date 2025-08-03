import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Alert,
  // TouchableOpacity is no longer needed for the fake button
  Platform, // To adjust top padding for iOS notch
} from "react-native";
// Import useCodeScanner for QR code scanning
import { Camera, useCameraDevices, useCodeScanner } from "react-native-vision-camera";
import QRCode from "react-native-qrcode-svg";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import { isAddress } from "viem";
import { useAccount } from "../../../hook/useAccount";

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [activeTab, setActiveTab] = useState<"scan" | "wallet">("scan");
  const [isScanning, setIsScanning] = useState(true); // Control scanner activation
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { account } = useAccount()
  const userAddress = account.publicAddress

  const devices = useCameraDevices();
  const device = devices.find((d) => d.position === 'back'); // Correctly finds the back camera

  useEffect(() => {
    const requestPermission = async () => {
        const status = await Camera.requestCameraPermission();
        setHasPermission(status === 'granted');

        if (status !== 'granted') {
          Alert.alert(
            "Camera Permission Required",
            "Please enable camera access in your device settings to use the scanner.",
            [{ text: "OK" }]
          );
        }
    };
    requestPermission();
  }, []);

  // const codeScanner = useCodeScanner({
  //   codeTypes: ['qr'], // Only scan QR codes
  //   onCodeScanned: (codes) => {
  //     if (isScanning && codes.length > 0) {
  //       setIsScanning(false); // Pause scanning to prevent multiple alerts

  //       const scannedValue = codes[0].value;
  //       if (scannedValue) {
  //         // Alert.alert(
  //         //   "QR Code Scanned!",
  //         //   `Scanned Value: ${scannedValue}`,
  //         //   [
  //         //     {
  //         //       text: "OK",
  //         //       onPress: () => {
  //         //         setIsScanning(true); // Re-enable scanning when alert is dismissed
  //         //       },
  //         //     },
  //         //   ]
  //         // );
          
  //         //navigation.navigate("ScanScreen")
  //         navigation.navigate("AmountScreen", { address: scannedValue.trim() });
  //     }
          
  //       } else {
  //           setIsScanning(true); // If value is unexpectedly empty, re-enable
  //       }
  //     }
  //   },
  // });
  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (isScanning && codes.length > 0) {
        setIsScanning(false);
  
        const scannedValue = codes[0].value;
        if (isAddress(scannedValue?.trim() as string)) {
          navigation.navigate("AmountScreen", { address: scannedValue?.trim() as string });
        } else {
          setIsScanning(true);
        }
      }
    },
  });
  

  return (
    <View style={styles.container}>
      {/* 1. Camera as a full-screen background layer (only when on Scan tab and ready) */}
      {activeTab === "scan" && device != null && hasPermission ? (
        <Camera
          style={StyleSheet.absoluteFill} // Fills the entire parent container
          device={device}
          isActive={true} // Camera preview is always active when on scan tab
          codeScanner={isScanning ? codeScanner : undefined} // Pass scanner only if allowed to scan
        />
      ) : null}

      {/* 2. Wallet Content Overlay (only when on Wallet tab) */}
      {activeTab === "wallet" ? (
        <View style={styles.walletOverlay}>
          <Text style={styles.walletLabel}>Your Wallet QR</Text>
          <QRCode value={userAddress as string} size={200} />
          <Text style={styles.walletAddress}>
            0x1234567890abcdef1234567890abcdef12345678
          </Text>
        </View>
      ) : null}

      {/* 3. Permission/Initialization Text Overlay (only when on Scan tab, and camera not ready) */}
      {activeTab === "scan" && (device === null || !hasPermission) ? (
        <View style={styles.cameraFeedbackOverlay}>
          <Text style={styles.permissionText}>
            {hasPermission ? "Initializing camera..." : "Waiting for camera permission..."}
          </Text>
        </View>
      ) : null}

      {/* 4. Top Toggle - Absolutely positioned on top of all other content */}
      <View style={styles.toggleContainer}>
        <Pressable
          style={[styles.toggleItem, activeTab === "scan" && styles.activeToggle]}
          onPress={() => setActiveTab("scan")}
        >
          <Text style={[styles.toggleText, activeTab === "scan" && styles.activeText]}>Scan</Text>
        </Pressable>
        <Pressable
          style={[styles.toggleItem, activeTab === "wallet" && styles.activeToggle]}
          onPress={() => setActiveTab("wallet")}
        >
          <Text style={[styles.toggleText, activeTab === "wallet" && styles.activeText]}>
            Wallet
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default ScanScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  // Toggle container now uses absolute positioning and zIndex
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderRadius: 8,
    marginHorizontal: 16,
    position: 'absolute', // Absolute positioning
    top: Platform.OS === 'ios' ? 60 : 20, // Adjust top based on platform for notch/status bar
    left: 0,
    right: 0,
    zIndex: 10, // Higher zIndex to ensure it's on top
    overflow: "hidden",
  },
  toggleItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: "#222",
  },
  toggleText: {
    color: "#aaa",
    fontWeight: "600",
  },
  activeToggle: {
    backgroundColor: "#fff",
  },
  activeText: {
    color: "#000",
  },
  // Overlay for Wallet content
  walletOverlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000", // Solid background for wallet tab
    zIndex: 5, // Below the toggle, above camera (if camera conceptually behind)
  },
  // Overlay for Camera permission/initialization text
  cameraFeedbackOverlay: {
    ...StyleSheet.absoluteFillObject, // Fills the entire screen
    backgroundColor: 'rgba(0,0,0,0.8)', // Semi-transparent overlay to make text readable
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 7, // Above camera, below toggle
  },
  permissionText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    paddingHorizontal: 20,
  },
  walletLabel: {
    fontSize: 18,
    color: "#fff",
    marginBottom: 16,
    fontWeight: "bold",
  },
  walletAddress: {
    color: "#ccc",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});