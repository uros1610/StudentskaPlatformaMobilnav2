import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import * as DocumentPicker from 'expo-document-picker';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AddMaterial = ({ onClose, materials, setMaterials, imePredmeta, imeSmjera, imeFakulteta }) => {
  const [files, setFiles] = useState([]);
  const [comment, setComment] = useState('');
  const navigation = useNavigation();

  const URL = process.env.EXPO_PUBLIC_API_URL;

  const handleFileChange = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Allow all file types
        multiple: false,
      });

      const assets = result.assets;

      if (!assets) {
        return;
      }

      setFiles([...files, ...assets]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file', err);
      }
    }
  };

  useEffect(() => {
    if (files.length) {
      console.log(files);
      console.log(files[0]);
      console.log(files[0]["name"]);
    }
  }, [files]);

  const handleSubmit = async () => {
    if (!files.length) {
      Alert.alert('Error', 'Please select at least one file');
      return;
    }

    try {
      const uploadPromises = files.map(async (file) => {
        console.log(file);
        const formData = new FormData();
        formData.append('ime_predmeta', imePredmeta);
        formData.append('ime_smjera', imeSmjera);
        formData.append('ime_fakulteta', imeFakulteta);
        formData.append('ime_fajla', file.name);
        formData.append('naslov', comment);
        formData.append('file', {
          uri: file.uri,
          type: file.mimeType,
          name: file.name,
        });

        const response = await axios.post(`${URL}/materijal/PostaviMaterijal`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        setMaterials([{ naslov: comment, putanja: file.name}, ...materials]);

        console.log(response.data);
      });

      await Promise.all(uploadPromises);
      navigation.navigate('MaterialsProfessor');

      Alert.alert('Uspjesno okacen materijal','Uspjesno okacen materijal');

      onClose({ name: files.map((file) => file.name).join(', '), comment });
      
    } catch (err) {
      console.log(err);
    }
  };

  

  return (
    <View style={styles.addMaterialModal}>
      <View style={styles.addMaterialContent}>
        <View style={styles.addMaterialHeader}>
          <Text style={styles.headerText}>Dodaj novi materijal</Text>
          <TouchableOpacity onPress={() => onClose(null)} style={styles.closeBtn}>
            <FontAwesomeIcon icon={faTimes} size={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Dokument:</Text>
            <View style={styles.inputWrapper}>
              <TouchableOpacity onPress={handleFileChange} style={styles.chooseFilesBtn}>
                <Text style={styles.chooseFilesBtnText}>Izaberi fajl</Text>
              </TouchableOpacity>
              <Text style={styles.selectedFilesText}>
                {files.length > 0 ? `Izabrani fajlovi: ${files.map(file => file.name).join(', ')}` : ''}
              </Text>
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Naslov:</Text>
            <TextInput
              style={styles.textArea}
              value={comment}
              onChangeText={setComment}
              placeholder="Unesite naslov"
            />
          </View>
          <TouchableOpacity style={styles.btnSubmit} onPress={handleSubmit}>
            <Text style={styles.btnSubmitText}>Objavi materijal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AddMaterial;

const styles = StyleSheet.create({
  addMaterialModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingBottom: 25,
  },
  addMaterialContent: {
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    width: 400,
    position:'static'
   
  },
  addMaterialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    color: '#0f75bd',
    fontSize: 20,
  },
  closeBtn: {
    backgroundColor: 'transparent',
    padding: 10,
  },
  icon: {
    color: '#f7941d',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
    color: '#f7941d',
    marginBottom: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chooseFilesBtn: {
    backgroundColor: '#0f75bd',
    padding: 10,
    borderRadius: 4,
    marginRight: 10,
  },
  chooseFilesBtnText: {
    color: 'white',
  },
  selectedFilesText: {
    flex: 1,
    marginLeft: 10,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  btnSubmit: {
    backgroundColor: '#f7941d',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  btnSubmitText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
