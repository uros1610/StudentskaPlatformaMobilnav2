import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faFileLines } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Header from '../components/Header';

const GradeSheet = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [ukupno, setUkupno] = useState(0);
  const [polozeni, setPolozeni] = useState([]);

  const subjPerPage = 5;

  const URL = 'http://192.168.206.205:8000';

  const fetchPolozeni = async () => {
    try {
      const response = await axios.get(`${URL}/polozeni/${currentPage}`);
      setPolozeni(response.data);
    } catch (err) {
      console.log("ovdje",err);
    }
  };

  const fetchUkupanBroj = async () => {
    try {
      const response = await axios.get(`${URL}/polozeni/brojPolozenih`);
      if (response.data && response.data.length > 0) {
        setUkupno(response.data[0].brojPolozenih);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUkupanBroj();
  }, []);

  useEffect(() => {
    fetchPolozeni();
  }, [currentPage]);

  useEffect(() => {
    console.log(polozeni)
  },[polozeni])

  const izracunaj = (brojPoena) => {
    if (brojPoena >= 90) {
      return 'A';
    }
    if (brojPoena >= 80) {
      return 'B';
    }
    if (brojPoena >= 70) {
      return 'C';
    }
    if (brojPoena >= 60) {
      return 'D';
    }
    if (brojPoena >= 50) {
      return 'E';
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Header />
      <View style={styles.gradeMain}>
        <View style={styles.gradeTitle}>
          <FontAwesomeIcon icon={faFileLines} style={styles.gradeIcon} size={32} />
          <Text style={styles.gradeTitleText}>Položeni ispiti</Text>
        </View>
        <ScrollView horizontal>
          <View style={styles.scrollContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.headerText}>Predmet</Text>
              <Text style={styles.headerText}>Ocjena</Text>
              <Text style={styles.headerText}>ECTS</Text>
              <Text style={styles.headerText}>Semestar</Text>
            </View>
            {polozeni.map((predmet, index) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.cellText}>{predmet.ime_predmeta}</Text>
                <Text style={styles.cellText}>{izracunaj(predmet.brojPoena)}</Text>
                <Text style={styles.cellText}>{predmet.broj_kredita}</Text>
                <Text style={styles.cellText}>{predmet.broj_semestra}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    width: '100%',
  },
  scrollContainer: {
    width: Dimensions.get('window').width,
    flex: 1,
  },
  gradeMain: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
    flexGrow: 1,
  },
  gradeTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  gradeIcon: {
    color: '#0f75bd',
  },
  gradeTitleText: {
    fontSize: 30,
    color: '#f7941d',
  },
  tableHeader: {
    backgroundColor: '#f7941d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  headerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tableRow: {
    backgroundColor: '#f7951d29',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cellText: {
    color: '#000',
    fontSize: 16,
  },
});

export default GradeSheet;
