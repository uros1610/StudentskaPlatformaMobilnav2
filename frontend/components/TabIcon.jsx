import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const TabIcon = ({ icon, color, name, focused }) => {
    return (
        <View style={styles.iconTextView}>
            <FontAwesomeIcon icon={icon} style={styles.icons} color={color} size={20} />
            <Text style={focused ? styles.bold : styles.normal}>{name}</Text>
        </View>
    );
};

export default TabIcon

const styles = StyleSheet.create({
    bold: {
        fontWeight: 'bold',
        color: '#f7941d'
    },
    normal: {
        fontWeight: 'normal',
        color: '#0f75bd'
    },
    iconTextView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    icons: {
        marginBottom: 5
    }
});
