import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { Stack } from 'expo-router';

export default function SupportLayout() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const { t } = useLanguage();

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: theme.background },
                headerTintColor: theme.text,
                headerTitleStyle: { fontWeight: '700' },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen name="contact" options={{ title: t('profile.contact') }} />
            <Stack.Screen name="share" options={{ title: t('profile.shareApp') }} />
        </Stack>
    );
}
