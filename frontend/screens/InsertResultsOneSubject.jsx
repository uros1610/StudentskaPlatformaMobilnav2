import { StyleSheet, Text, View,ScrollView,TextInput,TouchableOpacity,Alert} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import { useState,useEffect,useContext} from 'react'
import axios from 'axios'
import { ActivityIndicator } from 'react-native'

const InsertResultsOneSubject = ({route,navigation}) => {

    const URL = process.env.EXPO_PUBLIC_API_URL;
    const [rezultati, setRezultati] = useState([]);
    const [studenti, setStudenti] = useState();
    const [sviDomaci, setSviDomaci] = useState([]);
    const [sviKolokvijumi, setSviKolokvijumi] = useState([]);
    const [sviPopravniKolokvijumi, setSviPopravniKolokvijumi] = useState([]);
    const [sviZavrsni, setSviZavrsni] = useState([]);
    const [sviPopravniZavrsni, setSviPopravniZavrsni] = useState([]);
    const [changedResults, setChangedResults] = useState([]);
    const [loading,setLoading] = useState(false);
    const {odabranPredmet,odabranSmjer,odabranFakultet} = route.params


    const [filter, setFilter] = useState({
        indeks: "",
        imeStudenta: "",
        prezimeStudenta: "",
    });



    const handleChange = (id, value) => {
        console.log(id,value);
        setFilter(prevFilter => ({
            ...prevFilter,
            [id]: value
        }));
    };

    const handleScoreChange = (studentId, id_provjere, newScore) => {
        setChangedResults(prevResults => {
            const studentIndex = prevResults.findIndex(result => result.studentId === studentId);
            if (studentIndex === -1) {
                return [...prevResults, { studentId, scores: { [id_provjere]: newScore } }];
            } else {
                const updatedResults = [...prevResults];
                updatedResults[studentIndex] = {
                    ...updatedResults[studentIndex],
                    scores: {
                        ...updatedResults[studentIndex].scores,
                        [id_provjere]: newScore
                    }
                };
                return updatedResults;
            }
        });
    };

    useEffect(() => {
        console.log(changedResults);
    }, [changedResults]);

    const fetchRezultati = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/profesor/sviRezultati/${odabranPredmet}/${odabranSmjer}/${odabranFakultet}`);
            const data = response.data;
            console.log(data);
            setRezultati(data);
            const filteredData = data.filter(student => student.korisnickoime_studenta === data[0].korisnickoime_studenta);
            setSviKolokvijumi(filteredData.filter(t => t.ime_provjere === 'Kolokvijum'));
            setSviPopravniKolokvijumi(filteredData.filter(t => t.ime_provjere === 'Popravni kolokvijum'));
            setSviZavrsni(filteredData.filter(t => t.ime_provjere === 'Ispit'));
            setSviPopravniZavrsni(filteredData.filter(t => t.ime_provjere === 'Popravni ispit'));
            setSviDomaci(filteredData.filter(t => t.ime_provjere === 'Domaci'));
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    const fetchStudenti = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL}/student/${odabranPredmet}/${odabranSmjer}/${odabranFakultet}`, {
                params: {
                    indeks: filter.indeks,
                    imeStudenta: filter.imeStudenta,
                    prezimeStudenta: filter.prezimeStudenta
                }
            });

            console.log("STUDENTI SU",response.data);
            setStudenti(response.data);
        } catch (err) {
            console.log(err);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        console.log(changedResults);
        try {
            const response = await axios.put(`${URL}/student/updateRezultat`, changedResults);
            console.log(response.data);
            Alert.alert('Success', 'Uspjesno Sacuvano!');
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchStudenti();
        fetchRezultati();
    }, [filter]);

    useEffect(() => {
        if(odabranPredmet && odabranSmjer && odabranFakultet) {
        fetchRezultati();
        fetchStudenti();
        }
    },[odabranPredmet,odabranSmjer,odabranFakultet])


  return (
    <SafeAreaView style = {styles.wrapForResults}>
      <Header/>
      <Text style={styles.header}>Upis rezultata</Text>

      {loading && <ActivityIndicator size={'large'}/>}

            {(<View style={styles.mainDivForResults}>
                <View style={styles.searchDiv}>
                    <TextInput
                        style={styles.input}
                        placeholder="Indeks"
                        onChangeText={(text) => handleChange('indeks', text)}
                        value={filter.indeks}
                        placeholderTextColor={'white'}

                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Ime studenta"
                        onChangeText={(text) => handleChange('imeStudenta', text)}
                        value={filter.imeStudenta}
                        placeholderTextColor={'white'}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Prezime studenta"
                        onChangeText={(text) => handleChange('prezimeStudenta', text)}
                        value={filter.prezimeStudenta}
                        placeholderTextColor={'white'}

                    />
                </View>
                <ScrollView horizontal>
                    <ScrollView style={styles.tableContainer}>
                        <View style={styles.table}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Student</Text>
                                <Text style={styles.tableHeaderText}>Indeks</Text>
                                {sviDomaci.map((_, idx) => <Text key={`domaci-${idx}`} style={styles.tableHeaderText}>Domaci {idx + 1}</Text>)}
                                {sviKolokvijumi.map((_, idx) => <Text key={`kolokvijum-${idx}`} style={styles.tableHeaderText}>Kolokvijum {idx + 1}</Text>)}
                                {sviPopravniKolokvijumi.map((_, idx) => <Text key={`popravni-kolokvijum-${idx}`} style={styles.tableHeaderText}>Popravni Kolokvijum {idx + 1}</Text>)}
                                {sviZavrsni.map((_, idx) => <Text key={`zavrsni-${idx}`} style={styles.tableHeaderText}>Zavrsni {idx + 1}</Text>)}
                                {sviPopravniZavrsni.map((_, idx) => <Text key={`popravni-zavrsni-${idx}`} style={styles.tableHeaderText}>Popravni Zavrsni {idx + 1}</Text>)}
                                <Text style={styles.tableHeaderText}>Ukupno</Text>
                            </View>
                            {studenti?.map(student => (
                                <View key={student.korisnickoIme} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{student.imeStudenta} {student.prezimeStudenta}</Text>
                                    <Text style={styles.tableCell}>{student.indeks}</Text>
                                    {rezultati?.filter(rezultat => (rezultat.korisnickoime_studenta === student.korisnickoIme && rezultat.ime_provjere === 'Domaci')).map((provjera) => (
                                        <TextInput
                                            key={provjera.id_provjere}
                                            style={styles.numberOfPoints}
                                            value={changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere] !== undefined
                                                ? changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere]?.toString()
                                                : provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
                                            onChangeText={(text) => handleScoreChange(student.korisnickoIme, provjera.id_provjere, text)}
                                            keyboardType="numeric"
                                        />
                                    ))}
                                    {rezultati?.filter(rezultat => (rezultat.korisnickoime_studenta === student.korisnickoIme && rezultat.ime_provjere === 'Kolokvijum')).map((provjera) => (
                                        <TextInput
                                            key={provjera.id_provjere}
                                            style={styles.numberOfPoints}
                                            value={changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere] !== undefined
                                                ? changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere]?.toString()
                                                : provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
                                            onChangeText={(text) => handleScoreChange(student.korisnickoIme, provjera.id_provjere, text)}
                                            keyboardType="numeric"
                                        />
                                    ))}
                                    {rezultati?.filter(rezultat => (rezultat.korisnickoime_studenta === student.korisnickoIme && rezultat.ime_provjere === 'Popravni kolokvijum')).map((provjera) => (
                                        <TextInput
                                            key={provjera.id_provjere}
                                            style={styles.numberOfPoints}
                                            value={changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere] !== undefined
                                                ? changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere]?.toString()
                                                : provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
                                            onChangeText={(text) => handleScoreChange(student.korisnickoIme, provjera.id_provjere, text)}
                                            keyboardType="numeric"
                                        />
                                    ))}
                                    {rezultati?.filter(rezultat => (rezultat.korisnickoime_studenta === student.korisnickoIme && rezultat.ime_provjere === 'Ispit')).map((provjera) => (
                                        <TextInput
                                            key={provjera.id_provjere}
                                            style={styles.numberOfPoints}
                                            value={changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere] !== undefined
                                                ? changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere]?.toString()
                                                : provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
                                            onChangeText={(text) => handleScoreChange(student.korisnickoIme, provjera.id_provjere, text)}
                                            keyboardType="numeric"
                                        />
                                    ))}
                                    {rezultati?.filter(rezultat => (rezultat.korisnickoime_studenta === student.korisnickoIme && rezultat.ime_provjere === 'Popravni ispit')).map((provjera) => (
                                        <TextInput
                                            key={provjera.id_provjere}
                                            style={styles.numberOfPoints}
                                            value={changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere] !== undefined
                                                ? changedResults.find(result => result.studentId === student.korisnickoIme)?.scores[provjera.id_provjere]?.toString()
                                                : provjera.broj_poena !== -100 ? provjera.broj_poena.toString() : ''}
                                            onChangeText={(text) => handleScoreChange(student.korisnickoIme, provjera.id_provjere, text)}
                                            keyboardType="numeric"
                                        />
                                    ))}
                                    <TextInput
                                        style={styles.numberOfPoints}
                                        value={changedResults.find(result => result.studentId === student.korisnickoIme)?.scores["ukupanBrojPoena"] !== undefined
                                            ? changedResults.find(result => result.studentId === student.korisnickoIme)?.scores["ukupanBrojPoena"]?.toString()
                                            : student.ukupanBrojPoena !== -100 ? student.ukupanBrojPoena.toString() : ''}
                                        onChangeText={(text) => handleScoreChange(student.korisnickoIme, 'ukupanBrojPoena', text)}
                                        keyboardType="numeric"
                                    />
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </ScrollView>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>)}

    </SafeAreaView>
  )
}

export default InsertResultsOneSubject

const styles = StyleSheet.create({
    wrapForResults: {
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        backgroundColor: 'rgb(240,240,240)',
        flexDirection: 'column',
    },
    header: {
        color: '#0f75bd',
        fontSize: 24,
        marginBottom: 20,
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
        width: 250,
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
        marginRight:50,
        textAlign: 'center',
        flex: 1,
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: 5,
    },
    tableCell: {
        textAlign: 'center',
        padding: 5,
        marginRight:50
    },
    numberOfPoints: {
        height: 25,
        minWidth: 50,
        textAlign: 'center',
        backgroundColor: 'rgb(240,240,240)',
        border: 'none',
        borderRadius: 5,
        flex: 1,
        paddingHorizontal:20,
        marginRight:50
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
