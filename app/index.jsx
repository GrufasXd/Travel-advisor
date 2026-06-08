import { StyleSheet, View, Text, Pressable } from 'react-native'
import { Link } from 'expo-router'
import { useRouter } from 'expo-router';
import Spacer from "../components/Spacer"


const Home = () => {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <Spacer/>
            <Text style={styles.title}>Welcome to travel advisor</Text>

            <Spacer/>
            <Pressable onPress={() => router.navigate('/locationFilters')} style={styles.goFiltersButton}>
                <Text style={{color: 'white', fontSize: 12}}>Get travel advice</Text>
            </Pressable>
            <Pressable onPress={() => router.navigate('/favoritesTab')} style={styles.goFiltersButton}>
                <Text style={{color: 'white', fontSize: 12}}>Go to your favorites</Text>
            </Pressable>
        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18
    },
    goFiltersButton: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 10,
        marginTop: 20,
        width: "50%",
        alignItems: "center"
    }
})