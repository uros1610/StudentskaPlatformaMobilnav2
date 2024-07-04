const express = require('express')
const http = require('http')
const cors = require('cors')


const app = express()
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

app.use(express.static('public'))
app.use('/student',require('./routes/student'));
app.use('/profesor',require('./routes/profesor'));
app.use('/obavjestenje',require('./routes/obavjestenje'));
app.use('/auth',require('./routes/auth'));
app.use('/provjera',require('./routes/provjera'))
app.use('/polozeni',require('./routes/polozeni'))
app.use('/materijal',require('./routes/materijal'));



server.listen(8000,() => {
    console.log("Connected!");
})


/*
import React, { useContext, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthContext from '../../context/AuthContext';
import PredmetContext from '../../context/PredmetContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const { predmeti, fetchPredmeti } = useContext(PredmetContext);

  useEffect(() => {
    if (user) {
      fetchPredmeti();
    }
  }, [user]);

  useEffect(() => {
    console.log(predmeti);
  }, [predmeti]);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={styles.flatListContainer}
        data={predmeti}
        keyExtractor={(item) => `${item.imePredmeta}-${item.imeSmjera}-${item.imeFakulteta}`}
        renderItem={({ item }) => (
          <View style={styles.singleSubject}>
            <Text style={styles.singleSubjectName}>{item.imePredmeta}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatListContainer: {
    flexGrow:1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  singleSubject: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleSubjectName: {
    fontSize: 18,
  },
});

export default Home;

*/
