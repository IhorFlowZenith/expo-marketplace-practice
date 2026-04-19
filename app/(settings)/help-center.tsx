import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View as DefaultView, Linking, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

function FAQItem({ id, question, answer, expandedId, setExpandedId }: any) {
    const isExpanded = expandedId === id;
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const iconColor = Colors.palette.primary;

    return (
        <DefaultView style={[styles.faqCard, { backgroundColor: cardBg }]}>
            <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpandedId(isExpanded ? null : id)}
                activeOpacity={0.7}
            >
                <Text style={styles.faqQuestion}>{question}</Text>
                <Ionicons
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={22}
                    color={iconColor}
                />
            </TouchableOpacity>

            {isExpanded && (
                <DefaultView style={styles.answerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.faqAnswer}>{answer}</Text>
                </DefaultView>
            )}
        </DefaultView>
    );
}

export default function HelpCenterScreen() {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>



                <DefaultView style={styles.contactSection}>
                    <TouchableOpacity
                        style={[styles.contactCard, { backgroundColor: cardBg }]}
                        onPress={() => Linking.openURL('mailto:pelykhihor3456@gmail.com')}
                    >
                        <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.palette.primary} />
                        <Text style={styles.contactText}>Contact Support</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.contactCard, { backgroundColor: cardBg }]}
                        onPress={() => Linking.openURL('https://www.flowzenith.site')}
                    >
                        <Ionicons name="globe-outline" size={24} color={Colors.palette.primary} />
                        <Text style={styles.contactText}>Visit Website</Text>
                    </TouchableOpacity>
                </DefaultView>

                <DefaultView style={styles.faqSection}>
                    <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>

                    <FAQItem
                        id={1}
                        question="How to track my order?"
                        answer="You can track your order status in the 'Orders' tab. Once the order is shipped, you will receive a tracking number via email."
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                    />
                    <FAQItem
                        id={2}
                        question="What is the return policy?"
                        answer="We offer a 30-day return policy for all unused items in their original packaging. Please go to order details to start a return."
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                    />
                    <FAQItem
                        id={3}
                        question="Can I change my shipping address?"
                        answer="You can change the shipping address only if the order has not been processed yet. Contact support immediately for help."
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                    />
                    <FAQItem
                        id={4}
                        question="Which payment methods are accepted?"
                        answer="We accept all major credit cards (Visa, Mastercard), Apple Pay, and Google Pay for secure transactions."
                        expandedId={expandedId}
                        setExpandedId={setExpandedId}
                    />
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
    contactSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        backgroundColor: 'transparent',
    },
    contactCard: {
        width: '48%',
        padding: 15,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contactText: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '600',
    },
    faqSection: {
        backgroundColor: 'transparent',
    },
    sectionLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        marginLeft: 5,
    },
    faqCard: {
        borderRadius: 15,
        marginBottom: 12,
        overflow: 'hidden',
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
        marginRight: 15,
    },
    answerContainer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        backgroundColor: 'transparent',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.palette.textMuted,
        opacity: 0.1,
        marginBottom: 15,
    },
    faqAnswer: {
        fontSize: 14,
        lineHeight: 22,
        color: Colors.palette.textMuted,
    },
});
