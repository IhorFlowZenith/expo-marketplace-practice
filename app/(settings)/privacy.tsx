import { Text, View } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View as DefaultView, ScrollView, StyleSheet } from 'react-native';

function PrivacySection({ icon, title, content }: { icon: any, title: string, content: string }) {
    const iconColor = Colors.palette.primary;

    return (
        <DefaultView style={styles.section}>
            <DefaultView style={styles.sectionHeader}>
                <Ionicons name={icon} size={22} color={iconColor} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </DefaultView>
            <Text style={styles.sectionText}>{content}</Text>
        </DefaultView>
    );
}

export default function PrivacyScreen() {
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>

                <DefaultView style={styles.body}>
                    <PrivacySection
                        icon="shield-checkmark-outline"
                        title="What We Know About You 😏"
                        content="Yeah, we know a few things. But only what you give us: your name, email, and payment info (kinda hard to avoid that part 😅)."
                    />

                    <PrivacySection
                        icon="eye-outline"
                        title="Why We Need It 👀"
                        content="So we can actually deliver your stuff, answer your 'where is my order??' messages, and occasionally keep you in the loop (don’t worry, no spam apocalypse)."
                    />

                    <PrivacySection
                        icon="lock-closed-outline"
                        title="Is Your Data Safe 🔐"
                        content="We guard your data like a cat guards its favorite box — seriously, it’s not going anywhere."
                    />

                    <PrivacySection
                        icon="share-outline"
                        title="Do We Sell Your Data 🤨"
                        content="Nope. We’re not that kind of company. No shady deals, no selling your info. Your data isn’t for sale."
                    />
                </DefaultView>

                <Text style={styles.footerNote}>
                    By using our app, you consent to our privacy policy. If you have any questions, please contact our support team.
                </Text>

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
        paddingBottom: 60,
    },
    headerSection: {
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
    },
    lastUpdate: {
        fontSize: 14,
        color: Colors.palette.textMuted,
        marginTop: 8,
    },
    body: {
        backgroundColor: 'transparent',
    },
    section: {
        marginBottom: 25,
        backgroundColor: 'transparent',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: 'transparent',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    sectionText: {
        fontSize: 15,
        lineHeight: 22,
        color: Colors.palette.textMuted,
    },
    footerNote: {
        fontSize: 13,
        textAlign: 'center',
        color: Colors.palette.textMuted,
        marginTop: 20,
        fontStyle: 'italic',
    }
});
