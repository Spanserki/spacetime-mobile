import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree';
import { Roboto_400Regular, Roboto_700Bold, useFonts } from '@expo-google-fonts/roboto';
import { SplashScreen, Stack } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ImageBackground } from 'react-native';
import blurImg from '../assets/luz.png';

export default function Layout() {
    const [isUserAuthenticated, setUserIsAuthenticated] = useState<null | boolean>(null);
    const [hasLoadedFonts] = useFonts({
        Roboto_400Regular,
        Roboto_700Bold,
        BaiJamjuree_700Bold
    })
    useEffect(() => {
        SecureStore.getItemAsync('token_client_github_mobile').then(token => {
            setUserIsAuthenticated(!!token)
        })
    }, [])
    if (!hasLoadedFonts) {
        return <SplashScreen />
    }
    return (
        <ImageBackground
            source={blurImg}
            imageStyle={{ position: 'absolute', left: '-100%' }}
            className=' bg-gray-900 flex-1 relative'
        >
            <StatusBar style="auto" />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: 'transparent' }
                }}
            >
                <Stack.Screen name='index' redirect={isUserAuthenticated}/>
                <Stack.Screen name='newMemorie'/>
                <Stack.Screen name='memories'/>
            </Stack>
        </ImageBackground>
    )
}