import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import '@/components/sheets';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { SheetProvider } from 'react-native-actions-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';


export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
    initialRouteName: '(auth)',
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        if (error) throw error;
    }, [error]);

    if (!loaded) return null;

    return (
        <AuthProvider>
            <CartProvider>
                <FavoritesProvider>
                    <RootLayoutNav />
                </FavoritesProvider>
            </CartProvider>
        </AuthProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { user, loading } = useAuth();
    const segments = useSegments();

    const CustomDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: Colors.palette.black, card: Colors.palette.black } };
    const CustomDefaultTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: Colors.palette.white } };
    const bgColor = colorScheme === 'dark' ? Colors.palette.black : Colors.palette.white;

    useEffect(() => {
        if (!loading) {
            SplashScreen.hideAsync();
        }
    }, [loading]);

    useEffect(() => {
        if (loading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            router.replace('/(auth)/login');
        } else if (user && inAuthGroup) {
            router.replace('/(tabs)');
        }
    }, [user, loading, segments]);

    return (
        <ThemeProvider value={colorScheme === 'dark' ? CustomDarkTheme : CustomDefaultTheme}>
            <SafeAreaProvider>
                <SheetProvider>
                    <View style={{ flex: 1, backgroundColor: bgColor }}>
                        <Stack
                            screenOptions={{
                                headerShown: false,
                                contentStyle: { backgroundColor: bgColor },
                                animation: 'slide_from_right',
                            }}
                        >
                            <Stack.Screen name="(auth)" />
                            <Stack.Screen name="(tabs)" />
                            <Stack.Screen name="(settings)" />
                            <Stack.Screen name="(support)" />
                            <Stack.Screen name="(profile-extra)" />
                        </Stack>
                    </View>
                </SheetProvider>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}
