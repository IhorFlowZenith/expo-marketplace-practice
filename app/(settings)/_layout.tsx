import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { Stack } from 'expo-router';

export default function SettingsLayout() {
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
            <Stack.Screen name="settings" options={{ title: t('settings.title') }} />
            <Stack.Screen name="notifications" options={{ title: t('notifications.title') }} />
            <Stack.Screen name="language" options={{ title: t('settings.language') }} />
            <Stack.Screen name="privacy" options={{ title: t('settings.privacyPolicy') }} />
            <Stack.Screen name="help-center" options={{ title: t('settings.helpCenter') }} />
            <Stack.Screen name="about-us" options={{ title: t('settings.aboutUs') }} />
        </Stack>
    );
}
