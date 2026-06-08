import { StyleSheet, Text, TextInput, View, Image, Pressable, ScrollView } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect } from 'expo-router';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { destinations } from '../constants/countries';
import { useRouter } from 'expo-router';
import Spacer from '../components/Spacer';

const favoritesTab = () => {
    const [storedListState, setStoredList] = useState([]);
    const router = useRouter();
    const [countryInput, setCountryInput] = useState('');
    const removeCountry = async (checkingCountry, checkingMonth) => {
        try {
            let storedList = await AsyncStorage.getItem('favorites');
            if (storedList != null) {
                let parsedList = JSON.parse(storedList);
                
                // Išfiltruojam ir pašalinam konkrečią šalį ir mėnesį
                parsedList = parsedList.filter(
                    element => !(element.destination === checkingCountry && element.month === checkingMonth)
                );
                
                // Atnaujinam AsyncStorage
                await AsyncStorage.setItem('favorites', JSON.stringify(parsedList));
                
                // Atnaujinam vietinį state, kad šalis iškart dingtų iš ekrano
                setStoredList(parsedList);
            }
        } catch (e) {
            console.error("Klaida trinant šalį:", e);
        }
    }

    // Užkraunam duomenis kaskart, kai vartotojas ateina į šį tabą
    useFocusEffect(
        useCallback(() => {
            (async () => {
                let storedList = await AsyncStorage.getItem('favorites');
                if (storedList == null) {
                    setStoredList([]);
                } else {
                    setStoredList(JSON.parse(storedList));
                }
            })();
        }, [])
    );

    const searchedResults = storedListState.filter(result => 
        result.destination.toLowerCase().includes(countryInput.toLowerCase())
    );

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}>
            {storedListState.length === 0 ? (
                <View style={{ padding: 20, marginTop: 50 }}>
                    <Text style={{ fontSize: 18, textAlign: 'center' }}>You currently have no favorited locations</Text>
                </View>
            ) : (
                <>
                    <Text style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center', marginTop: 20 }}>
                        Your favorite location and month combinations
                    </Text>
                    <Spacer />
                    <TextInput 
                        placeholder='Type country name' 
                        style={styles.countrySearch} 
                        onChangeText={(text) => setCountryInput(text)} 
                    />
                    <Spacer />
                    {searchedResults.map((item, index) => {
                        return (
                            <Pressable 
                                key={`${item.destination}-${item.month}-${index}`} 
                                style={{ width: '100%', alignItems: 'center' }} 
                                onPress={() => router.push({
                                    pathname: '/destinationDetails', 
                                    params: {
                                        code: item.countryCode,
                                        month: item.month
                                    }
                                })}
                            >
                                <View style={[styles.destinationContainer, { overflow: 'hidden' }]}>
                                    <Image source={{ uri: item.photo }} style={styles.destinationImage} />
                                    <Pressable 
                                        style={styles.favoriteButton} 
                                        onPress={() => removeCountry(item.destination, item.month)}
                                    >
                                        <Text style={{ fontSize: 25 }}>❤️</Text>
                                    </Pressable>
                                    
                                    <View style={styles.mainCardInfo}>
                                        <Text style={{ fontSize: 20, flex: 1, padding: 20 }}>{item.destination} ({item.month})</Text>
                                        <Text style={{ fontSize: 20, flex: 1, textAlign: "right", padding: 20 }}>{item.temp}°C</Text>
                                    </View>
                                    <Text style={{ paddingBottom: 10, paddingLeft: 20, fontSize: 15 }}>Avg. daily budget: {item.budget}</Text>
                                </View>
                            </Pressable>
                        );
                    })}
                </>
            )}
        </ScrollView>
    )
}

export default favoritesTab;

const styles = StyleSheet.create({
    destinationContainer: {
        borderRadius: 16,
        width: "80%",
        margin: 20,
        backgroundColor: '#FFFFFF',
        elevation: 5,
    },
    mainCardInfo: {
        flexDirection: "row"
    },
    destinationImage: {
        width: "100%", 
        height: 150, 
        borderTopLeftRadius: 10, 
        borderTopRightRadius: 10 
    },
    favoriteButton: {
        opacity: 0.7,
        position: "absolute",
        right: 0,
        padding: 10,
        backgroundColor: '#c7c3c2',
        zIndex: 10, // Užtikrinam, kad mygtukas būtų viršuje
    },
    countrySearch: {
        borderWidth: 1,
        borderRadius: 10,
        width: "80%",
        padding: 10
    }
})