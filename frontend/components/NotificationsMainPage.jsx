// NotificationsMainPage.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import Header from './Header';
import axios from 'axios';
import Notification from '../components/Notification';

const NotificationsMainPage = ({ route, navigation }) => {
  const { imePredmeta, imeSmjera, imeFakulteta } = route.params;
  const [obavjestenja, setObavjestenja] = useState([]);
  const [ukupno, setUkupno] = useState(0);
  const [neprocitana, setNeprocitana] = useState([]);

  const URL = 'http://192.168.206.205:8000';

  const fetchNeprocitanaIbroj = async () => {
    try {
      const response2 = await axios.get(`${URL}/obavjestenje/neprocitanaObavjestenja/${imePredmeta}/${imeSmjera}/${imeFakulteta}`);
      setNeprocitana(response2.data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchObavjestenja = async () => {
    try {
      const response = await axios.get(`${URL}/obavjestenje/${imePredmeta}/${imeSmjera}/${imeFakulteta}`);
      setObavjestenja(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchObavjestenja();
    fetchNeprocitanaIbroj();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <FlatList
        data={obavjestenja}
        keyExtractor={(item) => item.id_obavjestenja}
        renderItem={({ item }) => (
          <Notification
            naslov={item.naslov}
            opis={item.opis}
            id={item.id_obavjestenja}
            datumKreiranja={item.datum_kreiranja}
            neProcitana={neprocitana}
            setNeprocitana={setNeprocitana}
            obavjestenja={obavjestenja}
            setObavjestenja={setObavjestenja}
          />
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems:'center'
  },
});

export default NotificationsMainPage;
