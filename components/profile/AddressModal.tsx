import { Text, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View as DefaultView, Modal, Pressable, StyleSheet, TextInput } from 'react-native';

export type AddressData = {
    street: string;
    city: string;
    country: string;
    postalCode: string;
};

interface LabeledInputProps {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    inputBg: string;
    textColor: string;
    borderColor: string;
    icon: keyof typeof Ionicons.glyphMap;
}

function LabeledInput({
    label, value, onChangeText, placeholder,
    inputBg, textColor, borderColor, icon,
}: LabeledInputProps) {
    return (
        <DefaultView style={styles.inputGroup}>
            <DefaultView style={styles.inputLabel}>
                <Ionicons name={icon} size={15} color={Colors.palette.primary} style={{ marginRight: 6 }} />
                <Text style={styles.inputLabelText}>{label}</Text>
            </DefaultView>
            <TextInput
                style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.palette.placeholder}
            />
        </DefaultView>
    );
}

interface AddressModalProps {
    visible: boolean;
    initialData?: AddressData;
    onSave: (data: AddressData) => void;
    onClose: () => void;
}

export default function AddressModal({ visible, initialData = { street: '', city: '', country: '', postalCode: '' }, onSave, onClose }: AddressModalProps) {
    const textColor = useThemeColor({}, 'text');
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const inputBg = useThemeColor({ light: Colors.palette.inputBgLight, dark: Colors.palette.accentBgDark }, 'background');
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');

    const [street, setStreet] = useState(initialData.street);
    const [city, setCity] = useState(initialData.city);
    const [country, setCountry] = useState(initialData.country);
    const [postalCode, setPostalCode] = useState(initialData.postalCode);
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => {
        setStreet(initialData.street);
        setCity(initialData.city);
        setCountry(initialData.country);
        setPostalCode(initialData.postalCode);
        setError(null);
        onClose();
    };

    const handleSave = () => {
        if (!street.trim()) { setError('Please enter your street address'); return; }
        if (!city.trim()) { setError('Please enter your city'); return; }
        if (!country.trim()) { setError('Please enter your country'); return; }
        if (!postalCode.trim()) { setError('Please enter your postal code'); return; }
        onSave({ street: street.trim(), city: city.trim(), country: country.trim(), postalCode: postalCode.trim() });
        handleClose();
    };

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Pressable style={[styles.content, { backgroundColor: cardBg }]} onPress={() => { }}>
                    <DefaultView style={styles.header}>
                        <Text style={styles.title}>Delivery Address</Text>
                        <Pressable onPress={handleClose} style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}><Ionicons name="close" size={22} color={textColor} /></Pressable>
                    </DefaultView>

                    <LabeledInput
                        label="Street Address"
                        value={street}
                        onChangeText={(v) => { setStreet(v); setError(null); }}
                        placeholder="123 Main Street"
                        icon="home-outline"
                        inputBg={inputBg}
                        textColor={textColor}
                        borderColor={borderColor}
                    />

                    <LabeledInput
                        label="City"
                        value={city}
                        onChangeText={(v) => { setCity(v); setError(null); }}
                        placeholder="New York"
                        icon="business-outline"
                        inputBg={inputBg}
                        textColor={textColor}
                        borderColor={borderColor}
                    />

                    <DefaultView style={{ flexDirection: 'row', gap: 12 }}>
                        <DefaultView style={{ flex: 1 }}>
                            <LabeledInput
                                label="Country"
                                value={country}
                                onChangeText={(v) => { setCountry(v); setError(null); }}
                                placeholder="USA"
                                icon="globe-outline"
                                inputBg={inputBg}
                                textColor={textColor}
                                borderColor={borderColor}
                            />
                        </DefaultView>
                        <DefaultView style={{ flex: 1 }}>
                            <LabeledInput
                                label="Postal Code"
                                value={postalCode}
                                onChangeText={(v) => { setPostalCode(v); setError(null); }}
                                placeholder="10001"
                                icon="mail-outline"
                                inputBg={inputBg}
                                textColor={textColor}
                                borderColor={borderColor}
                            />
                        </DefaultView>
                    </DefaultView>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <DefaultView style={styles.actions}>
                        <Pressable onPress={handleClose} style={({ pressed }) => [styles.cancelBtn, { borderColor, opacity: pressed ? 0.7 : 1 }]}><Text style={styles.cancelText}>Cancel</Text></Pressable>
                        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.85 : 1 }]}><Text style={styles.saveText}>Save Address</Text></Pressable>
                    </DefaultView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end'
    },
    content: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 36
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    title: { fontSize: 20, fontWeight: '700' },
    closeBtn: {
        width: 36, height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.06)'
    },
    inputGroup: {
        marginBottom: 16
    },
    inputLabel: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    inputLabelText: {
        fontSize: 13,
        fontWeight: '600',
        color: Colors.palette.textMuted
    },
    input: {
        height: 48,
        borderRadius: 12,
        paddingHorizontal: 14,
        fontSize: 15,
        borderWidth: 1
    },
    errorText: {
        color: Colors.palette.error,
        fontSize: 13,
        marginBottom: 12,
        marginLeft: 2
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 4
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600'
    },
    saveBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.palette.primary
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.palette.white
    },
});
