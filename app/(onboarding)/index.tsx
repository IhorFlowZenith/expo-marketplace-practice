import { SafeAreaView, Text, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/context/LanguageContext';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    FlatList,
    Pressable,
    StyleSheet,
    View,
    ViewToken,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

const ONBOARDING_KEY = '@onboarding_completed';

const SLIDES = [
    {
        id: '1',
        icon: 'bag-handle' as const,
        titleKey: 'onboarding.slide1.title',
        subtitleKey: 'onboarding.slide1.subtitle',
        iconColor: Colors.palette.primary,
        bgLight: '#F0EEFF',
        bgDark: '#2C2840',
    },
    {
        id: '2',
        icon: 'heart' as const,
        titleKey: 'onboarding.slide2.title',
        subtitleKey: 'onboarding.slide2.subtitle',
        iconColor: '#FF6584',
        bgLight: '#FFF0F3',
        bgDark: '#3D2830',
    },
    {
        id: '3',
        icon: 'flash' as const,
        titleKey: 'onboarding.slide3.title',
        subtitleKey: 'onboarding.slide3.subtitle',
        iconColor: '#43A047',
        bgLight: '#F0FFF1',
        bgDark: '#1E3320',
    },
];

export default function OnboardingScreen() {

    const { t } = useLanguage();

    const insets = useSafeAreaInsets();
    const scheme = useColorScheme();
    const isDark = scheme === 'dark';

    const bgColor = useThemeColor({}, 'background');
    const textColor = useThemeColor({}, 'text');

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
        if (viewableItems.length > 0) {
            setActiveIndex(viewableItems[0].index ?? 0);
        }
    }).current;

    const handleNext = () => {
        if (activeIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
        }
    };

    const handleFinish = async () => {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
        router.replace('/(auth)/login');
    };

    const isLast = activeIndex === SLIDES.length - 1;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
            <Pressable
                onPress={handleFinish}
                style={[styles.skipBtn, { top: insets.top + 16 }]}
            >
                <Text style={styles.skipText}>Skip</Text>
            </Pressable>

            <FlatList
                ref={flatListRef}
                data={SLIDES}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
                style={{ flex: 1 }}
                renderItem={({ item }) => (
                    <View style={[styles.slide, { width, backgroundColor: bgColor }]}>
                        <View
                            style={[
                                styles.iconCircle,
                                { backgroundColor: isDark ? item.bgDark : item.bgLight },
                            ]}
                        >
                            <Ionicons name={item.icon} size={80} color={item.iconColor} />
                        </View>
                        <Text style={[styles.title, { color: textColor }]}>{t(item.titleKey)}</Text>
                        <Text style={styles.subtitle}>{t(item.subtitleKey)}</Text>
                    </View>
                )}
            />

            <View style={[styles.dotsRow, { backgroundColor: 'transparent' }]}>
                {SLIDES.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            i === activeIndex ? styles.dotActive : styles.dotInactive,
                        ]}
                    />
                ))}
            </View>

            <Pressable
                onPress={isLast ? handleFinish : handleNext}
                style={({ pressed }) => [styles.btn, { opacity: pressed ? 0.85 : 1 }]}
            >
                <Text style={styles.btnText}>
                    {isLast ? t('onboarding.getStarted') : t('onboarding.next')}
                </Text>
                <Ionicons
                    name={isLast ? 'checkmark' : 'arrow-forward'}
                    size={20}
                    color={Colors.palette.white}
                    style={{ marginLeft: 8 }}
                />
            </Pressable>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 24,
    },
    skipBtn: {
        position: 'absolute',
        right: 24,
        zIndex: 10,
    },
    skipText: {
        fontSize: 15,
        color: Colors.palette.textMuted,
        fontWeight: '500',
    },
    slide: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
        gap: 24,
    },
    iconCircle: {
        width: 180,
        height: 180,
        borderRadius: 90,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 36,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.palette.textMuted,
        lineHeight: 24,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 32,
        marginTop: 16,
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    dotActive: {
        width: 24,
        backgroundColor: Colors.palette.primary,
    },
    dotInactive: {
        width: 8,
        backgroundColor: Colors.palette.textMuted,
        opacity: 0.3,
    },
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.palette.primary,
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 40,
        width: width - 48,
        marginBottom: 8,
    },
    btnText: {
        color: Colors.palette.white,
        fontSize: 17,
        fontWeight: '700',
    },
});
