import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, Href } from 'expo-router';

import { Text, View, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';

interface SettingsItemProps {
    icon: any;
    title: string;
    route: Href;
    value?: string;
}

export default function SettingsItem({ icon, title, route, value }: SettingsItemProps) {
    const router = useRouter();

    const iconColor = useThemeColor({}, 'text');
    const cardBackground = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');

    return (
        <TouchableOpacity
            onPress={() => router.push(route)}
            activeOpacity={0.7}
        >
            <View style={[styles.item, { backgroundColor: cardBackground }]}>
                <View style={styles.leftPart}>
                    <Ionicons name={icon} size={24} color={iconColor} />
                    <Text style={styles.title}>{title}</Text>
                </View>

                <View style={styles.rightPart}>
                    {value && <Text style={styles.value}>{value}</Text>}
                    <Ionicons name="chevron-forward" size={20} color={Colors.palette.gray} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 18,
        paddingHorizontal: 15,
        borderRadius: 15,
        width: '100%',
        marginBottom: 10,
    },
    leftPart: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    title: {
        marginLeft: 15,
        fontSize: 16,
        fontWeight: '600',
    },
    rightPart: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    value: {
        marginRight: 10,
        color: Colors.palette.textMuted,
        fontSize: 14
    }
});
