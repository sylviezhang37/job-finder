import { Stack } from 'expo-router'
import { useCallback } from 'react'
import { useFonts } from 'expo-font' // library to use custom fonts
import * as SplashScreen from 'expo-splash-screen'

SplashScreen.preventAutoHideAsync(); // ensures splash screen stays visible while the app is loading

const Layout = () => {
    // true if all fonts successfully loaded
    const [fontsLoaded] = useFonts({
        DMBold : require('../assets/fonts/DMSans-Bold.ttf'),
        DMMedium : require('../assets/fonts/DMSans-Medium.ttf'),
        DMRegular : require('../assets/fonts/DMSans-Regular.ttf'),
    })

    const onLayoutRootView = useCallback(async () => {
        if(fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]) // dependency, controls when this function should be re-executed
    
    if(!fontsLoaded) return null;

    return <Stack onLayout={onLayoutRootView}/>;
}

export default Layout;