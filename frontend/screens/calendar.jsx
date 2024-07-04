import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, SafeAreaView } from 'react-native';
import PredmetContext from '../context/PredmetContext'; // Adjust path as needed
import AuthContext from '../context/AuthContext'; // Adjust path as needed
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import Header from '../components/Header'

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { predmeti, fetchPredmeti } = useContext(PredmetContext);
  const { user } = useContext(AuthContext);
  const [sveProvjere, setSveProvjere] = useState([]);
  const [shownCell, setShownCell] = useState();
  const [filtered, setFiltered] = useState([]);
  const [open, setOpen] = useState(false);
  const [shownMonth, setShownMonth] = useState();

  const URL = 'http://192.168.206.205:8000'


  useEffect(() => {
    if (user) {
      fetchPredmeti();
    }
  }, [user]);

  useEffect(() => {
    if (predmeti.length > 0) {
      fetchProvjere();
    }
  }, [predmeti]);

  const fetchProvjere = async () => {
    try {
      const promises = predmeti.map(predmet =>
        axios.get(`${URL}/provjera/${predmet.imePredmeta}/${predmet.imeSmjera}/${predmet.imeFakulteta}`)
      );

      const responses = await Promise.all(promises);
      const allProvjere = responses.flatMap(response => response.data);

      setSveProvjere(allProvjere);
    } catch (err) {
      console.log(err);
    }
  };

  const filterByDate = (year, month, day) => {
    const monthsAbbreviated = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const clickedDate = new Date(year, month - 1, day);

    const filteredd = sveProvjere.filter((provjera) => {
      const provjeraDate = new Date(provjera.datum_odrzavanja).toString().split(" ");
      const yearr = parseInt(provjeraDate[3]);
      const dayy = parseInt(provjeraDate[2]);
      const monthh = monthsAbbreviated.findIndex(monthx => provjeraDate[1] === monthx);

      return (
        yearr === year && dayy === day && monthh === month
      );
    });

    setFiltered(filteredd);

    return filteredd;
  };

  const handleCellClick = (year, month, day) => {
    setOpen(true);
    filterByDate(year, month, day);
    setShownCell(day);
    setShownMonth(month);
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.navButton} onPress={prevMonth}>
          <FontAwesomeIcon icon={faChevronLeft} size={24} color='white' />
        </TouchableOpacity>
        <Text style={styles.headerText}>
          {currentDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
        </Text>
        <TouchableOpacity style={styles.navButton} onPress={nextMonth}>
          <FontAwesomeIcon icon={faChevronRight} size={24} color='white' />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDays = () => {
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <View style={styles.days}>
        {daysOfWeek.map((day, index) => (
          <View key={index} style={styles.day}>
            <Text>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    const rows = [];

    let days = [];
    let day = new Date(startDate);

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        days.push(
          <TouchableOpacity
            key={day}
            style={[
              styles.cell,
              
              { opacity: day.getMonth() !== currentDate.getMonth() ? 0.5 : 1 },
              filteredCellsStyle(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate()),
            ]}
            onPress={() => handleCellClick(cloneDay.getFullYear(), cloneDay.getMonth(), cloneDay.getDate())}
          >
            <Text style={styles.cellText}>{day.getDate()}</Text>

            {cloneDay.getDate() === shownCell && cloneDay.getMonth() === shownMonth && open && (
              <Modal animationType="slide" transparent={false} visible={open}>
                <View style={styles.modal}>
                  <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
                    <FontAwesomeIcon icon={faTimes} size={24} color="#0f75bd" />
                  </TouchableOpacity>
                  <View style={styles.provjere}>
                    {filtered.length > 0 ? (
                      <FlatList
                        data={filtered}
                        keyExtractor={(item,index) => index}
                        renderItem={({ item }) => (
                          <View style={styles.provjereItem}>
                            <Text style={{ color: '#0f75bd', fontSize:20}}>{item.ime_predmeta}</Text>
                            <Text style={{ color: '#0f75bd',fontSize:20}}>{item.ime_provjere}</Text>
                            <Text style={{ color: '#0f75bd',fontSize:20}}>{vrijeme(item.datum_odrzavanja)}</Text>
                          </View>
                        )}
                      />
                    ) : (
                      <Text>Nema provjera tog dana!</Text>
                    )}
                  </View>
                </View>
              </Modal>
            )}
          </TouchableOpacity>
        );
        day.setDate(day.getDate() + 1);
      }
      rows.push(
        <View key={day} style={styles.row}>
          {days}
        </View>
      );
      days = [];
    }

    return <View style={styles.cellsContainer}>{rows}</View>;
  };

  const filteredCellsStyle = (year, month, day) => {
    const filteredd = sveProvjere.filter((provjera) => {
      const provjeraDate = new Date(provjera.datum_odrzavanja).toString().split(" ");
      const yearr = parseInt(provjeraDate[3]);
      const dayy = parseInt(provjeraDate[2]);
      const monthsAbbreviated = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const monthh = monthsAbbreviated.findIndex(monthx => provjeraDate[1] === monthx);


      return (
        yearr === year && dayy === day && monthh === month
      );
    });


    return {
      borderWidth: filteredd.length > 0 ? 3 : 0,
      borderColor: filteredd.length > 0 ? '#f7941d' : 'transparent',
    };
  };

  const vrijeme = (timestamp) => {
    const date = new Date(timestamp);
    const localizedHour = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    return localizedHour;
  };

  const nextMonth = () => {
    setShownCell(undefined);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setShownCell(undefined);
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  return (
    <SafeAreaView style={styles.calendar}>
      <Header/>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  calendar: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: '100%',
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#0F75BD',
    width: '100%',
  },
  navButton: {
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  days: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '100%',
  },
  day: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  cellsContainer: {
    flexDirection: 'column',
    borderColor: '#ccc',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    height: 80,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    margin: 1,
  },
  cellText: {
    textAlign: 'center',
  },
  modal: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  provjere: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    fontSize: 16,
  },
  provjereItem: {
    marginBottom: 10,
    alignItems: 'center',
    
  },
});

export default Calendar;
