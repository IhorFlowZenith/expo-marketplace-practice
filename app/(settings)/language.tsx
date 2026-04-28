import { Text, View, SafeAreaView, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View as DefaultView, ScrollView, StyleSheet, Pressable } from 'react-native';

const languages = [
    { id: 'en', name: 'English', subName: 'United States' },
    { id: 'ua', name: 'Ukrainian', subName: 'Ukraine' },
];

export default function LanguageScreen() {
    const [selectedId, setSelectedId] = useState('en');

    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const primaryColor = Colors.palette.primary;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>



                <DefaultView style={styles.listSection}>
                    {languages.map((lang) => {
                        const isSelected = lang.id === selectedId;

                        return (
                            <Pressable
                                key={lang.id}
                                style={({ pressed }) => [[styles.langCard, { backgroundColor: cardBg }], { opacity: pressed ? 0.7 : 1 }]}
                                onPress={() => setSelectedId(lang.id)}
                            >
                                <DefaultView style={styles.langInfo}>
                                    <Text style={styles.langName}>{lang.name}</Text>
                                    <Text style={styles.langSubName}>{lang.subName}</Text>
                                </DefaultView>

                                {isSelected && (
                                    <Ionicons name="checkmark-circle" size={24} color={primaryColor} />
                                )}
                            </Pressable>
                        );
                    })}
                </DefaultView>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    headerSection: {
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    subTitle: {
        fontSize: 16,
        color: Colors.palette.textMuted,
        marginTop: 6,
    },
    listSection: {
        backgroundColor: 'transparent',
    },
    langCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderRadius: 15,
        marginBottom: 12,
    },
    langInfo: {
        backgroundColor: 'transparent',
    },
    langName: {
        fontSize: 17,
        fontWeight: '600',
    },
    langSubName: {
        fontSize: 13,
        color: Colors.palette.textMuted,
        marginTop: 2,
    },
});
