import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import PredmetContext from '../context/PredmetContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPoll } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'; // Assuming you're using react-navigation for navigation

const ResultsTest = () => {
  const { user } = useContext(AuthContext);
  const { predmeti, fetchPredmeti } = useContext(PredmetContext);
  const [sviDomaci, setSviDomaci] = useState([]);
  const [sviKolokvijumi, setSviKolokvijumi] = useState([]);
  const [sviPopravniKolokvijumi, setSviPopravniKolokvijumi] = useState([]);
  const [sviZavrsni, setSviZavrsni] = useState([]);
  const [sviPopravniZavrsni, setSviPopravniZavrsni] = useState([]);
  const [rezultati, setRezultati] = useState([]);
  const [refreshing,setRefreshing] = useState(false);
  const navigation = useNavigation();




  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRezultati();
    setRefreshing(false);
  }


  const URL = process.env.EXPO_PUBLIC_API_URL;

  const fetchRezultati = async () => {
    try {
      const response = await axios.get(`${URL}/student/sviRezultati`);
      const data = response.data;
      setRezultati(data);
      const filteredData = data.filter(student => student.korisnickoime_studenta === data[0].korisnickoime_studenta);
      setSviKolokvijumi(filteredData.filter(t => t.ime_provjere === 'Kolokvijum'));
      setSviPopravniKolokvijumi(filteredData.filter(t => t.ime_provjere === 'Popravni kolokvijum'));
      setSviZavrsni(filteredData.filter(t => t.ime_provjere === 'Ispit'));
      setSviPopravniZavrsni(filteredData.filter(t => t.ime_provjere === 'Popravni ispit'));
      setSviDomaci(filteredData.filter(t => t.ime_provjere === 'Domaci'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
   
    if (user) {
      fetchPredmeti();
      fetchRezultati();
    }

   
  }, [user]);

  useEffect(() => {
    if (user && user.rola === 'Profesor') {
      
      navigation.navigate('profile');
    }
  },[])

  const izracunaj = (brojPoena) => {
    if (brojPoena >= 90) return 'A';
    if (brojPoena >= 80) return 'B';
    if (brojPoena >= 70) return 'C';
    if (brojPoena >= 60) return 'D';
    if (brojPoena >= 50) return 'E';
    return 'F';
  };

  const renderHeader = (predmet) => {
    const domaciCount = sviDomaci.filter(t => t.ime_predmeta === predmet.imePredmeta).length;
    const kolokvijumCount = sviKolokvijumi.filter(t => t.ime_predmeta === predmet.imePredmeta).length;
    const popravniKolokvijumCount = sviPopravniKolokvijumi.filter(t => t.ime_predmeta === predmet.imePredmeta).length;
    const zavrsniCount = sviZavrsni.filter(t => t.ime_predmeta === predmet.imePredmeta).length;
    const popravniZavrsniCount = sviPopravniZavrsni.filter(t => t.ime_predmeta === predmet.imePredmeta).length;

    return (
      <View style={styles.headerRow}>
        {[...Array(domaciCount)].map((_, idx) => (
          <Text style={styles.headerText} key={`domaci-${idx}`}>Domaci {idx + 1}</Text>
        ))}
        {[...Array(kolokvijumCount)].map((_, idx) => (
          <Text style={styles.headerText} key={`kolokvijum-${idx}`}>Kolokvijum {idx + 1}</Text>
        ))}
        {[...Array(popravniKolokvijumCount)].map((_, idx) => (
          <Text style={styles.headerText} key={`popravniKolokvijum-${idx}`}>Popravni Kolokvijum {idx + 1}</Text>
        ))}
        {[...Array(zavrsniCount)].map((_, idx) => (
          <Text style={styles.headerText} key={`zavrsni-${idx}`}>Zavrsni {idx + 1}</Text>
        ))}
        {[...Array(popravniZavrsniCount)].map((_, idx) => (
          <Text style={styles.headerText} key={`popravniZavrsni-${idx}`}>Popravni Zavrsni {idx + 1}</Text>
        ))}
        <Text style={styles.headerText}>Ukupno / Ocjena</Text>
      </View>
    );
  };

  const renderBody = (predmet) => {
    const domaci = sviDomaci.filter(t => t.ime_predmeta === predmet.imePredmeta);
    const kolokvijumi = sviKolokvijumi.filter(t => t.ime_predmeta === predmet.imePredmeta);
    const popravniKolokvijumi = sviPopravniKolokvijumi.filter(t => t.ime_predmeta === predmet.imePredmeta);
    const zavrsni = sviZavrsni.filter(t => t.ime_predmeta === predmet.imePredmeta);
    const popravniZavrsni = sviPopravniZavrsni.filter(t => t.ime_predmeta === predmet.imePredmeta);

    return (
      <View style={styles.bodyRow}>
        {domaci.map(provjera => (
          <TextInput
            style={styles.numberOfPoints}
            value={provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
            editable={false}
            key={`domaci-points-${provjera.id_provjere}`}
          />
        ))}
        {kolokvijumi.map(provjera => (
          <TextInput
            style={styles.numberOfPoints}
            value={provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
            editable={false}
            key={`kolokvijum-points-${provjera.id_provjere}`}
          />
        ))}
        {popravniKolokvijumi.map(provjera => (
          <TextInput
            style={styles.numberOfPoints}
            value={provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
            editable={false}
            key={`popravniKolokvijum-points-${provjera.id_provjere}`}
          />
        ))}
        {zavrsni.map(provjera => (
          <TextInput
            style={styles.numberOfPoints}
            value={provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
            editable={false}
            key={`zavrsni-points-${provjera.id_provjere}`}
          />
        ))}
        {popravniZavrsni.map(provjera => (
          <TextInput
            style={styles.numberOfPoints}
            value={provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
            editable={false}
            key={`popravniZavrsni-points-${provjera.id_provjere}`}
          />
        ))}
        <TextInput
          style={styles.numberOfPoints}
          value={`${predmet.ukupanBrojPoena} / ${izracunaj(predmet.ukupanBrojPoena)}`}
          editable={false}
          key={`total-points-${predmet.imePredmeta}`}
        />
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView contentContainerStyle={styles.container} refreshControl={<RefreshControl refreshing = {refreshing} onRefresh={onRefresh}/>}>
        <Header/>
        <View>
          <Text style = {styles.pregledRez}>Pregled rezultata</Text>
        </View>
        {predmeti.map((predmet) => (
          <View style={styles.mainDivForResults} key={predmet.imePredmeta}>
            <Text style={styles.predmetIme}>{predmet.imePredmeta}</Text>
            <ScrollView horizontal contentContainerStyle={styles.table}>
              {renderHeader(predmet)}
              {renderBody(predmet)}
            </ScrollView>
          </View>
        ))}
        
      </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'rgb(240,240,240)',
  },
  mainDivForResults: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '100%',
    marginBottom: 20,
  },
  predmetIme: {
    color: '#f7941d',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    flexDirection: 'column',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f7941d',
  },
  headerText: {
    color: 'white',
    padding: 15,
    textAlign: 'center',
  },
  bodyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  numberOfPoints: {
    height: 25,
    minWidth: 50,
    width: 60,
    textAlign: 'center',
    backgroundColor: 'rgb(240,240,240)',
    color:'#0f75bd',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    margin: 5,
  },
  pregledRez: {
    marginBottom:30,
    marginTop:30,
    fontSize:25,
    color:'#0f75bd'
  }
});

export default ResultsTest;
