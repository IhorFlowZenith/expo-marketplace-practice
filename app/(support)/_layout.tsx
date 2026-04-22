import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Stack } from 'expo-router';

export default function SupportLayout() {
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
            <Stack.Screen name="contact" options={{ title: 'Contact Us' }} />
            <Stack.Screen name="help" options={{ title: 'Help' }} />
            <Stack.Screen name="share" options={{ title: 'Share' }} />
        </Stack>
    );
}
