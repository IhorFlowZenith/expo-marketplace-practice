import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, ScrollView, StyleSheet } from 'react-native';

function TechItem({ icon, title, description }: { icon: any, title: string, description: string }) {
    return (
        <DefaultView style={styles.techItem}>
            <DefaultView style={styles.iconContainer}>
                <Ionicons name={icon} size={24} color={Colors.palette.primary} />
            </DefaultView>
            <DefaultView style={styles.techTextContainer}>
                <Text style={styles.techTitle}>{title}</Text>
                <Text style={styles.techDescription}>{description}</Text>
            </DefaultView>
        </DefaultView>
    );
}

export default function AboutUsScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <DefaultView style={styles.textSection}>
                    <Text style={styles.description}>
                        This project was developed by a 4th-year student, Pelykh Ihor, as part of an internship at Everlabs.
                        The primary goal was to create a modern marketplace application with a focus on real-world development processes, user-friendly experience, and scalable architecture.
                        The project demonstrates practical skills in mobile development and the effective application of academic knowledge in a professional environment.
                    </Text>
                </DefaultView>

                <DefaultView style={styles.skillsSection}>
                    <Text style={styles.sectionTitle}>Technologies & Skills Applied</Text>

                    <TechItem
                        icon="logo-react"
                        title="React Native (Expo)"
                        description="Cross-platform development with a focus on native performance and smooth animations."
                    />

                    <TechItem
                        icon="flame-outline"
                        title="Firebase"
                        description="Real-time database, secure authentication, and cloud infrastructure for a scalable backend."
                    />

                </DefaultView>

                <Text style={styles.footerText}>© 2026 MarketPlace Inc. All rights reserved.</Text>

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
        paddingBottom: 40,
    },
    textSection: {
        width: '100%',
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    description: {
        fontSize: 15,
        lineHeight: 24,
        color: Colors.palette.textMuted,
    },
    skillsSection: {
        width: '100%',
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 20,
    },
    techItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: 'transparent',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: Colors.palette.accentBgLight,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    techTextContainer: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    techTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    techDescription: {
        fontSize: 13,
        color: Colors.palette.textMuted,
        lineHeight: 18,
    },
    footerText: {
        fontSize: 12,
        color: Colors.palette.textMuted,
        marginTop: 40,
        textAlign: 'center',
    }
});
