import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../context/AuthContext';
import PredmetContext from '../context/PredmetContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DropdownComponent from '../components/DropdownMenu';
import Notification from '../components/Notification';

const Notifications = () => {
  const { user } = useContext(AuthContext);
  const { predmeti, fetchPredmeti } = useContext(PredmetContext);
  const [refreshing, setRefreshing] = useState(false);
 
  const [numOfUnreadArray, setNumOfUnreadArray] = useState([]);

  
  const [loading, setLoading] = useState(true);
  const [obavjestenja, setObavjestenja] = useState([]);

  const [odabranFakultet, setOdabranFakultet] = useState(null);
  const [odabranSmjer, setOdabranSmjer] = useState(null);
  const [odabranPredmet, setOdabranPredmet] = useState(null);
  const [fakulteti, setFakulteti] = useState([]);
  const [smjerovi, setSmjerovi] = useState([]);
  const [predmetiFiltrirani, setPredmetiFiltrirani] = useState([]);


  const URL = process.env.EXPO_PUBLIC_API_URL;

  const handleFakultetChange = (name) => {
    setOdabranFakultet(name);
  };

  const handleSmjerChange = (name) => {
    setOdabranSmjer(name);
  };

  const handlePredmetChange = (name) => {
    setOdabranPredmet(name);
  };

  useEffect(() => {
    if (user && user.rola === 'Profesor') {
      fetchPredmeti();
      fetchFakulteti();
    }
    fetchUnreadNotifications();
  }, [user]);

  useEffect(() => {
    fetchUnreadNotifications();
  },[])

  const fetchFakulteti = async () => {
    try {
      const response = await axios.get(`${URL}/profesor/sviFakultetiProfesora`);
      setFakulteti(response.data);
      setOdabranFakultet(response.data.length > 0 ? response.data[0].imeFakulteta : null);
    } catch (error) {
      console.log("Error fetching fakulteti:", error);
    }
  };

  const fetchUnreadNotifications = async () => {
    try {
      const results = [];
  
      for (const predmet of predmeti) {
        try {
          const response = await axios.get(`${URL}/obavjestenje/brojNeprocitanih/${predmet.imePredmeta}/${predmet.imeSmjera}/${predmet.imeFakulteta}`);
          
          results.push({ ...predmet, unreadCount: response.data[0].brojNeprocitanih});
          console.log(results)
        } catch (err) {
          console.log(err);
        }
      }
  
      setNumOfUnreadArray(results);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  const fetchObavjestenja = async () => {
    setLoading(true);
    try {
      if (odabranPredmet && odabranSmjer && odabranFakultet) {
        const response = await axios.get(`${URL}/obavjestenje/${odabranPredmet}/${odabranSmjer}/${odabranFakultet}`);
        console.log("Fetched Obavjestenja:", response.data);
        setObavjestenja(response.data);
      }
    } catch (err) {
      console.log("Error fetching obavjestenja:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmjerovi = async () => {
    try {
      if (odabranFakultet) {
        const response = await axios.get(`${URL}/profesor/sviSmjeroviProfesora/${odabranFakultet}`);
        setSmjerovi(response.data);
        setOdabranSmjer(response.data.length > 0 ? response.data[0].imeSmjera : null);
      }
    } catch (error) {
      console.log("Error fetching smjerovi:", error);
    }
  };

  useEffect(() => {
    if (odabranFakultet) {
      fetchSmjerovi();
    }
  }, [odabranFakultet]);

  useEffect(() => {
    const filtrirani = predmeti.filter(
      (predmet) => predmet.imeFakulteta === odabranFakultet && predmet.imeSmjera === odabranSmjer
    );
    setPredmetiFiltrirani(filtrirani);
    if (filtrirani.length > 0) {
      setOdabranPredmet(filtrirani[0]?.imePredmeta);
    } else {
      setOdabranPredmet(null);
    }
  }, [odabranSmjer, predmeti]);

  useEffect(() => {
    
    fetchObavjestenja();
    
  }, [odabranPredmet]);

  const navigator = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPredmeti();
    if (user && user.rola === 'Profesor') {
      await fetchFakulteti();
      await fetchSmjerovi();
    }
    await fetchUnreadNotifications();
    setRefreshing(false);
  };

  const handlePress = (event, predmet) => {
    event.preventDefault();
    navigator.navigate('NotificationsMainPage', {
      imePredmeta: predmet.imePredmeta,
      imeSmjera: predmet.imeSmjera,
      imeFakulteta: predmet.imeFakulteta
    });
  };

  const handlePressProfessors = (event) => {
    event.preventDefault();
    navigator.navigate('NotificationsMainPage', {
      imePredmeta: odabranPredmet,
      imeSmjera: odabranSmjer,
      imeFakulteta: odabranFakultet
    });
  };

  const handleAddNotif = (event) => {
    event.preventDefault();
    navigator.navigate('NewNotification', {
      imePredmeta: odabranPredmet,
      imeSmjera: odabranSmjer,
      imeFakulteta: odabranFakultet
    });
  };

 

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <Text style = {styles.textNewNotiff}>
              Obavještenja
            </Text>

      {user && user.rola === 'Profesor' && (
        <View style={{ minHeight: 300, alignItems:'center'}}>

          <TouchableOpacity style = {styles.newNotif} onPress={handlePressProfessors}>
            
            <Text style = {styles.textNewNotif}>
              Prikaži sva obavještenja
            </Text>
          
          </TouchableOpacity>

          <DropdownComponent
            handleFakultetChange={handleFakultetChange}
            handleSmjerChange={handleSmjerChange}
            handlePredmetChange={handlePredmetChange}
            fakulteti={fakulteti}
            smjerovi={smjerovi}
            predmeti={predmetiFiltrirani}
            odabranFakultet={odabranFakultet}
            odabranSmjer={odabranSmjer}
            odabranPredmet={odabranPredmet}
            setOdabranFakultet={setOdabranFakultet}
            setOdabranPredmet={setOdabranPredmet}
            setOdabranSmjer={setOdabranSmjer}
          />

          <TouchableOpacity style = {styles.newNotif} onPress={handleAddNotif}>
            
            <Text style = {styles.textNewNotif}>
              Dodaj obavještenje
            </Text>
          
          </TouchableOpacity>
        </View>
      )}

      

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={user.rola === 'Student' ? predmeti : []}
        keyExtractor={(item) => `${item.imePredmeta}-${item.imeSmjera}-${item.imeFakulteta}`}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={(e) => { handlePress(e, item) }}>
            <View style={styles.singleSubject}>
              <Text ellipsizeMode="tail" style={styles.singleSubjectName}>{item.imePredmeta}</Text>
              {numOfUnreadArray && parseInt(numOfUnreadArray.find(predmet => predmet.imePredmeta === item.imePredmeta && predmet.imeSmjera === item.imeSmjera && predmet.imeFakulteta === item.imeFakulteta)?.unreadCount) > 0 &&
                <View style={styles.noOfUnread}>
                  <Text style={{ color: 'white' }}>{numOfUnreadArray.find(predmet => predmet.imePredmeta === item.imePredmeta && predmet.imeSmjera === item.imeSmjera && predmet.imeFakulteta === item.imeFakulteta)?.unreadCount}</Text>
                </View>}
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%'
  },
  profesorNotifs: {
    marginBottom:300,
    paddingBottom:200
  },

  newNotif: {
    backgroundColor:'white',
    paddingHorizontal:30,
    paddingVertical:15,
    color:'#0f75bd',
  },
  textNewNotif: {
    color:'#0f75bd',
    fontSize:15,
    fontWeight:'bold'

  },
  textNewNotiff: {
    color:'#0f75bd',
    fontSize:35,
    fontWeight:'bold',
    marginBottom:15,

  },

  flatListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noOfUnread: {
    position: 'absolute',
    backgroundColor: '#f7941d',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 25,
    color: 'white',
    right: 0,
    top: -15
  },
  singleSubject: {
    position: 'relative',
    marginVertical: 10,
    padding: 30,
    backgroundColor: '#0f74bd28',
    textDecorationStyle: 'none',
    borderRadius: 5,
    flexDirection: 'row',
    borderRadius: 10,
    border: '1px solid rgba(0, 0, 0, 0.1)',
  },
  singleSubjectName: {
    fontSize: 30,
    color: '#0f75bd',
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Notifications;
