import { StyleSheet, Text, View, Pressable, Alert, ScrollView } from 'react-native'
import React, {useState} from 'react'
import { SplashScreen, useRouter, Stack } from 'expo-router';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import Checkbox from 'expo-checkbox';
import Spacer from '../components/Spacer';

const months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const locationFilters = () => {
    const router = useRouter();
    const [selectedMonth, setSelectedMonth] = useState();
    const [sliderState, setSliderState] = useState(0);
    const [budgetState, setBudget] = useState(40);
    const [seaIsChecked, seaSetChecked] = useState(false);
    const [mountainIsChecked, mountainSetChecked] = useState(false);
    return (
        <>
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={[styles.title, {marginTop: 20}]}>Filter your perfect vacation destination</Text>
            <Text style={[styles.regText, {margin: 20}]}>Select vacation month:</Text>
            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue, itemIndex) =>
                        setSelectedMonth(itemValue)
                    }>
                    <Picker.Item label='Select an option'/>
                    {months.map(month => (
                        <Picker.Item key={month} value={month} label={month}/>
                    ))}
                </Picker>
            </View>
            <Text style={[styles.regText, {marginTop: 50}]}>Select the desired temperature (°C):</Text>
            <Slider
                style={{width: "90%", height: 40, margin: 10}}
                value={sliderState}
                onValueChange={(value) => setSliderState(value)}
                minimumValue={-30}
                maximumValue={30}
                step={1}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="red"
            />
            <Text style={{fontSize: 20, fontWeight: "bold"}}>{sliderState}°C</Text>
            <Text style={[styles.regText, {marginTop: 50}]}>Select the desired budget of your trip (per day):</Text>
            <Slider
                style={{width: "90%", height: 40, margin: 10}}
                value={budgetState}
                onValueChange={(value) => setBudget(value)}
                minimumValue={40}
                maximumValue={200}
                step={10}
                minimumTrackTintColor="blue"
                maximumTrackTintColor="red"
            />
            <Text style={{fontSize: 20, fontWeight: "bold"}}>{budgetState}€</Text>
            <Text style={[styles.regText, {marginTop: 50}]}>Select additional options:</Text>
            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={seaIsChecked} onValueChange={seaSetChecked}/>
                <Text style={{fontSize: 15}}>Sea?</Text>
            </View>
            <View style={styles.section}>
                <Checkbox style={styles.checkbox} value={mountainIsChecked} onValueChange={mountainSetChecked}/>
                <Text style={{fontSize: 15}}>Mountains?</Text>
            </View>
            <Pressable onPress={() => {if(!selectedMonth) {
                Alert.alert('Please choose the month you want to travel');
                return;
            } router.push({pathname: '/destinationList', params: {
                month: selectedMonth, 
                temp: sliderState,
                sea: seaIsChecked,
                mountains: mountainIsChecked,
                budget: budgetState
            }})
            }}
                style={styles.getDestinationsButton}>
                <Text style={{color: 'white', fontSize: 15, textAlign: 'center'}}>Get your perfect destination</Text>
            </Pressable>
            <Spacer/>
        </ScrollView>
        </>
    )
}

export default locationFilters

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    regText: {
        fontSize: 15
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
        width: "80%"
    },
    checkbox: {
        margin: 8
    },
    section: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    getDestinationsButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        width: "50%",
        alignItems: "center",
    }
})