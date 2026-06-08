import { StyleSheet, TextInput, Text, View, Image, ScrollView, Pressable } from 'react-native'
import React, { useCallback } from 'react'
import { useLocalSearchParams, useFocusEffect, useRouter} from 'expo-router';
import { destinations } from '../constants/countries';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacer from '../components/Spacer';

function getFilteredLocations(destinations, month, temp, sea, mountain, budget){
    let filteredDestinations = destinations.filter(destination => {
        let desiredMonth = destination.months.find(element => element.month === month);
        if(desiredMonth == null){
            return false
        }
        if(Math.abs(temp - desiredMonth.avgTemp) > 3){
            return false
        } 
        if(destination.avgDailyBudget > budget){
            return false
        }
        if(sea == true && destination.sea == false)
            return false
        if(mountain == true && destination.mountains == false)
            return false
        return true
    })
    return filteredDestinations
}

const destinationList = () => {
    const router = useRouter();
    const params = useLocalSearchParams();
    const results = getFilteredLocations(destinations, params.month, Number(params.temp), params.sea === "true", params.mountains === "true", Number(params.budget));
    const [favoriteButtonState, setFavoriteButton] = useState([]);
    const [countryInput, setCountryInput] = useState('');
    const searchedResults = results.filter(result => result.name.toLowerCase().includes(countryInput));
    //AsyncStorage.clear();
    //console.log(AsyncStorage.getItem('favorites'));

    const storeCountries = async (checkingCountryCode, checkingCountry, checkingLatitude, checkingLongitude, checkingMonth, checkingTemp, checkingPhoto, checkingDescription, checkingBudget, checkingSea, checkingMountains, index) => {
        try{
            //gaunam sarasa esamu saliu favorituose
            let storedList = await AsyncStorage.getItem('favorites');
            const newState = [...favoriteButtonState];
            if(storedList == null){
                storedList = [];
            } else {
                //paverciam i json objekta
                storedList = JSON.parse(storedList);
            }
            let storedCountry = storedList.find(element => element.destination === checkingCountry && element.month === checkingMonth);
            if(storedCountry == null) {
                storedList.push({countryCode: checkingCountryCode, destination: checkingCountry, latitude: checkingLatitude, longitude: checkingLongitude, month: checkingMonth, temp: checkingTemp, photo: checkingPhoto, description: checkingDescription, budget: checkingBudget, sea: checkingSea, mountains: checkingMountains});
                newState[index] = true;
                setFavoriteButton(newState);
            } else{
                storedList = storedList.filter((country) => country !== storedCountry);
                newState[index] = false;
                setFavoriteButton(newState);
            }
            await AsyncStorage.setItem('favorites', JSON.stringify(storedList))
        } catch (e){
            //error catch
        }
    }

    useFocusEffect(
        useCallback( () => {
        (async () => {
            let storedList = await AsyncStorage.getItem('favorites');
            if(storedList == null){
                storedList = [];
            } else {
                storedList = JSON.parse(storedList);
                const newState = results.map(item => 
                    storedList.some(s => s.destination === item.name && s.month === params.month)
                );
                setFavoriteButton(newState);
            }
        })();
    }, [])
    );

    return (
        <ScrollView contentContainerStyle={{ alignItems: 'center', justifyContent: 'center'}}>
            {results.length === 0 ? (
                <>
                    <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>Sorry, no destinations match your filters</Text>
                    <Text>Try selecting different filters</Text>
                </>
            ): (
            <>
                <Text style={{fontSize: 30, fontWeight: 'bold', textAlign: 'center'}}>We found the {results.length} perfect destinations for you!</Text>
                <Spacer/>
                <TextInput placeholder='Type country name' style={styles.countrySearch} onChangeText={(text) => setCountryInput(text)}/>
                <Spacer/>
                {searchedResults.map((item, index) => {
                    const monthData = item.months.find(element => element.month === params.month);
                    return(
                        <Pressable key={index} style={{width: '100%', alignItems: 'center',}} onPress={() => router.push({pathname: '/destinationDetails', params: {
                            code: item.countryCode,
                            month: params.month}})}>
                            <View style={[styles.destinationContainer, {overflow: 'hidden'}]}>
                                <Image source={{uri: item.photo}} style={styles.destinationImage}/>
                                <Pressable style={styles.favoriteButton} onPress={() => storeCountries(item.countryCode, item.name, item.latitude, item.longitude, params.month, monthData.avgTemp, item.photo, item.description, item.avgDailyBudget, item.sea, item.mountains, index)}>
                                    <Text style={{fontSize: 25}}>{favoriteButtonState[index] == true ? '❤️' : '🤍'}</Text>
                                </Pressable>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontSize: 20, flex: 1, padding: 20}}>{item.name}</Text>
                                    <Text style={{fontSize: 20, flex: 1, textAlign: "right", padding: 20}}>{monthData.avgTemp}°C</Text>
                                </View>
                                <Text style={{paddingBottom: 10, paddingLeft: 20, fontSize: 15}}>Avg. daily budget: {item.avgDailyBudget}</Text>
                            </View>
                        </Pressable>
                    );
                    })}
                <Spacer/>
                <Text style={styles.title}>Didn't find what you were looking for?</Text>
                <Text>Try changing your filters for new results</Text>
                <Pressable style={styles.buttonStyle} onPress={() => router.navigate('/locationFilters')}>
                    <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>New search</Text>
                </Pressable>
            </>
            )}
        </ScrollView>
    )
}

export default destinationList

const styles = StyleSheet.create({
    destinationContainer: {
    borderRadius: 16,
    width: "80%",
    margin: 20,
    backgroundColor: '#FFFFFF',
    elevation: 5,
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
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonStyle: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 10,
        margin: 20,
        width: "50%",
        alignItems: "center"
    },
    countrySearch: {
        borderWidth: 1,
        borderRadius: 10,
        width: "80%"
    }
})