import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { MMKV } from 'react-native-mmkv';


// Use MMKV only if not running in Expo Go
const storage = Platform.OS === 'web' || process.env.EXPO_DEV_CLIENT !== 'true'
  ? AsyncStorage
  : new MMKV();

export const setItem = async (key: string, value: string) => {
  if (storage instanceof MMKV) {
    storage.set(key, value);
  } else {
    await storage.setItem(key, value);
  }
};

export const getItem = async (key: string) => {
  if (storage instanceof MMKV) {
    return storage.getString(key);
  } else {
    return await storage.getItem(key);
  }
};

export const removeItem = async (key: string) => {
  if (storage instanceof MMKV) {
    storage.delete(key);
  } else {
    await storage.removeItem(key);
  }
};
