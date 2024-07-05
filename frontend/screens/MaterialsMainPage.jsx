import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform,Alert} from 'react-native';
import PredmetContext from '../context/PredmetContext';
import AuthContext from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import * as FileSystem from 'expo-file-system';
import {shareAsync} from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker';


  const URL = 'http://192.168.206.205:8000'

const SubjectMaterials = ({ route, navigation }) => {
  const { imePredmeta, imeSmjera, imeFakulteta } = route.params;
  const { predmeti, fetchPredmeti } = useContext(PredmetContext);
  const { user } = useContext(AuthContext);


  const handleDownload = async (fileName) => {
    const filePath = `${URL}/public/files/?name=${fileName}`;

    try {
      const { uri } = await FileSystem.downloadAsync(
        filePath,
        FileSystem.documentDirectory + fileName
      );

      console.log('File saved to:', uri);

      await openDocumentPicker(uri, fileName);
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Download Error', 'Failed to download the file');
    }
  };

  const openDocumentPicker = async (uri, fileName) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // All files
        copyToCacheDirectory: false, // Set to true if you want to copy the file to the cache directory
        initialDirectory: uri.substring(0, uri.lastIndexOf('/')),
      });

      console.log('DocumentPicker result:', result);

      if (result.type === 'success') {
        save(result.uri, fileName, result.type);
      }
    } catch (error) {
      console.error('DocumentPicker error:', error);
      Alert.alert('DocumentPicker Error', 'Failed to open document picker');
    }
  };

  const save = async (uri, filename, mimetype) => {
    try {
      if (Platform.OS === 'android') {
        const permissions = await FileSystem.requestStoragePermissionsAsync();
        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
          const directory = `${FileSystem.documentDirectory}Downloads/`;
          const fileInfo = await FileSystem.getInfoAsync(directory);

          if (!fileInfo.exists) {
            await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
          }

          const fileUri = `${directory}${filename}`;
          await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          console.log('File saved to:', fileUri);
          Alert.alert('File saved', `File saved to ${fileUri}`);
        } else {
          Alert.alert('Permission required', 'Please enable storage access to save the file');
        }
      } else {
        Alert.alert('Platform not supported', 'Saving files is only supported on Android in this example');
      }
    } catch (error) {
      console.error('Save error:', error);
      Alert.alert('Save Error', 'Failed to save the file');
    }
  };

  useEffect(() => {
    if (user) {
      fetchPredmeti();
    }
  }, [user]);

  useEffect(() => {
    const found = predmeti.find(predmet => predmet.imePredmeta === imePredmeta && predmet.imeSmjera === imeSmjera && predmet.imeFakulteta === imeFakulteta);
    if (!found) {
      navigation.navigate('Home');
    }
  }, [predmeti]);

  const [materijali, setMaterijali] = useState();

  const fetchMaterijali = async () => {
    try {
      const response = await axios.get(`${URL}/materijal/MaterijaliPredmeta/${imePredmeta}/${imeSmjera}/${imeFakulteta}`);
      console.log(response.data);
      setMaterijali(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMaterijali();
  }, []);

  return (
    <SafeAreaView style={styles.wrapperContainer}>
      <Header />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
       

        <View style={styles.materialsCards}>
          {materijali?.map((materijal, index) => (
            <TouchableOpacity
              key={index}
              style={styles.materialsCard}
              onPress={() => handleDownload(materijal.putanja)}
            >
              <Text style={styles.materialsTitle}>{materijal.naslov}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SubjectMaterials;

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
    paddingBottom: 50,
  },
  materialsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  matIcon: {
    fontSize: 25,
    color: '#0f75bd',
    marginRight: 10,
  },
  headerText: {
    color: '#f7941d',
    fontSize: 35,
  },
  materialsCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  materialsCard: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 200,
    margin: 12,
    borderRadius: 10,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    backgroundColor: '#0f74bd28',
    padding: 10,
    
  },
  materialsTitle: {
    color: '#0f75bd',
    fontSize: 25,
    textAlign: 'center',
  },
});
