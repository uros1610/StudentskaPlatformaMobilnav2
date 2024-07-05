import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const DropdownComponent = ({ 
  fakulteti, 
  smjerovi, 
  predmeti,
  odabranFakultet, 
  odabranSmjer, 
  odabranPredmet, 
  setOdabranFakultet, 
  setOdabranSmjer, 
  setOdabranPredmet 
}) => {
  
  const mappedFakulteti = fakulteti.map(fakultet => ({
    label: fakultet.imeFakulteta,
    value: fakultet.imeFakulteta,
  }));

  const mappedSmjerovi = smjerovi.map(smjer => ({
    label: smjer.imeSmjera,
    value: smjer.imeSmjera
  }));

  const mappedPredmeti = predmeti.map(predmet => ({
    label: predmet.imePredmeta,
    value: predmet.imePredmeta,
  }));

  

  console.log('Mapped Fakulteti:', mappedFakulteti);

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  return (
    <View>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={mappedFakulteti} // Use mappedFakulteti data
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={odabranFakultet}
        onChange={item => {
          console.log('Selected Fakultet:', item);
          setOdabranFakultet(item.value);
        }}
        
        renderItem={renderItem}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={mappedSmjerovi} // Use mappedFakulteti data
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={odabranSmjer}
        onChange={item => {
          console.log('Selected Fakultet:', item);
          setOdabranSmjer(item.value);
        }}
        
        renderItem={renderItem}
      />
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={mappedPredmeti}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder="Select item"
        searchPlaceholder="Search..."
        value={odabranPredmet}
        onChange={item => {
          console.log('Selected Fakultet:', item);
          setOdabranPredmet(item.value);
        }}
       
        renderItem={renderItem}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width: 350,
    elevation: 2,
  },
  icon: {
    marginRight: 5,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
