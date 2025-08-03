import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import PrimaryButton from '../../components/PrimaryButton';

import { formatEther, formatUnits, parseUnits } from 'viem';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { CustomBottomSheet } from '../../components/BottomSheet';
import { AddToken } from '../../components/addToken';
import { TokenAddModal } from '../../components/TokenModal';
import { fetchERC20TokenDetails } from '../../lib/TokenDetails';
import { addToken, TokenBalance } from '../../store/tokenSlice';
import { useAccount } from '@/hooks/useAccount';
import { useWallet } from '@/hooks/useWallet';
import { useTokens } from '@/hooks/useTokens';
import { RootStackParamList } from '@/types';



const tokens = Array(10).fill({
  icon: 'data:image/png;base64,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',
  name: 'Ethereum',
  amount: 1000,
  symbol: 'ETH',
  dollar_amount: 10000,
});

const DetailsScreen = () => {
  const { account } = useAccount();
  const { publicClient } = useWallet()
  const [balance, setBalance] = React.useState<string>('0');
  const [modalVisible, setModalVisible] = React.useState(false);
  const [tokenData, setTokenData] = React.useState<any>(null);
   const [tokenAddress, setTokenAddress] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [nativeToken, setNativeToken] = React.useState<TokenBalance | null>(null);
  
  const { addNewToken, tokens } = useTokens()


  const Tokens = async ():Promise<TokenBalance> => {
    const rawBalance = await publicClient.getBalance({
      address: account.publicAddress as `0x${string}`,
    });
    const token_balance: TokenBalance = {
      name: "XFI",
      symbol: "XFI",
      balance: rawBalance as any,
      address: "0x000000000000000000000000000001",
      decimals:18
    }
    return token_balance
    
  }
  

  

 const handleSubmit = React.useCallback((tokenData:TokenBalance) => {
     if (tokenData) {
       addNewToken(tokenData);
       bottomSheetRef.current?.close()
       
      //  setTokenAddress('');
      //  setTokenData(null);
     }
   },[]);
 

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = () => {
    bottomSheetRef.current?.present();
    //setModalVisible(true)
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const handleSetting = () => {
    navigation.navigate('Settings'); 
  }
  const handleSend = () => {
    navigation.navigate('SendAddress'); 
  }

  const handleScan = () => {
    navigation.navigate("ScanScreen")
  }

  
  const handleDiscover = () => {
    try {
      //Alert.alert("Navigation Starting");
      //navigation.navigate('MoveScreen', { dappUrl: 'https://supply-sphere.vercel.app' });
      navigation.navigate("AddressScreen")
      
     // Alert.alert("Navigation done");
    } catch (e:any) {
    // Alert.alert("Navigation failed", e?.message || "Unknown error");
      console.error(e);
    }
  };

  const allTokens = React.useMemo(() => {
    if (!nativeToken) return tokens;
    return [nativeToken, ...tokens];
  }, [nativeToken, tokens]);

  React.useEffect(() => {
   
    const fetchBalance = async () => {
      if (!account || !publicClient) {
        
        return
        
      } ;

      try {
        const rawBalance = await publicClient.getBalance({
          address: account.publicAddress as `0x${string}`,
        });
        console.log("THE BALABCE",rawBalance)
    // Alert.alert(`THE BALANCE,${rawBalance}`)
        setBalance(formatEther(rawBalance)); // convert BigInt to human-readable ETH
      } catch (error) {
        console.error('Error fetching balance:', error);
      }
    };

    fetchBalance();
  }, [account, publicClient]);

  React.useEffect(() => {
    const fetchToken = async () => {
      const token = await Tokens(); 
      setNativeToken(token);
    };
  
    fetchToken();
  }, []);
  
  return (
    <View
    
      style={styles.container}>
      {/* Top Row: Setting + Scan */}
      <View style={styles.settingRow}>
        <TouchableOpacity onPress={handleSetting} style={styles.settingIcon}>
          <Ionicons name="cog" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleScan} style={styles.scanIcon}>
          <Ionicons name="code" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balance_text}>Your Balance</Text>
        <Text style={styles.tokenBalance}>{Number(balance).toFixed(4)} XFI</Text>
        <View style={styles.conversionRow}>
          {/* <Text style={styles.dollarAmount}>$100.10</Text>
          <Text style={styles.changePositive}>+3.52%</Text> */}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <PrimaryButton title="Send" onPress={handleSend} style={styles.actionBtn} textStyle={styles.actionText} />
        <PrimaryButton title="Receive" onPress={handleDiscover} style={styles.actionBtn} textStyle={styles.actionText} />
        <PrimaryButton title="Swap" onPress={() => {}} style={styles.actionBtn} textStyle={styles.actionText} />
      </View>

      {/* Toggle */}
      
      <View style={styles.toggleRow}>
        <View>
        <TouchableOpacity>
          <Text style={styles.toggleTextInactive}>PortFolio</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity>
          <Text style={styles.toggleTextInactive}>Collectibles</Text>
        </TouchableOpacity> */}
        </View>
        <View>
        <TouchableOpacity onPress={openBottomSheet}>
          <Text style={styles.dots}>...</Text>
        </TouchableOpacity>
        </View>
        
      </View>

      

      {/* Token List */}
      <FlatList
        data={allTokens}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View
   style={styles.tokenCard}>
            <View style={styles.tokenLeft}>
              <Image source={{ uri: item.symbol }} style={styles.tokenImage} />
              <View>
                <Text style={styles.tokenName}>{item.name}</Text>
                <Text style={styles.tokenSymbol}>{item.symbol}</Text>
              </View>
            </View>
            <View style={styles.tokenRight}>
              <Text style={styles.tokenAmount}>{formatUnits(BigInt(item.balance),item.decimals)} {item.symbol}</Text>
              <Text style={styles.tokenValue}>${formatUnits(BigInt(item.balance),item.decimals)}</Text>
            </View>
          </View>
        )}
      />
     {/* <TouchableOpacity
  style={styles.floatingButton}
  onPress={ openBottomSheet}
      >
        <View style={styles.add_token}>
         
          <FontAwesome name="plus" size={28} color="#fff" />
          <Text style={styles.add_token_text}>Add Token</Text>
        </View>
  
      </TouchableOpacity> */}
      
      
      {/* //bottom sheet */}
      <CustomBottomSheet
        ref={bottomSheetRef}
  title="Add Token"
  Component={AddToken}
  componentProps={{
    onSubmit: handleSubmit,
    userAddress: { address: account.publicAddress as `0x${string}` } 
}}
  snapPoints={['100%']}
/>

        {/* <TokenAddModal  /> */}
        
        
      

    </View>
  );
};

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:"#0B0F1A"
   
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#AEB2BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#AEB2BF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceContainer: {
    // alignItems: 'center',
    gap:4,
    justifyContent: "center",
    alignItems:"center",
    marginBottom: 20,
    //backgroundColor:"#AED6F1"
  },
  tokenBalance: {
    fontSize: 32,
    fontWeight: '700',
    color: '#F2F4F8',
  },
  balance_text: {
    fontSize: 16,
    color: "gray",
    fontWeight:"600"
    
  },
  conversionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  dollarAmount: {
    fontSize: 16,
    color: 'gray',
  },
  changePositive: {
    fontSize: 16,
    color: 'green',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#00F0FF',
    borderRadius: 10,
    width: 70,
    height:70
  },
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0A192F',
  },
  toggleRow: {
    flexDirection: 'row',
    // justifyContent: 'center',
    justifyContent: "space-between",
    alignItems:"center",
    gap: 20,
    marginBottom: 20,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  toggleTextInactive: {
    fontSize: 16,
    fontWeight: '400',
    color: 'gray',
  },
  tokenCard: {
    backgroundColor: "#1C1F2A",
    borderColor:"#2F3545",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tokenLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color:"#CCCCCC"
  },
  tokenSymbol: {
    fontSize: 12,
    color: '#CCCCCC',
  },
  tokenRight: {
    alignItems: 'flex-end',
  },
  tokenAmount: {
    fontSize: 16,
    fontWeight: '500',
    color :"#F2F4F8"
  },
  tokenValue: {
    fontSize: 12,
    color: '#AEB2BF',
  },
  floatingButton: {
    position: 'absolute',
  bottom: 30,
  left: '50%',
  transform: [{ translateX: -28 }],
  backgroundColor: '#007bff',
  width: 120,
  height: 50,
  borderRadius: 8,
  justifyContent: 'center',
  alignItems: 'center',
  elevation: 6,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 4,
  },
  add_token: {
    flexDirection: "row",
    alignItems: 'center',
    gap:8
  },
  add_token_text: { color: '#fff', fontWeight: '600' },
  dots: {
    fontSize: 30,
    paddingHorizontal: 10,
    color:"gray"
  },
  
});


