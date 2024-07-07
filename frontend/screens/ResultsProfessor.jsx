import React, { useState, useEffect, useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';
import {
    View,
    Text,
    TextInput,
    Button,
    ScrollView,
    StyleSheet,
    Alert,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropdownComponent from '../components/DropdownMenu';
import AuthContext from '../context/AuthContext';
import PredmetContext from '../context/PredmetContext';
import Header from '../components/Header';
import { RawButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

const InsertResults = () => {

    const {user} = useContext(AuthContext);

    const [odabranFakultet, setOdabranFakultet] = useState(null);
    const [odabranSmjer, setOdabranSmjer] = useState(null);
    const [odabranPredmet, setOdabranPredmet] = useState(null);
    const [fakulteti, setFakulteti] = useState([]);
    const [smjerovi, setSmjerovi] = useState([]);
    const [predmetiFiltrirani, setPredmetiFiltrirani] = useState([]);
    const {predmeti,fetchPredmeti} = useContext(PredmetContext);
    const navigation = useNavigation();


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
  }, [user]);

  const handlePress = () => {
    navigation.navigate('InsertResultsOneSubject',{
        odabranPredmet:odabranPredmet,
        odabranFakultet:odabranFakultet,
        odabranSmjer:odabranSmjer
    })
  }


  const fetchFakulteti = async () => {
    try {
      const response = await axios.get(`${URL}/profesor/sviFakultetiProfesora`);
      setFakulteti(response.data);
      setOdabranFakultet(response.data.length > 0 ? response.data[0].imeFakulteta : null);
    } catch (error) {
      console.log("Error fetching fakulteti:", error);
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

    return (
        <SafeAreaView style={styles.wrapForResults}>
            <Header/>
            <Text style={styles.header}>Upis rezultata</Text>

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

        <TouchableOpacity style = {styles.newNotif} onPress={handlePress}>
            <Text style = {styles.textNewNotif}>Upišite rezultate</Text>
        </TouchableOpacity>
            
        </SafeAreaView>
    );
};

export default InsertResults;

const styles = StyleSheet.create({
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
    wrapForResults: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        flexDirection: 'column',
    },
    header: {
      color:'#0f75bd',
      fontSize:35,
      fontWeight:'bold'
    },
    mainDivForResults: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        width: '100%',
        marginTop: 50,
        marginBottom: 50,
    },
    searchDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 10,
        width: '70%',
    },
    input: {
        backgroundColor: '#f7941d',
        color: 'white',
        border: 'none',
        borderRadius: 20,
        padding: 10,
        width: '50%',
        marginBottom: 10,
    },
    tableContainer: {
        width: '100%',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f7941d',
    },
    tableHeaderText: {
        color: 'white',
        padding: 15,
        textAlign: 'center',
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    tableCell: {
        textAlign: 'center',
        flex: 1,
        padding: 5,
    },
    numberOfPoints: {
        height: 25,
        minWidth: 50,
        textAlign: 'center',
        backgroundColor: 'rgb(240,240,240)',
        border: 'none',
        borderRadius: 5,
        flex: 1,
    },
    saveButton: {
        marginTop: 10,
        backgroundColor: '#f7941d',
        borderRadius: 10,
        padding: 15,
    },
    saveButtonText: {
        color: '#E8EDF0',
        textAlign: 'center',
    }
});

