import React, { useState, createContext, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const PredmetContext = createContext({});

export const PredmetContextProvider = ({ children }) => {
    const { user,logout} = useContext(AuthContext);
    const [predmeti, setPredmeti] = useState([]);

    const URL = process.env.EXPO_PUBLIC_API_URL;

    const fetchPredmeti = async () => {
        try {
            if (user) {
                
                if (user.rola === 'Student') {
                    const response = await axios.get(`${URL}/student/sviPredmetiStudenta`);
                    setPredmeti(response.data);
                } else if (user.rola === 'Profesor') {
                    const response = await axios.get(`${URL}/profesor/sviPredmetiProfesora`);
                    setPredmeti(response.data);
                }
            }
        } catch (err) {
            console.error('Failed to fetch predmeti:', err);
        }
    };

    useEffect(() => {
        if (user) {
            fetchPredmeti();
        } else {
            setPredmeti([]);
        }
    }, [user]);

    return (
        <PredmetContext.Provider value={{ predmeti, fetchPredmeti }}>
            {children}
        </PredmetContext.Provider>
    );
};

export default PredmetContext;
