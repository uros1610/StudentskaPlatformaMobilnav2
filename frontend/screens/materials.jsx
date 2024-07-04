import React, { useContext, useEffect,useState} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../context/AuthContext';
import PredmetContext from '../context/PredmetContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
/*
display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 200px;
  height: 200px;
  margin: 12px;
  border-radius: 10px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow: hidden;
  box-shadow: 10px 5px 5px rgba(2, 67, 232, 0.078);
  color: #0f75bd;
  background-color: #0f74bd28;
  gap: 10px;
  text-decoration: none;
  word-break: break-all;
  padding:10px;

*/

const Home = () => {
  const { user } = useContext(AuthContext);
  const { predmeti, fetchPredmeti } = useContext(PredmetContext);
  const [refreshing,setRefreshing] = useState(false);


  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPredmeti();
    setRefreshing(false);
  }


  useEffect(() => {
    if (user) {
      fetchPredmeti();
    }
  }, [user]);

  useEffect(() => {
    console.log(predmeti);
  }, [predmeti]);

  const handlePress = () => {
    
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header/>

      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={predmeti}
        keyExtractor={(item) => `${item.imePredmeta}-${item.imeSmjera}-${item.imeFakulteta}`}
        renderItem={({ item }) => (

          <TouchableOpacity onPress={handlePress}>
          <View style={styles.singleSubject}>
            <Text ellipsizeMode = "tail" style={styles.singleSubjectName}>{item.imePredmeta}</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },
  flatListContainer: {
    flexGrow:1,
    justifyContent: 'center',
    alignItems: 'center',
   
 
  },

  
  
  singleSubject: {
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
