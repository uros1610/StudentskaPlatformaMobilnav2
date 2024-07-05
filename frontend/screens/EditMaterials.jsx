import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import AddMaterial from './AddMaterial';
import axios from 'axios';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';

const EditMaterials = ({route}) => {

    const URL = process.env.EXPO_PUBLIC_API_URL;
    const { imePredmeta, imeSmjera, imeFakulteta } = route.params
  const [materials, setMaterials] = useState([]);
  const [showAddMaterial, setShowAddMaterial] = useState(false);

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${URL}/materijal/MaterijaliPredmeta/${imePredmeta}/${imeSmjera}/${imeFakulteta}`);
      setMaterials(response.data);
    } catch (err) {
      console.error('Error fetching materials:', err);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleDeleteMaterial = async (id, putanja) => {
    console.log(id,putanja);
    try {
      const response = await axios.delete(`${URL}/materijal/ObrisiMaterijal/${id}/${putanja}`);
      setMaterials(materials.filter(material => material.id !== id));
      alert('Uspješno obrisan materijal!');
    } catch (err) {
      console.error('Error deleting material:', err);
    }
  };

  const handleAddMaterialClose = () => {
    setShowAddMaterial(false);
  };

  return (
    <SafeAreaView style={styles.container}>
        <Header/>
      <View style={styles.header}>
        <Text style={styles.headerText}>Uređivanje materijala za Predmet {imePredmeta}</Text>
      </View>

       {showAddMaterial && <AddMaterial onClose={handleAddMaterialClose} materials={materials} setMaterials={setMaterials} imePredmeta={imePredmeta} imeSmjera={imeSmjera} imeFakulteta={imeFakulteta}/>}

    {!showAddMaterial && <TouchableOpacity style={styles.addButton} onPress={() => setShowAddMaterial(true)}>
    <FontAwesomeIcon icon={faPlus} size={30} style={styles.addIcon} />
    </TouchableOpacity>}

     

      {!showAddMaterial && (<View style={styles.materialsContainer}>
        {materials.map((material, index) => (
          <View key={index} style={styles.material}>
            <View style={styles.materialInfo}>
              <Text style={styles.materialTitle}>{material.naslov}</Text>
              <TouchableOpacity onPress={() => handleDeleteMaterial(material.id, material.putanja)} style={styles.deleteButton}>
                <FontAwesomeIcon icon={faTrash} size={20} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>)}

     

      

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position:'relative',
    flex: 1,
    paddingHorizontal:20,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    color: '#0f75bd',
    fontSize: 24,
    fontWeight: 'bold',
  },
  materialsContainer: {
    width: 300,
    marginBottom: 10,
    
  },
  material: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    justifyContent:'space-between'
  },
  materialInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialTitle: {
    fontSize: 18,
    color: '#0f75bd',
    paddingRight:30
    
    
  },
  deleteButton: {
    backgroundColor: '#f7941d',
    borderRadius: 20,
    position:'absolute',
    padding:10,
    right:-25
    
  },
  deleteIcon: {
    color: '#ffffff',
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#0f75bd',
    padding: 15,
    borderRadius: 50,
    elevation: 5,
  },
  addIcon: {
    color: '#ffffff',
  },
});

export default EditMaterials;
