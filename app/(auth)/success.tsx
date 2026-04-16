import React from 'react';
import { StyleSheet, ScrollView, View as DefaultView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { Text, View } from '@/components/Themed';
import AppButton from '@/components/ui/AppButton';

export default function StatesDemoScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <DefaultView style={styles.stateWrapper}>
                    <DefaultView style={[styles.iconCircle, { backgroundColor: '#4CAF50' }]}>
                        <Ionicons name="checkmark" size={50} color="#FFFFFF" />
                    </DefaultView>
                    <Text style={styles.title}>Success!</Text>
                    <Text style={styles.subtitle}>
                        Your operation was successful. You can now continue using the app.
                    </Text>
                </DefaultView>

                <DefaultView style={styles.divider} />

                <DefaultView style={styles.stateWrapper}>
                    <DefaultView style={[styles.iconCircle, { backgroundColor: '#E53935' }]}>
                        <Ionicons name="close" size={50} color="#FFFFFF" />
                    </DefaultView>
                    <Text style={styles.title}>Oops, Error!</Text>
                    <Text style={styles.subtitle}>
                        Something went wrong. Please check your connection or try again later.
                    </Text>
                </DefaultView>

                <AppButton
                    title="Got it"
                    onPress={() => router.replace('/(auth)/login')}
                    style={{ marginTop: 20 }}
                />

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    scrollContent: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    stateWrapper: {
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginVertical: 40,
        opacity: 0.3,
    },
});