// NotificationsMainPage.js

import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList,ActivityIndicator} from 'react-native';
import Header from '../components/Header';
import axios from 'axios';
import Notification from '../components/Notification';
import { RefreshControl } from 'react-native-gesture-handler';

const NotificationsMainPage = ({ route, navigation }) => {
  const { imePredmeta, imeSmjera, imeFakulteta } = route.params;
  const [obavjestenja, setObavjestenja] = useState([]);
  const [ukupno, setUkupno] = useState(0);
  const [neprocitana, setNeprocitana] = useState([]);
  const [refreshing,setRefreshing] = useState(false);
  const [loading,setLoading] = useState(false);


  
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchObavjestenja();
    await fetchNeprocitanaIbroj();
    setRefreshing(false);
  }


  const URL = 'http://192.168.206.205:8000';

  const fetchNeprocitanaIbroj = async () => {
    try {
      setLoading(true);
      const response2 = await axios.get(`${URL}/obavjestenje/neprocitanaObavjestenja/${imePredmeta}/${imeSmjera}/${imeFakulteta}`);
      console.log("sasf",response2.data[0]);
      setNeprocitana(response2.data);
    } catch (err) {
      console.log(err);
    }finally {
          
    setLoading(false);
    }
  };

  const fetchObavjestenja = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/obavjestenje/${imePredmeta}/${imeSmjera}/${imeFakulteta}`);
      setObavjestenja(response.data);
    } catch (err) {
      console.log(err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObavjestenja();
    fetchNeprocitanaIbroj();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      {loading && <View style = {styles.loadingWrap}><ActivityIndicator size="large" /></View>}

      {!loading && <FlatList refreshControl={<RefreshControl refreshing = {refreshing} onRefresh={onRefresh}/>}
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
      />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    alignItems:'center'
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default NotificationsMainPage;
