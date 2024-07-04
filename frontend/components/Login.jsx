import React, { useContext, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, StatusBar } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'; // Import FontAwesome for icons
import { faUser, faLock,faEye} from '@fortawesome/free-solid-svg-icons'; // Import specific icons
import { useNavigation } from '@react-navigation/native';


import AuthContext from '../context/AuthContext'

const Login = () => {
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  const navigator = useNavigation();

  const [showPassword,setShowPassword] = useState(true);
  const [errorMessage,setErrorMessage] = useState('');

  const { login } = useContext(AuthContext);

  const handleChange = (id, value) => {
    setErrorMessage('');
    setData(prevData => ({
      ...prevData,
      [id]: value
    }));
  };

  const handleLogin = async () => {
    try {
      await login(data);
      navigator.navigate('MainStack')
     
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed. Please try again.'); // Set error message from backend or a default one
      
      
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.content}>

       
       <View style = {styles.logoTitle}>
        <Text style={styles.h1}>ezIndex</Text>
        <Image source={require('../assets/logo_si.png')} resizeMode='contain' style = {styles.logo}/>
      </View>

      {errorMessage && <Text style = {styles.errorMessage}>{errorMessage}</Text>}

        
        <View style={styles.form}>


          <View style={styles.inputUserNameDiv}>
            <FontAwesomeIcon icon={faUser} style={styles.userIcon} />
            <TextInput
              style={styles.input}
              placeholder="Korisničko ime"
              onChangeText={value => handleChange('username', value)}
              value={data.username}
            />
          </View>
          <View style={styles.inputPasswordDiv}>
            <FontAwesomeIcon icon={faLock} style={styles.lockIcon} />
            <TextInput
              style={styles.input}
              placeholder="Lozinka"
              onChangeText={value => handleChange('password', value)}
              secureTextEntry = {showPassword}
              value={data.password}
            />
            <TouchableOpacity onPress = {(e) => {setShowPassword(!showPassword)}}>
                <FontAwesomeIcon icon = {faEye} color='#0f75bd'/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <StatusBar backgroundColor="white" barStyle="dark-content" />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f75bd'
  },
  errorMessage: {
    marginBottom:20,
    fontSize:20,
    color:'red'
  },

  content: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    backgroundColor: 'white'
  },
  logoTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginLeft:20
  },
  h1: {
    fontSize: 46,
    color: '#0f75bd'
  },
  form: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputUserNameDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 50,
    width: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f75bd',
    padding: 10
  },
  inputPasswordDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    height: 50,
    width: 300,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#0f75bd',
    padding: 10
  },
  userIcon: {
    color: '#0f75bd'
  },
  lockIcon: {
    color: '#0f75bd'
  },
  input: {
    flex: 1,
    paddingLeft: 10,
    color: '#000'
  },
  loginButton: {
    marginTop: 10,
    backgroundColor: '#0f75bd',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#a45d830a',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center'
  },
  loginImg: {
    width: 500,
    height: 500,
    borderRadius: 10
  }
});

export default Login;
