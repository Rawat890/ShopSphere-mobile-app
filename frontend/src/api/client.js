import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Android emulator maps 10.0.2.2 to host machine localhost
// For physical devices, replace with your LAN IPv4 (e.g., http://192.168.1.10:5000/api)
const BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.223.69.7:5000/api'
    : 'http://10.223.69.7:5000/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('shopsphere_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
