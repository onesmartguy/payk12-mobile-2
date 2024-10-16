import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const storeToken = async (accessToken: string, refreshToken: string | null = null) => {
  try {
    
  await EncryptedStorage.setItem(TOKEN_KEY, accessToken);
  refreshToken && await EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch (error) {
    console.log('error storing token', error)
  }
};

export const getToken = async (key?: string) => {
  try {
  return await EncryptedStorage.getItem(key || TOKEN_KEY);
  } catch (error) {
    console.log('error getting token', error)
    return null
  }
};


export const removeToken = async () => {
  await EncryptedStorage.clear(() => console.log('cleared'))
};