import React, { useContext, useEffect,useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../context/AuthContext';
import PredmetContext from '../context/PredmetContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import {useNavigation} from '@react-navigation/native'
import axios from 'axios'


const Home = () => {
  const { user } = useContext(AuthContext);
  const {predmeti, fetchPredmeti} = useContext(PredmetContext);
  const [refreshing,setRefreshing] = useState(false);

  
  const [numOfUnreadArray,setNumOfUnreadArray] = useState([]);

  const [broj,setBroj] = useState();


  const URL = 'http://192.168.206.205:8000';

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

  const navigator = useNavigation();

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPredmeti();
    await fetchUnreadNotifications();
    setRefreshing(false);
  }


  useEffect(() => {
    if (user) {
      fetchPredmeti();
      fetchUnreadNotifications();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchPredmeti();
      fetchUnreadNotifications();
    }
  },[])

  useEffect(() => {
    console.log(predmeti);
  }, [predmeti]);

  const handlePress = (event,predmet) => {
    event.preventDefault();
    navigator.navigate('NotificationsMainPage', {
      imePredmeta:predmet.imePredmeta,
      imeSmjera:predmet.imeSmjera,
      imeFakulteta:predmet.imeFakulteta
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header/>

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={predmeti}
        keyExtractor={(item) => `${item.imePredmeta}-${item.imeSmjera}-${item.imeFakulteta}`}
        renderItem={({ item }) => (

          <TouchableOpacity onPress={(e) => {handlePress(e,item)}}>
          <View style={styles.singleSubject}>
            <Text ellipsizeMode = "tail" style={styles.singleSubjectName}>{item.imePredmeta}</Text>
          </View>
          {numOfUnreadArray && parseInt(numOfUnreadArray.find(predmet => predmet.imePredmeta === item.imePredmeta && predmet.imeSmjera === item.imeSmjera && predmet.imeFakulteta === item.imeFakulteta)?.unreadCount) > 0 && <View style = {styles.noOfUnread}>
          
          
          <Text style = {{
            color:'white'
          }}>{numOfUnreadArray.find(predmet => predmet.imePredmeta === item.imePredmeta && predmet.imeSmjera === item.imeSmjera && predmet.imeFakulteta === item.imeFakulteta)?.unreadCount}</Text>

            
          </View>}



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
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },
  flatListContainer: {
    flexGrow:1,
    justifyContent: 'center',
    alignItems: 'center',
   
 
  },

  noOfUnread: {
    position:'absolute',
    backgroundColor:'#f7941d',
    alignItems:'center',
    justifyContent:'center',
    width:30,
    height:30,
    borderRadius:25,
    color:'white',
    right:0,
    top:-2
  },
  
  singleSubject: {
    position:'relative',
    marginVertical: 10,
    padding: 30,
    backgroundColor: '#0f74bd28',
    textDecorationStyle:'none',
    borderRadius: 5,
    flexDirection:'row',
    borderRadius:10,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    
  },
  singleSubjectName: {
    fontSize: 30,
    color: '#0f75bd',

  },
  
});

export default Home;
