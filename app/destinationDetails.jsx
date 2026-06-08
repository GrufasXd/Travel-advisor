import { StyleSheet, Text, ScrollView, View, Image, Dimensions, Pressable, Linking, Share } from 'react-native'
import { Link, useLocalSearchParams, usePathname, useRouter} from 'expo-router';
import Checkbox from 'expo-checkbox';
import { useEffect, useState } from 'react';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import { destinations } from '../constants/countries';
import AsyncStorage from "@react-native-async-storage/async-storage";
import WebView from 'react-native-webview';
import Spacer from '../components/Spacer';

const {width} = Dimensions.get('window');
const destinationDetails = () => {
    const params = useLocalSearchParams();
    const countryData = destinations.find(d => d.countryCode === params.code);
    const monthData = countryData.months.find(m => m.month == params.month);
    const [favoriteButtonState, setFavoriteButton] = useState(false);
    const [selected, setSelected] = useState('');
    const todaysDate = new Date();
    const months=["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [dailyTemperature, setDailyTemperature] = useState([]);
    const dayObjects = {};
    const [markedDateState, setMarkedDates] = useState({});
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const mapHtml = `
    <html><body style="margin:0">
    <div id="map" style="width:100%;height:100%"></div>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script>
    var map = L.map('map').setView([${Number(countryData.latitude)}, ${Number(countryData.longitude)}], 5);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
    L.marker([${Number(countryData.latitude)}, ${Number(countryData.longitude)}]).addTo(map);
    <\/script>
    </body></html>
    `  
    const handleCalendarPress = (selectedDate) => {
        if (startDate == null || (startDate != null && endDate != null))
        {
            setStartDate(selectedDate);
            setEndDate(null);
        }
        else if (startDate != null && endDate == null){
            if(selectedDate < startDate){
                setStartDate(selectedDate);
            }
            else{
                setEndDate(selectedDate);
            }
        }
    }

    const storeCountries = async () => {
        try{
            //gaunam sarasa esamu saliu favorituose
            let storedList = await AsyncStorage.getItem('favorites');
            if(storedList == null){
                storedList = [];
            } else {
                //paverciam i json objekta
                storedList = JSON.parse(storedList);
            }
            let storedCountry = storedList.find(element => element.destination === countryData.name && element.month === params.month);
            if(storedCountry == null) {
                //papushinam sali i sarasa
                storedList.push({ destination: countryData.name, month: params.month});
                setFavoriteButton(true);
            } else{
                //isfiltruojam sali
                storedList = storedList.filter((country) => country !== storedCountry);
                setFavoriteButton(false);
            }
            await AsyncStorage.setItem('favorites', JSON.stringify(storedList))
        } catch (e){
            //error catch
        }
    }

    const onShare = async () => {
        try{
            let flightLink = '';
            if(startDate && endDate){
                const cleanStartDate = startDate.substring(2).replace(/-/g, '');
                const cleanEndDate = endDate.substring(2).replace(/-/g, '');

                flightLink = `I have found the perfect destination and time for our vacation: https://www.skyscanner.net/transport/flights/vno/${params.code}/${cleanStartDate}/${cleanEndDate}`
                const result = await Share.share({message: `Let's travel to ${countryData.name} and stay there from ${startDate} to ${endDate}. ${flightLink}`});
            }
            else{
                alert("Please select your travel dates before you share the destination.");
            }
        } catch (error){
            alert("There was an issue when sharing your destination")
        }
    }

    useEffect( () => {
        (async () => {
            let storedList = await AsyncStorage.getItem('favorites');
            if(storedList == null){
                storedList = [];
            } else {
                storedList = JSON.parse(storedList);
            }
            let storedCountry = storedList.find(element => element.destination === countryData.name && element.month === params.month);
            if(storedCountry != null){
                setFavoriteButton(true);
        }
        })();
    }, []);

    useEffect (() => {
        (async () => {
            const response = await fetch(`https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${countryData.latitude}&longitude=${countryData.longitude}&start_date=${todaysDate.getFullYear() - 1}-${(months.indexOf(params.month) + 1).toString().padStart(2, '0')}-01&end_date=${todaysDate.getFullYear() - 1}-${(months.indexOf(params.month) + 1).toString().padStart(2, '0')}-${new Date(todaysDate.getFullYear() - 1, (months.indexOf(params.month) + 1).toString().padStart(2, '0'), 0).getDate()}&daily=temperature_2m_mean`)
            const data = await response.json();
            setDailyTemperature(data);
            data.daily.time.forEach((time, index) => {
                dayObjects[time.slice(5)] = { marked: true, dotColor: 'blue', temperature: data.daily.temperature_2m_mean[index]};
            });
            setMarkedDates(dayObjects);
        })();
    }, []);

    return (
        <ScrollView nestedScrollEnabled={true}>
            <Image source={{uri: countryData.photo}} style={styles.destinationImage}/>
            <Pressable style={styles.favoriteButton} onPress={storeCountries}>
                <Text style={{fontSize: 25}}>{favoriteButtonState == true ? '❤️' : '🤍'}</Text>
            </Pressable>
            <View style={{flexDirection: 'row', padding: 20}}>
                <Text style={{fontSize: 20, flex: 1, fontWeight: 'bold'}}>{countryData.name}</Text>
                <Text style={{fontSize: 20, flex: 1, textAlign: "right", flexWrap: 1}}>{monthData.avgTemp}°C in {params.month}</Text>
            </View>
            <View style={{paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: '10'}}>
                <Text style={{fontSize: 15}}>Average daily budget: {countryData.avgDailyBudget}</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', marginTop: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Checkbox value={countryData.sea} disabled/>
                    <Text style={{ marginLeft: 5, textAlign: 'right' }}>Sea</Text>
                </View>
                <View style={{ flexDirection: 'row'}}>
                    <Checkbox value={countryData.mountains} disabled />
                    <Text style={{ marginLeft: 5 }}>Mountains</Text>
                </View>
            </View>
            <Text style={{fontSize: 20, marginTop: 20, paddingHorizontal: 20}}>About this country:</Text>
            <Text style={{marginTop: 10, paddingHorizontal: 20}}>{countryData.description}</Text>
            <Spacer/>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20}}>
                <Checkbox value={countryData.visaRequirements.visaRequired} disabled />
                <Text style={{ marginLeft: 5 }}>Visa</Text>
            </View>
            <Text style={{marginTop: 20, paddingHorizontal: 20}}>Your passport has to be valid for {countryData.visaRequirements.passportValidityMonths} months. {countryData.description}</Text>
            <View style={{paddingHorizontal: 20}}>
                <Text style={{ fontWeight: 'bold', marginTop: 10}}>Required Documents:</Text>
                {countryData.visaRequirements.documents.map((doc, index) => (
                    <Text key={index}>• {doc}</Text>
                ))}
                <Text style={{fontStyle: 'italic', marginTop: 10}}>
                    Notes: {countryData.visaRequirements.notes}
                </Text>
            </View>
            <Spacer/>          
            <WebView
                    nestedScrollEnabled={true} 
                    source={{html: mapHtml}} 
                    style={{width: 340, height: 300, marginRight: 10, marginLeft: 10}}/>
            <Spacer/>
            <Calendar
                disableMonthChange={true}
                hideArrows={true}
                hideExtraDays={true}
                initialDate={todaysDate.getMonth() + 1 > months.indexOf(params.month) + 1 ? `${todaysDate.getFullYear() + 1}-${(months.indexOf(params.month) + 1).toString().padStart(2, '0')}-01` : `${todaysDate.getFullYear()}-${(months.indexOf(params.month) + 1).toString().padStart(2, '0')}-01`}
                dayComponent={({date, state}) => {
                    const monthAndDay = date.dateString.slice(5);
                    const someDay = markedDateState[monthAndDay];
                    const someTemperature = someDay?.temperature;
                    if(state === "disabled"){
                        return(
                            <View>
                                <Text style={{opacity: 0.3}}>{date.day}</Text>
                            </View>
                        )
                    }
                    let bgColor = 'white';
                    let textColor = 'black';

                    if(date.dateString == startDate || date.dateString == endDate){
                        bgColor = '#25b8ea';
                        textColor = 'white';
                    }
                    if(date.dateString > startDate && date.dateString < endDate){
                        bgColor = '#74dcff';
                        textColor = 'white';
                    }
                    return(
                        <Pressable onPress={() => handleCalendarPress(date.dateString)} style={{alignItems: 'center', backgroundColor: bgColor, borderRadius: 5, padding: 2}}>
                            <View flexDirection="column" style={{alignItems: 'center'}}>
                                <Text style={{color: textColor}}>{date.day} </Text>
                                <Text style={{fontSize: 10, color: someTemperature > 20 ? 'red' : someTemperature > 10 ? 'orange' : someTemperature > 0 ? 'blue' : 'darkblue'}}>{someTemperature}°C</Text>
                            </View>
                        </Pressable>
                    );
                }}
            />
            <Spacer marginTop={40}/>
            <Pressable style={styles.flightLink} onPress={() => {
                if (startDate && endDate){
                    const cleanStartDate = startDate.substring(2).replace(/-/g, '');
                    const cleanEndDate = endDate.substring(2).replace(/-/g, '');

                    Linking.openURL(`https://www.skyscanner.net/transport/flights/vno/${params.code}/${cleanStartDate}/${cleanEndDate}`)
                }
                else{
                    alert("Before looking at flights, select the days you'd like to travel");
                }
                }}
                >
            <Text style={{color: 'white', fontSize: 20}}>Look for flights</Text>
            </Pressable>
            <Spacer/>
            <Pressable style={styles.bookingLink} onPress={() => {
                if (startDate && endDate){
                    Linking.openURL(`https://www.booking.com/searchresults.html?ss=${countryData.name}&checkin=${startDate}&checkout=${endDate}`)
                }
                else{
                    alert("Before looking at stays, select the days you'd like to travel");
                }
                }}
                >
            <Text style={{color: 'white', fontSize: 20, textAlign: "center"}}>Look for places to stay</Text>
            </Pressable>
            <Spacer/>
            <Pressable onPress={onShare} style={styles.sharingDestination}>
                <Text style={{color: 'white', textAlign: 'center'}}>Share your destination with a friend</Text>
            </Pressable>
            <Spacer/>
        </ScrollView>
    )
}

export default destinationDetails

const styles = StyleSheet.create({
    destinationImage: {
        width,
        height: 200,
        padding: 0
    },
    favoriteButton: {
        opacity: 0.7,
        position: "absolute",
        right: 0,
        padding: 10,
        backgroundColor: '#c7c3c2',
    },
    flightLink: {
        backgroundColor: '#6aca56',
        alignItems: 'center',
        width: 200,
        alignSelf: 'center',
        borderRadius: 5,
    },
    bookingLink: {
        backgroundColor: '#514fbc',
        alignItems: 'center',
        width: 200,
        alignSelf: 'center',
        borderRadius: 5
    },
    sharingDestination: {
        backgroundColor: 'red',
        width: 200,
        borderRadius: 5,
        alignSelf: 'center',
    }
})