import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../context/AuthContext';
import { SafeAreaView } from 'react-native';


const Header = () => {
  const navigation = useNavigation();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigation.navigate('Login'); 
  };

  return (
    <SafeAreaView style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('MainStack')}>
            <Image source={require('../assets/logo_si.png')} style={styles.logo} />
          </TouchableOpacity>
        </View>
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={() => navigation.navigate('MainStack')} style={styles.navItem}>
            <Text style={styles.linkText}>{user ? user.korisnickoIme : 'Profil'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.navItem}>
            <Text style={styles.linkText}>Odjavi se</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#0f75bd',
    paddingTop: 16,
    paddingBottom: 16,
    width: Dimensions.get('window').width,
    marginBottom:15
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    width: '100%'
  },
  logoContainer: {
    padding: 5,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  logo: {
    height: 50,
    width: 50,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkText: {
    color: 'white',
  },
});

export default Header;
