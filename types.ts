import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
type sendNativeTransaction = {
  amount: string,
  token: string,
  to:`0x${string}`
}
export type Transaction = {
  tokenName: string;
  amount: number;
  amountInUSD: number;
  hash: string;
};


export type RootStackParamList = {
    UnlockScreen: { nextScreen: string };
    Details: undefined;
  RecoveryPhraseScreen: undefined;
  Home: undefined;
  SendAddressScreen: undefined,
  AmountScreen: { address: string };
  SendScreen:  { sendDetails: sendNativeTransaction },
  DiscoverScreen: { dappUrl?: string },
  setting: undefined,
  Settings: undefined,
  SendAddress: undefined,
  MoveScreen: { dappUrl?: string },
  PinScreen: { mnemonic?: string },
  Wallet: undefined,
  AddressScreen: undefined,
  ScanScreen: undefined,
  ImportWalletScreen: undefined,
  DeactivateScreen:undefined
  
    
  };

export const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
export type AmountScreenRouteProp = RouteProp<RootStackParamList, 'AmountScreen'>;
export type SendScreenRouteProp = RouteProp<RootStackParamList, 'SendScreen'>;
export type DiscoverRouteProp = RouteProp<RootStackParamList, 'DiscoverScreen'>;
export type MoveRouteProp = RouteProp<RootStackParamList, 'MoveScreen'>;
export type ScanRouteProp = RouteProp<RootStackParamList, 'ScanScreen'>;
export type PinRouteProp = RouteProp<RootStackParamList, 'PinScreen'>;

//colors
export const colors = {
  background: "#0A0F1C",        // Primary background color
  accent: "#00F0FF",            // Accent for buttons and icons
  primaryText: "#FFFFFF",       // Primary text color
  secondaryText: "#A0A0A0",     // Secondary or muted text
  surface: "#1A1A1A",           // Card or elevated surfaces
  border: "#2A2A2A",            // Borders and separators
};

export const colodrs = {
  background: "#0B0F1A",       // Deep navy blue-black for immersive dark mode
  surface: "#1C1F2A",          // Slightly lighter for cards/surfaces
  accent: "#00D1FF",           // Cyan glow (softer than pure neon, more modern)
  primaryText: "#F2F4F8",      // Off-white for less strain on eyes
  secondaryText: "#AEB2BF",    // Softer muted grey for subtitles/hints
  border: "#2F3545",           // Subtle but visible separators
  bottomSheet: "#1C1F2A"
};
