import EncryptedStorage from 'react-native-encrypted-storage';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

export const storeToken = async (accessToken: string, refreshToken: string | null = null) => {
  await EncryptedStorage.setItem(TOKEN_KEY, accessToken);
  refreshToken && await EncryptedStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

export const getToken = async (key?: string) => {
  return await EncryptedStorage.getItem(key || TOKEN_KEY);
};


export const removeToken = async () => {
  await EncryptedStorage.removeItem(TOKEN_KEY);
  await EncryptedStorage.removeItem(REFRESH_TOKEN_KEY);
};