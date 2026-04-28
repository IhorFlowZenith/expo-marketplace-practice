import EditFieldModal from '@/components/EditModal';
import ChangePasswordModal from '@/components/profile/ChangePasswordModal';
import PaymentCardModal, { PaymentCard } from '@/components/profile/PaymentCardModal';
import ProfileFieldRow, { EditableField, FIELD_META, UserProfile } from '@/components/profile/ProfileFieldRow';
import SettingsItem from '@/components/SettingsItem';
import { SafeAreaView, Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { View as DefaultView, Image, Pressable, ScrollView, StyleSheet } from 'react-native';

export default function ProfileDetailsScreen() {
    const { user } = useAuth();
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    const [profile, setProfile] = useState<UserProfile>({
        displayName: user?.displayName || 'None',
        email: user?.email || 'user@email.com',
        phone: '+380931234567',
        address: '123 Market Street, San Francisco',
    });

    const [editModal, setEditModal] = useState<{ visible: boolean; field: EditableField | null }>({
        visible: false,
        field: null,
    });
    const [editValue, setEditValue] = useState('');
    const [pwModal, setPwModal] = useState(false);
    const [cardModal, setCardModal] = useState(false);
    const [card, setCard] = useState<PaymentCard>({
        holderName: 'John Doe',
        number: '4242',
        expiry: '12/27',
        cvv: '',
    });

    const openEdit = useCallback((field: EditableField) => {
        setEditValue(profile[field]);
        setEditModal({ visible: true, field });
    }, [profile]);

    const saveEdit = useCallback(() => {
        if (editModal.field) {
            setProfile((prev) => ({ ...prev, [editModal.field!]: editValue.trim() }));
        }
        setEditModal({ visible: false, field: null });
    }, [editModal.field, editValue]);

    const closeEdit = useCallback(() => {
        setEditModal({ visible: false, field: null });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <DefaultView style={styles.avatarSection}>
                    <View
                        style={styles.avatarContainer}
                        lightColor={Colors.palette.accentBgLight}
                        darkColor={Colors.palette.accentBgDark}
                    >
                        {user?.photoURL
                            ? <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                            : <Ionicons name="person" size={48} color={Colors.palette.primary} />
                        }
                    </View>
                    <Text style={styles.userName}>{profile.displayName}</Text>
                    <Text style={styles.userEmail}>{profile.email}</Text>
                </DefaultView>

                <DefaultView style={styles.section}>
                    <Text style={styles.sectionTitle}>Personal Information</Text>
                    <DefaultView style={styles.fieldsList}>
                        {(Object.keys(FIELD_META) as EditableField[]).map((field) => (
                            <ProfileFieldRow
                                key={field}
                                field={field}
                                value={profile[field]}
                                onPress={openEdit}
                            />
                        ))}
                    </DefaultView>
                </DefaultView>

                <DefaultView style={styles.section}>
                    <Text style={styles.sectionTitle}>Account</Text>
                    <DefaultView style={styles.settingsList}>
                        <SettingsItem icon="receipt-outline" title="My Orders" route="/orders" />
                        <Pressable
                            onPress={() => setCardModal(true)}
                            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        >
                            <View style={[styles.actionRow, { backgroundColor: cardBg }]}>
                                <View style={styles.actionLeft}>
                                    <View
                                        style={styles.actionIconWrap}
                                        lightColor={Colors.palette.accentBgLight}
                                        darkColor={Colors.palette.accentBgDark}
                                    >
                                        <Ionicons name="card-outline" size={20} color={Colors.palette.primary} />
                                    </View>
                                    <Text style={styles.actionTitle}>Payment Methods</Text>
                                </View>
                                <DefaultView style={styles.actionRight}>
                                    <Text style={styles.actionValue}>Visa •••• {card.number}</Text>
                                    <Ionicons name="chevron-forward" size={20} color={Colors.palette.gray} />
                                </DefaultView>
                            </View>
                        </Pressable>
                        <Pressable
                            onPress={() => setPwModal(true)}
                            style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                        >
                            <View style={[styles.actionRow, { backgroundColor: cardBg }]}>
                                <View style={styles.actionLeft}>
                                    <View
                                        style={styles.actionIconWrap}
                                        lightColor={Colors.palette.accentBgLight}
                                        darkColor={Colors.palette.accentBgDark}
                                    >
                                        <Ionicons name="lock-closed-outline" size={20} color={Colors.palette.primary} />
                                    </View>
                                    <Text style={styles.actionTitle}>Change Password</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color={Colors.palette.gray} />
                            </View>
                        </Pressable>
                    </DefaultView>
                </DefaultView>
            </ScrollView>

            <EditFieldModal
                visible={editModal.visible}
                field={editModal.field}
                value={editValue}
                onChangeText={setEditValue}
                onSave={saveEdit}
                onClose={closeEdit}
            />

            <ChangePasswordModal
                visible={pwModal}
                onClose={() => setPwModal(false)}
            />

            <PaymentCardModal
                visible={cardModal}
                initialCard={card}
                onSave={(updated) => setCard(updated)}
                onClose={() => setCardModal(false)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 28,
    },
    avatarContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        marginBottom: 12,
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    userName: {
        fontSize: 22,
        fontWeight: '700',
    },
    userEmail: {
        fontSize: 14,
        color: Colors.palette.textMuted,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.palette.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginBottom: 12,
        marginLeft: 4,
    },
    fieldsList: {
        gap: 10,
    },
    settingsList: {
        gap: 0,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 14,
        borderRadius: 15,
        width: '100%',
        marginBottom: 10,
    },
    actionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    actionIconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionTitle: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    actionRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'transparent',
    },
    actionValue: {
        fontSize: 13,
        color: Colors.palette.textMuted,
    },
});
