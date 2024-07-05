import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';

const NewNotification = ({ route }) => {
  const { params } = route;
  const { imePredmeta, imeSmjera, imeFakulteta, id } = params;

  const [naslov, setNaslov] = useState("");
  const [opis, setOpis] = useState("");
  const [error, setError] = useState("");

  const navigation = useNavigation();

  const URL = process.env.EXPO_PUBLIC_API_URL;

  const klikDugme = async () => {
    if (!naslov) {
      setError("Naslov");
      return;
    }

    if (!opis) {
      setError("Opis");
      return;
    }

    try {
      if (!id) {
        const response = await axios.post(`${URL}/obavjestenje/${imePredmeta}/${imeSmjera}/${imeFakulteta}`, { opis, naslov });
        Alert.alert("Obavještenje uspješno okačeno!");
        navigation.navigate('NotificationsHome', { imePredmeta, imeSmjera, imeFakulteta });
      } else {
        const response = await axios.put(`${URL}/obavjestenje/${id}`, { opis, naslov });
        Alert.alert("Obavještenje uspješno izmijenjeno!");
        navigation.navigate('NotificationsHome', { imePredmeta, imeSmjera, imeFakulteta });
      }
    } catch (err) {
      Alert.alert("Obavještenje nije uspješno okačeno/izmjenjeno!");
    }
  };

  const fetchObavjestenje = async () => {
    try {
      const response = await axios.get(`${URL}/obavjestenje/${id}`);
      setNaslov(response.data[0].naslov);
      setOpis(response.data[0].opis);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (id) {
      fetchObavjestenje();
    }
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.wrapperContainer}>
      <Header/>
      <View style={styles.novoObavjestenjeDiv}>
        <Text style={styles.naslovText}>{imePredmeta}</Text>

        {error && <Text style={styles.errorPoruka}>{`${error} ne može da bude prazan!`}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Naslov obavještenja"
          value={naslov}
          onChangeText={text => { setNaslov(text); if (error === 'Naslov') { setError("") } }}
        />

        <TextInput
          style={[styles.input, { height: 150 }]}
          placeholder="Opis obavještenja"
          multiline={true}
          value={opis}
          onChangeText={text => { setOpis(text); if (error === 'Opis') { setError("") } }}
        />

        <TouchableOpacity style={styles.okaciObavjestenje} onPress={klikDugme}>
          <Text style={styles.novoObavjestenjeSpan}>{!id ? 'Okačite novo obavještenje' : 'Izmijeni obavještenje'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default NewNotification;

const styles = StyleSheet.create({
  wrapperContainer: {
    flexGrow: 1,
    backgroundColor: 'white',
  },
  novoObavjestenjeDiv: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 20,
  },
  naslovText: {
    color: '#0f75bd',
    fontSize: 25,
    textAlign: 'center',
    paddingVertical: 20,
  },
  input: {
    width: '80%',
    minWidth: 200,
    padding: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#0f75bd',
    marginBottom: 20,
  },
  errorPoruka: {
    fontWeight: 'bold',
    color: '#0f75bd',
    fontSize: 16,
    marginBottom: 10,
  },
  okaciObavjestenje: {
    backgroundColor: '#f7941d',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  novoObavjestenjeSpan: {
    color: 'white',
    fontSize: 18,
  },
});
