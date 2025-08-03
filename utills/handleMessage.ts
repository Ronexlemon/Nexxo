import { Alert } from 'react-native';
import { WebViewMessageEvent } from 'react-native-webview';
import type { WebView as WebViewType } from 'react-native-webview';
import { Account, WalletClient, PublicClient } from 'viem';
import { mnemonicToAccount } from 'viem/accounts';
import { ConfirmationTokenProps } from '../components/ConfirmationTokensend';
import { accountfromMnemonic } from './web3';


interface MessageHandlerDependencies {
    webviewRef: React.RefObject<WebViewType>;
    account: any; // Use a more specific type if possible
    publicClient: PublicClient | undefined;
    walletClient: WalletClient | undefined;
    currentAddress: string | undefined;
    currentChainId: number | undefined;
    setSendProps: (props: ConfirmationTokenProps) => void;
}

export const handleMessageLogic = async (
    event: WebViewMessageEvent,
    {
        webviewRef,
        account,
        publicClient,
        walletClient,
        currentAddress,
        currentChainId,
        setSendProps
    }: MessageHandlerDependencies
) => {
    let result: any = null;
    let error: { code: number; message: string; data?: any } | null = null;
    let id: string | null = null;

    try {
        const parsedData = JSON.parse(event.nativeEvent.data);
        id = parsedData.id;
        const { method, params } = parsedData;

        console.log('Native: Received DApp request from WebView:', { id, method, params });

        // Ensure wallet is initialized
        if (!publicClient || !account || !currentAddress || currentChainId === undefined) {
            error = { code: -32000, message: "Wallet not fully initialized or connected." };
        } else {
            const connectedViemAccount = accountfromMnemonic(account.mnemonic as string) as Account;
            if (!connectedViemAccount) {
                error = { code: -32000, message: "Failed to derive account from mnemonic." };
            } else {
                switch (method) {
                    case 'eth_requestAccounts':
                    case 'eth_accounts':
                        await new Promise(resolve => {
                            Alert.alert("Connect Wallet", `A DApp wants to connect to your account:\n${currentAddress}\n\nDo you allow this connection?`, [
                                { text: "Deny", onPress: () => { error = { code: 4001, message: 'User rejected the request.' }; resolve(null); }, style: "cancel" },
                                { text: "Allow", onPress: () => { result = [currentAddress]; resolve(null); } }
                            ], { cancelable: false });
                        });
                        break;
                    case 'eth_chainId':
                        result = `0x${currentChainId.toString(16)}`;
                        break;
                    case 'net_version':
                        result = currentChainId.toString();
                        break;
                    case 'personal_sign':
                    case 'eth_sign': {
                        const messageParam = params[0];
                        const addressParam = params[1];

                        if (addressParam && addressParam.toLowerCase() !== currentAddress.toLowerCase()) {
                            error = { code: -32000, message: `Cannot sign for address ${addressParam}. Connected account is ${currentAddress}.` };
                            break;
                        }

                        await new Promise(resolve => {
                            Alert.alert("Sign Message", `\nMethod: ${method}\nAccount: ${addressParam || currentAddress}\nMessage: ${messageParam.substring(0, 150)}${messageParam.length > 150 ? '...' : ''}\n\nDo you approve this signature?`, [
                                { text: "Cancel", onPress: () => { error = { code: 4001, message: 'User rejected signature.' }; resolve(null); }, style: "cancel" },
                                { text: "Sign", onPress: async () => {
                                    try {
                                        const signature = await walletClient?.signMessage({ account: connectedViemAccount, message: { raw: messageParam } });
                                        result = signature;
                                    } catch (e: any) {
                                        console.error('Native: viem signMessage error:', e);
                                        error = { code: -32002, message: e.message || 'Signature failed.' };
                                    }
                                    resolve(null);
                                } }
                            ], { cancelable: false });
                        });
                        break;
                    }
                    case 'eth_signTypedData_v4': {
                        const addressParam = params[0];
                        const jsonMessage = params[1];

                        if (addressParam.toLowerCase() !== currentAddress.toLowerCase()) {
                            error = { code: -32000, message: `Cannot sign for address ${addressParam}. Connected account is ${currentAddress}.` };
                            break;
                        }

                        try {
                            const parsedData = JSON.parse(jsonMessage);
                            const { domain, types, message } = parsedData;

                            await new Promise(resolve => {
                                Alert.alert("Sign Typed Data (EIP-712)", `\nAccount: ${addressParam}\nDomain: ${JSON.stringify(domain)}\nTypes: ${JSON.stringify(types)}\nMessage: ${JSON.stringify(message).substring(0, 150)}...\n\nDo you approve this signature?`, [
                                    { text: "Cancel", onPress: () => { error = { code: 4001, message: 'User rejected signature.' }; resolve(null); }, style: "cancel" },
                                    { text: "Sign", onPress: async () => {
                                        try {
                                            const signature = await walletClient?.signTypedData({
                                                account: connectedViemAccount, domain, types, message,
                                                primaryType: ''
                                            });
                                            result = signature;
                                        } catch (e: any) {
                                            console.error('Native: viem signTypedData_v4 error:', e);
                                            error = { code: -32002, message: e.message || 'Signing typed data failed.' };
                                        }
                                        resolve(null);
                                    } }
                                ], { cancelable: false });
                            });
                        } catch (e: any) {
                            console.error('Native: Error parsing typed data:', e);
                            error = { code: -32602, message: `Invalid typed data: ${e.message}` };
                        }
                        break;
                    }
                    case 'eth_sendTransaction': {
                        const tx = params[0];
                        setSendProps({
                            token: {
                                to: tx.to,
                                data: tx.data,
                                nonce: tx.nonce ? Number(tx.nonce) : undefined,
                            },
                            open: true,
                            walletclient: {
                                client: walletClient as WalletClient,
                                account: connectedViemAccount
                            },
                        });
                        // NOTE: This call to setSendProps will open a modal,
                        // but it doesn't wait for a result. You'll need to handle
                        // sending the transaction and returning the result inside
                        // your ConfirmationTokenSend component's logic.
                        break;
                    }
                    case 'wallet_switchEthereumChain': {
                        const chainIdParam = params[0].chainId;
                        const targetChainId = parseInt(chainIdParam, 16);
                        if (currentChainId === targetChainId) {
                            result = null;
                        } else {
                            await new Promise(resolve => {
                                Alert.alert("Switch Network", `A DApp wants to switch the network to Chain ID: ${targetChainId} (${chainIdParam}).\n\nDo you approve this?`, [
                                    { text: "Cancel", onPress: () => { error = { code: 4001, message: 'User rejected chain switch.' }; resolve(null); }, style: "cancel" },
                                    { text: "Switch", onPress: () => { error = { code: 4902, message: 'Chain switching is not implemented.' }; resolve(null); } }
                                ], { cancelable: false });
                            });
                        }
                        break;
                    }
                    case 'wallet_addEthereumChain': {
                        const newChain = params[0];
                        await new Promise(resolve => {
                            Alert.alert("Add Network", `A DApp wants to add a new network:\n\nChain ID: ${newChain.chainId}\nName: ${newChain.chainName}\nRPC URL: ${newChain.rpcUrls[0]}\n\nDo you allow this?`, [
                                { text: "Cancel", onPress: () => { error = { code: 4001, message: 'User rejected adding chain.' }; resolve(null); }, style: "cancel" },
                                { text: "Add", onPress: () => { error = { code: 4902, message: 'Adding custom chains is not supported.' }; resolve(null); } }
                            ], { cancelable: false });
                        });
                        break;
                    }
                    // Read-only methods
                    case 'eth_getBalance':
                        result = await publicClient.getBalance({ address: params[0] });
                        break;
                    // ... (Add all other read-only cases here)
                    default:
                        console.warn('Native: Unhandled Ethereum RPC method:', method, params);
                        error = { code: -32601, message: `Method not supported by wallet: ${method}` };
                        break;
                }
            }
        }
    } catch (e: any) {
        console.error('Native: WebView handleMessage parsing/processing error:', e);
        error = { code: -32700, message: `Parse error or internal handler error: ${e.message}` };
    } finally {
        if (webviewRef.current && id) {
            const responseScript = `
                if (window.rnWebviewEthereumBridge && typeof window.rnWebviewEthereumBridge.handleResponse === 'function') {
                    window.rnWebviewEthereumBridge.handleResponse(${JSON.stringify(id)}, ${JSON.stringify(error)}, ${JSON.stringify(result)});
                } else {
                    console.error('WebView bridge not found or not ready to handle response for ID:', ${JSON.stringify(id)});
                }
                true;
            `;
            webviewRef.current.injectJavaScript(responseScript);
        }
    }
};