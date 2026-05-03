import FontAwesome from '@expo/vector-icons/FontAwesome';
import 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

import '@/components/sheets';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { SheetProvider } from 'react-native-actions-sheet';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const ONBOARDING_KEY = '@onboarding_completed';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
    initialRouteName: '(onboarding)',
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
        <LanguageProvider>
            <AuthProvider>
                <CartProvider>
                    <FavoritesProvider>
                        <RootLayoutNav />
                    </FavoritesProvider>
                </CartProvider>
            </AuthProvider>
        </LanguageProvider>
    );
}

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { user, loading } = useAuth();
    const segments = useSegments();
    const [onboardingChecked, setOnboardingChecked] = useState(false);
    const [onboardingDone, setOnboardingDone] = useState(false);
    usePushNotifications();

    const CustomDarkTheme = { ...DarkTheme, colors: { ...DarkTheme.colors, background: Colors.palette.black, card: Colors.palette.black } };
    const CustomDefaultTheme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: Colors.palette.white } };
    const bgColor = colorScheme === 'dark' ? Colors.palette.black : Colors.palette.white;

    useEffect(() => {
        AsyncStorage.getItem(ONBOARDING_KEY).then((value) => {
            setOnboardingDone(value === 'true');
            setOnboardingChecked(true);
        });
    }, []);

    useEffect(() => {
        if (!loading) {
            SplashScreen.hideAsync();
        }
    }, [loading]);

    useEffect(() => {
        if (loading || !onboardingChecked) return;

        const inOnboarding = segments[0] === '(onboarding)';
        const inAuthGroup = segments[0] === '(auth)';

        if (!onboardingDone && !inOnboarding) {
            router.replace('/(onboarding)');
            return;
        }

        if (onboardingDone) {
            if (!user && !inAuthGroup) {
                router.replace('/(auth)/login');
            } else if (user && inAuthGroup) {
                router.replace('/(tabs)');
            }
        }
    }, [user, loading, segments, onboardingChecked, onboardingDone]);

    if (!onboardingChecked) return null;

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
                            <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
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
