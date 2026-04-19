import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: theme.background,
                },
                headerTintColor: theme.text,
                headerTitleStyle: {
                    fontWeight: '700',
                },
                headerShadowVisible: false,

            }}
        >
            <Stack.Screen name="settings" options={{ title: 'Settings' }} />
            <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
            <Stack.Screen name="language" options={{ title: 'Language' }} />
            <Stack.Screen name="privacy" options={{ title: 'Privacy Policy' }} />
            <Stack.Screen name="help-center" options={{ title: 'Help Center' }} />
            <Stack.Screen name="about-us" options={{ title: 'About us' }} />
        </Stack>
    );
}
