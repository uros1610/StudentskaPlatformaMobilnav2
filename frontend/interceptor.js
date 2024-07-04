import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Linking } from 'react-native';

const setupInterceptors = () => {
  axios.interceptors.response.use(
    response => {
      return response;
    },
    async error => {
      console.log(error.response?.data);

      if (error.request.status === 401 || error.request.status === 403) {
        try {
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
        } catch (e) {
          console.error('Failed to remove token/user from AsyncStorage', e);
        }
      }

      return Promise.reject(error);
    }
  );

  axios.interceptors.request.use(
    async config => {
      console.log('intercepting request');
      try {
        const token = await AsyncStorage.getItem('token');
        if (token != null) {
          config.headers.Authorization = 'Bearer ' + token;
        }
      } catch (e) {
        console.error('Failed to get token from AsyncStorage', e);
      }

      return config;
    },
    error => {
      console.log('Request error:', error);
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
