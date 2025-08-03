import React, { useState } from "react";
import {
  View,
  Text,
  TextInput, // Not used but kept from original
  StyleSheet,
  ActivityIndicator, // Added for a more generic loading state if Lottie fails
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

import PrimaryButton from "../../components/PrimaryButton";


import { amount_to_bigint } from "../../utills/web3";
import { useSelector } from "react-redux";
import { RootState } from "../../store/redux";

import { Account, mnemonicToAccount } from "viem/accounts";
import LottieView from "lottie-react-native";
import sendAnimation from "../../assets/send.json";

import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList, SendScreenRouteProp } from "@/types";
import { useTransactions } from "@/hooks/useTransactions";




const SendScreen = () => {
  // State to control the full-screen Lottie animation
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [showSendAnimation, setShowSendAnimation] = useState<boolean>(false);
  // State to indicate if a transaction is in progress (for button and general logic)
  const [isSending, setIsSending] = useState(false);
  // States for displaying non-blocking success/error messages
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const route = useRoute<SendScreenRouteProp>();
  const { sendDetails } =  route.params;
  const { sendNative } = useTransactions(); // sendToken is not used in this snippet, but kept.
  //const { createWallet } = useWallet(); // createWallet is not used in this snippet, but kept.

  // const account = useSelector((state: RootState) => state.account);
  // const mnemonic = account.mnemonic as string;  
 
  
  // const acc = React.useMemo(() => {
  //   if (!mnemonic) return null;
  //   return mnemonicToAccount(mnemonic);
  // }, [mnemonic]);
  // const walletClient = useWalletClient(acc as Account);
 
  
  
  
  const handleSendNative = async () => {
    setIsSending(true);
    setShowSendAnimation(true); 
   
   // console.log("The wallet",walletClient)
    // Clear previous messages before starting a new transaction
    setErrorMessage('');
    setSuccessMessage('');

    const amount = sendDetails.amount as string;
    console.log("The amount",amount)
   
    // if (!mnemonic) {
    //   setErrorMessage("No Mnemonic found. Please ensure your wallet is set up correctly.");
    //   return; // Exit early if no mnemonic
    // }
    // console.log("The mnemonic",mnemonic)

    // if (!walletClient) {
    //     setErrorMessage("Wallet client not initialized. Please try again.");
    //     return; // Exit early if no walletClient
    // }
    requestAnimationFrame(async () => { 

    try {
      //setIsSending(true);
      //setShowSendAnimation(true); // Show Lottie animation
      console.log("Tx Starting")
      const txHash = await sendNative(sendDetails.to as `0x${string}`, amount);
      if (txHash) {
        navigation.replace("Wallet")
      }
      console.log("THE TRANSACTION HASH IS:", txHash);
      setSuccessMessage(`Transaction sent! Hash: ${txHash}`);      
    } catch (error: any) {
      console.error("Transaction error:", error);
      let message = "An unexpected error occurred during the transaction.";
      if (error.message) {
        // Attempt to extract a more user-friendly message from the error object
        message = `Transaction failed: ${error.message}`;
      } else if (typeof error === 'string') {
        message = `Transaction failed: ${error}`;
      }
      setErrorMessage(message);
    } finally {
      setIsSending(false);
      setShowSendAnimation(false); // Hide Lottie animation and return to main screen
    }
  })
    };
    

  // If showSendAnimation is true, display the Lottie animation full screen.
  // This blocks interaction until the animation is dismissed (after send completes/fails).
  if (showSendAnimation) {
    return (
      <View style={styles.animation_send}>
        <LottieView source={sendAnimation} autoPlay loop style={styles.lottie} />
       
        <Text style={styles.sendingText}>Sending...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Display success/error messages at the top */}
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : <Text></Text>}
      {successMessage ? (
        <Text style={styles.successMessage}>{successMessage}</Text>
      ) : <Text></Text>}

      <View style={styles.card_container}>
        <View style={styles.card}>
          <View style={styles.card_row}>
            <Text style={styles.card_label}>Sending</Text>
          </View>
          <View style={styles.card_token}>
            <View style={styles.token_symbol}>
               <Text>Image</Text> {/* Placeholder for an image/icon */}
            </View>
            <View style={styles.token}>
              <Text style={styles.text_amount} >{sendDetails?.amount}  {sendDetails?.token}</Text>
              <Text style={styles.text_secondary_amount}>$ 200</Text> {/* Hardcoded, consider making dynamic */}
            </View>
          </View>

          <View style={styles.token_to}>
            <Text style={styles.card_label}>To:</Text>
            <View style={styles.to_address}>
              <Text style={styles.card_value}>{sendDetails?.to}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Network and fees */}
      <View style={styles.network}>
        <View style={styles.network_name}>
          <Text style={styles.general_text}>Network</Text>
          <Text  style={styles.general_text}>Crossfi</Text>
        </View>
        <View style={styles.network_name}>
          <Text style={styles.general_text}>Network Fee</Text>
          <Text style={styles.text_amount}>{`0.011 ${sendDetails?.token}`}</Text>

        </View>
        <View style={styles.network_name}>
          <Text style={styles.general_text}>Total plus Fees</Text>
          <Text style={styles.text_amount}>$100 </Text> {/* Hardcoded total, make dynamic */}
        </View>
      </View>

      <View style={styles.review}>
        <PrimaryButton
          title={isSending ? "Sending..." : "Send"}
          onPress={handleSendNative}
          style={styles.sendbtn}
          // Disable button while sending or if essential details are missing
          disabled={isSending || !sendDetails?.to || !sendDetails?.amount}
        />
      </View>
    </View>
  );
};

export default SendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0B0F1A",
    padding: 20,
    justifyContent: "space-between", // Distribute space
  },
  label: { // Not directly used in JSX
    fontSize: 16,
    marginBottom: 8,
    color: "#AEB2BF",
    fontWeight: "600",
  },
  card_container: {
    flex: 2, // Takes more space
    justifyContent: 'center', // Center the card vertically within its container
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0", // Lighter border
    padding: 20, // Increased padding
    gap: 16, // Increased gap between sections
    minHeight: 250, // Ensure minimum height
    justifyContent: 'space-around', // Distribute space within the card
  },
  card_row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center', // Align items vertically
  },
  card_label: {
    fontSize: 16,
    fontWeight: "600", // Slightly bolder
    color: "#444",
  },
  card_token: {
    flexDirection: "row",
    alignItems: 'center', // Align items vertically
    gap: 12, // Increased gap
  },
  card_value: {
    fontSize: 16,
    color: "#333",
    flexShrink: 1, // Allow text to shrink to fit
  },
  review: {
    flex: 1, // Takes less space
    marginBottom: 10,
    justifyContent: "flex-end", // Push button to the bottom
  },
  token_symbol: {
    width: 50, // Slightly larger
    height: 50, // Slightly larger
    borderRadius: 25, // Half of width/height for perfect circle
    backgroundColor: "#6200EE", // A vibrant color for visual appeal
    justifyContent: "center",
    alignItems:"center",
    shadowColor: "#000", // Add shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  token: {
    flexDirection: "column",
    gap: 6, // Increased gap
  },
  token_to: {
    flexDirection: "column",
    gap: 6, // Increased gap
  },
  to_address: {
    flexDirection: "row",
    gap: 8,
    flexWrap:"wrap", // Allow address to wrap to next line
  },
  network: {
    flex: 1.5, // Adjust flex to balance layout
    flexDirection: "column",
    gap: 20, // Increased gap between network rows
    marginTop: 20,
  },
  network_name: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: 'center', // Align items vertically
  },
  general_text: { // Renamed from general_test for clarity
    fontSize: 16,
    color: "#555",
  },
  text_amount: {
    fontSize: 16,
    fontWeight: "bold", // Make amounts stand out
    color: "#222",
  },
  text_secondary_amount: { // For the dollar amount
    fontSize: 14,
    color: "#777",
  },
  lottie: {
    width: 250, // Larger Lottie animation
    height: 250,
  },
  animation_send: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0B0F1A", // A soft background for the animation
  },
  sendingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#AEB2BF',
  },
  errorMessage: {
    backgroundColor: '#ffe0e0', // Light red background for errors
    color: '#d32f2f', // Darker red text
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  successMessage: {
    backgroundColor: '#e8f5e9', // Light green background for success
    color: '#388e3c', // Darker green text
    textAlign: 'center',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 14,
    fontWeight: '600',
    borderWidth: 1,
    borderColor: '#c8e6c9',
  },
  sendbtn: {
    backgroundColor:"#00D1FF"
  }
});
