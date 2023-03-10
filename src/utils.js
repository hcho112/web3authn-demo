import { connect, keyStores, WalletConnection, Near } from "near-api-js";
import { base_encode } from "near-api-js/lib/utils/serialize";
import { KeyPair } from "near-api-js/lib/utils/key_pair";

const MASTER_USER_ID = "dannytest31.testnet";
const keyStore = new keyStores.BrowserLocalStorageKeyStore(window.localStorage, 'nearlib:keystore:');
const keyPair = KeyPair.fromString('ed25519:5RSURSUtTcvaAivE4fK7PApg8gGwibLMH6WwBbNmZLJS4dUC6CnXEeEen6sirFBvRibJf9758KZM3VugBAuHhcqL');
await keyStore.setKey('testnet', 'dannytest31.testnet', keyPair);
console.log('keyPair', keyPair);
console.log('keyStore', keyStore);
const config = {
	networkId: "testnet",
	keyStore: keyStore,
	nodeUrl: "https://rpc.testnet.near.org",
    masterAccount: "dannytest31.testnet",
};

console.log('config', config);

const nearConnection = await connect(config);
console.log('nearConnection', nearConnection);
const wallet = new WalletConnection(nearConnection);
console.log('wallet', wallet)
const account = await nearConnection.account(MASTER_USER_ID);
console.log('account', account);

const near = new Near(config);
console.log('near', near);

export const createAccount = async (username, publicKeyObjectED) => {
    console.log('username', username);
    console.log('publicKeyObjectED', publicKeyObjectED);
    console.log('publicKey', publicKeyObjectED.getPublicKey());
    // return await near.createAccount(username, publicKeyObjectED);
  return await account.createAccount(username, publicKeyObjectED.getPublicKey().toString(), "1000000000000000000000000");
};

export const getCorrectAccessKey = async (userName, firstKeyPair, secondKeyPair) => {
    console.log('userName', userName);
    // console.log('base64.toString(userHandle)', base64.toString(userName));
    const account = await nearConnection.account(userName);
    console.log('account', account);
    const accessKeys = await account.getAccessKeys();
    console.log('accessKeys', accessKeys);

    const firstPublicKeyB58 = "ed25519:" + base_encode((firstKeyPair.getPublicKey().data))
    const secondPublicKeyB58 = "ed25519:" + base_encode((secondKeyPair.getPublicKey().data))
  
    const accessKey = accessKeys.find((accessKey) => accessKey.public_key === firstPublicKeyB58 || secondPublicKeyB58);
    if (!accessKey) {
        throw new Error('No access key found');
    } else if (accessKey.public_key === firstPublicKeyB58) {
        return firstKeyPair;
    } else {
        return secondKeyPair;
    }
  };