import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import AuthContext from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const Notification = ({naslov, opis, id, datumKreiranja, neProcitana, setNeprocitana, obavjestenja, setObavjestenja,imePredmeta}) => {
  const [visible, setVisible] = useState(false);
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [neprocitano, setNeprocitano] = useState();

  console.log("USAO JE OVDJE!");

  const URL = process.env.EXPO_PUBLIC_API_URL;
  

  const oznaciProcitano = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.delete(`${URL}/obavjestenje/neprocitano/${id}`);
      setNeprocitano(false);
      setNeprocitana(neProcitana.filter(neprocitano => neprocitano.id_obavjestenja !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const brisiObavjestenje = async (e) => {
    try {
      const response = await axios.delete(`${URL}/obavjestenje/${id}`);
      setNeprocitana(neProcitana?.filter(neprocitano => neprocitano.id_obavjestenja !== id));
      setObavjestenja(obavjestenja.filter(obavjestenje => obavjestenje.id_obavjestenja !== id));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    setNeprocitano(neProcitana?.some(neprocitano => neprocitano.id_obavjestenja === id));
  }, [neProcitana]);

  return (
    <TouchableOpacity style={styles.jednoObavjestenje} onPress={() => setVisible(!visible)}>
      <View style={styles.vrijemeNaslov}>
        <Text style={styles.vrijemeObavjestenja}>{new Date(datumKreiranja).toLocaleString()}</Text>
        <Text style={styles.naslovObavjestenje}>{naslov}</Text>
      </View>

      {user && user.rola === 'Student' && neprocitano && <FontAwesomeIcon icon={faBell} style={styles.zvonceNeprocitano} />}

      {visible && (
        <View style={styles.tekstObavjestenja}>
          <Text style={styles.opis}>{opis}</Text>
          {user.rola === 'Student' && neprocitano && (
            <Button title="Označite kao pročitano" onPress={oznaciProcitano} />
          )}
          {user.rola === 'Profesor' && (
            <View style={styles.dugmadDiv}>
              <Button title="Izmijeni" onPress={(e) => { e.stopPropagation(); navigation.navigate('NewNotification', { id,imePredmeta:obavjestenja[0].ime_predmeta,
                imeSmjera:obavjestenja[0].ime_smjera,imeFakulteta:obavjestenja[0].ime_fakulteta
              }); }} />
              <Button title="Izbriši" onPress={(e) => { e.stopPropagation(); brisiObavjestenje(); }} />
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  jednoObavjestenje: {
    display: 'flex',
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    padding: 20,
    color: '#0f75bd',
    width: 300,
    minHeight: 150,
    position: 'relative',
    marginVertical: 10
  },
  vrijemeNaslov: {
    justifyContent: 'space-between',
    alignItems:'center',
    width: '100%',
    color:'#0f75bd'
  },
  vrijemeObavjestenja: {
    fontSize: 12,
    color:'#0f75bd'
  },
  opis: {
    color:'#0f75bd'
  },
  naslovObavjestenje: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 2,
    margin: 0,
    color:'#0f75bd'

  },
  zvonceNeprocitano: {
    position: 'absolute',
    top: -5,
    right: -0,
    color: '#f7941d',
    fontSize: 30
  },
  tekstObavjestenja: {
    overflow: 'hidden',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 15,
    fontWeight: 'bold',
    color:'#0f75bd'

  },
  dugmadDiv: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 15
  }
});

export default Notification;
