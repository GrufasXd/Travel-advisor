import { StyleSheet, useColorScheme} from 'react-native'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native-web'

const RootLayout = () => {
    const colorScheme = useColorScheme()
    return (
        <>
            <StatusBar value="auto"/>
            <Stack>
                <Stack.Screen name="index" options={{ title: 'Home'}} />
                <Stack.Screen name="locationFilters" options={{ title: 'Filter destination'}} />
                <Stack.Screen name="destinationList" options={{ title: 'Destination list'}} />
                <Stack.Screen name="destinationDetails" options={{ title: 'Destination details'}} />
                <Stack.Screen name="favoritesTab" options={{ title: 'Your favorites'}} />
            </Stack>
        </>
  )
}

export default RootLayout

const styles = StyleSheet.create({})