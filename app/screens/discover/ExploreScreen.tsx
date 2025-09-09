import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../../types";
import LinearGradient from "react-native-linear-gradient";

// Dummy dApp data
const dapps = [
  {
    id: "1",
    name: "Uniswap",
    url: "https://app.uniswap.org",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968393.png",
    description: "Swap cryptocurrencies and earn on liquidity pools.",
  },
  {
    id: "2",
    name: "Aave",
    url: "https://app.aave.com",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968393.png",
    description: "Lend and borrow digital assets with ease.",
  },
  {
    id: "3",
    name: "Zerion",
    url: "https://app.zerion.io",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968393.png",
    description: "Manage your DeFi portfolio from one place.",
  },
  {
    id: "4",
    name: "Pancakeswap",
    url: "https://pancakeswap.finance/",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968393.png",
    description: "A leading decentralized exchange on BNB Smart Chain.",
  },
  {
    id: "5",
    name: "OpenSea",
    url: "https://opensea.io/",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968393.png",
    description: "Discover, collect, and sell NFTs.",
  },
  {
    id: "6",
    name: "Nexo Template",
    url: "https://nexo-next-template.vercel.app/",
    icon: "https://cdn-icons-png.flaticon.com/512/5968/5968705.png",
    description: "A starter template for building modern Web3 dApps.",
  },
];

const ExploreScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const openDapp = (dappUrl: string) => {
    navigation.navigate("MoveScreen", { dappUrl });
  };

  const renderDappCard = ({ item }: { item: typeof dapps[0] }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.touchable}
      onPress={() => openDapp(item.url)}
    >
      <LinearGradient
        colors={["rgba(30,59,93,0.8)", "rgba(42,76,112,0.8)", "rgba(61,97,133,0.8)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Image source={{ uri: item.icon }} style={styles.icon} />
        <View style={styles.infoContainer}>
          <Text style={styles.dappName}>{item.name}</Text>
          <Text style={styles.dappDescription} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Gradient header */}
      <LinearGradient
        colors={["#1E3B5D", "#0A0F1C"]}
        style={styles.headerGradient}
      >
        <Text style={styles.headerTitle}>Explore dApps</Text>
      </LinearGradient>

      <FlatList
        data={dapps}
        keyExtractor={(item) => item.id}
        renderItem={renderDappCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0F1C",
  },
  headerGradient: {
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 50,
    paddingBottom: 25,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    letterSpacing: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  touchable: {
    marginBottom: 16,
    borderRadius: 18,
    overflow: "hidden",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  icon: {
    width: 54,
    height: 54,
    borderRadius: 14,
    marginRight: 15,
    backgroundColor: "#E6E9ED",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  dappName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  dappDescription: {
    fontSize: 14,
    color: "#C0C0C0",
    lineHeight: 18,
  },
  arrow: {
    fontSize: 28,
    color: "#FFF",
    marginLeft: 10,
  },
});
