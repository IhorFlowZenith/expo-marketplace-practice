import React from 'react';
import { StyleSheet, ScrollView, View as DefaultView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';

export default function PlaceholderScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>



                <DefaultView style={styles.infoBox}>
                    <Ionicons name="construct-outline" size={60} color={Colors.palette.primary} style={{ marginBottom: 20 }} />
                    <Text style={styles.message}>This section is under development</Text>
                    <Text style={styles.subMessage}>
                        We are working hard to bring you new features. Stay tuned!
                    </Text>
                </DefaultView>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 40,
        alignItems: 'center',
    },
    headerSection: {
        width: '100%',
        marginBottom: 40,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    infoBox: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        backgroundColor: 'transparent',
    },
    message: {
        fontSize: 20,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 10,
    },
    subMessage: {
        fontSize: 15,
        color: Colors.palette.textMuted,
        textAlign: 'center',
        paddingHorizontal: 30,
    },
});
