import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext({});

export const AuthContextProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const URL = 'http://192.168.206.205:8000'

  console.log(URL);

  useEffect(() => {
    const loadUserFromStorage = async () => {
      try {
        const userFromStorage = await AsyncStorage.getItem('user');
        if (userFromStorage) {
          setUser(JSON.parse(userFromStorage));
        }
      } catch (error) {
        console.error('Error loading user from AsyncStorage:', error);
      }
    };

    loadUserFromStorage();
  }, []);

  const login = async (inputs) => {

    try {
      const resp = await axios.post(`${URL}/auth/login`, inputs);
      const data = {
        rola: resp.data.rola,
        korisnickoIme: resp.data.korisnickoIme,
        imeSmjera: resp.data.imeSmjera,
        imeFakulteta: resp.data.imeFakulteta,
      };
      setUser(data);
      await AsyncStorage.setItem('token', resp.data.token);
      console.log(data);
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    } catch (err) {
      console.error('Logout error:', err);
      throw err;
    }
  };

  useEffect(() => {
    const saveUserToStorage = async () => {
      try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error saving user to AsyncStorage:', error);
      }
    };

    if (user) {
      saveUserToStorage();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
