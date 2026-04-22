import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { View as DefaultView, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import SettingsItem from '@/components/SettingsItem';
import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, signOut } = useAuth();
    const textColor = useThemeColor({}, 'text');

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <DefaultView style={styles.header}>
                    <View style={styles.avatarContainer} lightColor={Colors.palette.accentBgLight} darkColor={Colors.palette.accentBgDark}>
                        {user?.photoURL ? (
                            <Image source={{ uri: user.photoURL }} style={styles.avatar} />
                        ) : (
                            <Ionicons name="person" size={50} color={Colors.palette.primary} />
                        )}
                    </View>

                    <Text style={styles.name}>{user?.displayName || 'User Name'}</Text>
                    <Text style={styles.email}>{user?.email || 'No email provided'}</Text>
                </DefaultView>

                <DefaultView style={styles.menuSection}>
                    <SettingsItem icon="person-outline" title="Profile" route="/profile-details" />
                    <SettingsItem icon="settings-outline" title="Setting" route="/settings" />
                    <SettingsItem icon="mail-outline" title="Contact" route="/contact" />
                    <SettingsItem icon="share-social-outline" title="Share App" route="/share" />
                    <SettingsItem icon="help-circle-outline" title="Help" route="/help" />
                </DefaultView>

                <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
                    <Text style={styles.signOutText}>Sign Out</Text>
                </TouchableOpacity>
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
        paddingTop: 60,
        paddingBottom: 40,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
        overflow: 'hidden',
    },
    avatar: {
        width: '100%',
        height: '100%',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        opacity: 0.5,
        marginTop: 4,
    },
    menuSection: {
        width: '100%',
        marginBottom: 30,
        gap: 12,
    },
    signOutButton: {
        marginTop: 20,
    },
    signOutText: {
        color: Colors.palette.warning,
        fontSize: 16,
        fontWeight: '600',
    },
});
