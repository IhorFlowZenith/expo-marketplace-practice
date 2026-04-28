import { Text, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View as DefaultView, Modal, Pressable, StyleSheet, TextInput } from 'react-native';

export type PaymentCard = {
    holderName: string;
    number: string;
    expiry: string;
    cvv: string;
};

const DEFAULT_CARD: PaymentCard = {
    holderName: 'Pelykh Ihor',
    number: '4242',
    expiry: '12/27',
    cvv: '',
};

const formatCardNumber = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 16);
    return digits.match(/.{1,4}/g)?.join(' ') ?? digits;
};

const formatExpiry = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
};

const validateCard = (card: PaymentCard) => {
    if (!card.holderName.trim()) return 'Enter card holder name';
    if (card.number.replace(/\s/g, '').length !== 16) return 'Card number must be 16 digits';
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) return 'Invalid expiry (MM/YY)';
    if (card.cvv.length < 3) return 'CVV must be 3–4 digits';
    return null;
};

interface LabeledInputProps {
    label: string;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'numeric' | 'number-pad';
    maxLength?: number;
    secureTextEntry?: boolean;
    inputBg: string;
    textColor: string;
    borderColor: string;
    icon: keyof typeof Ionicons.glyphMap;
}

function LabeledInput({
    label, value, onChangeText, placeholder, keyboardType = 'default',
    maxLength, secureTextEntry, inputBg, textColor, borderColor, icon,
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
                keyboardType={keyboardType}
                maxLength={maxLength}
                secureTextEntry={secureTextEntry}
            />
        </DefaultView>
    );
}

interface PaymentCardModalProps {
    visible: boolean;
    initialCard?: PaymentCard;
    onSave: (card: PaymentCard) => void;
    onClose: () => void;
}

export default function PaymentCardModal({ visible, initialCard = DEFAULT_CARD, onSave, onClose }: PaymentCardModalProps) {
    const textColor = useThemeColor({}, 'text');
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const inputBg = useThemeColor({ light: Colors.palette.inputBgLight, dark: Colors.palette.accentBgDark }, 'background');
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');

    const [holderName, setHolderName] = useState(initialCard.holderName);
    const [number, setNumber] = useState('');
    const [expiry, setExpiry] = useState(initialCard.expiry);
    const [cvv, setCvv] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleClose = () => { setNumber(''); setCvv(''); setError(null); onClose(); };

    const handleSave = () => {
        const cardData = { holderName, number: number.replace(/\s/g, ''), expiry, cvv };
        const err = validateCard(cardData);
        if (err) { setError(err); return; }
        onSave({ ...cardData, number: cardData.number.slice(-4) });
        handleClose();
    };

    const displayNumber = number ? number.replace(/\d(?=.{5})/g, '•') : `•••• •••• •••• ${initialCard.number}`;

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Pressable style={[styles.content, { backgroundColor: cardBg }]} onPress={() => { }}>
                    <DefaultView style={styles.header}>
                        <Text style={styles.title}>Payment Method</Text>
                        <Pressable onPress={handleClose} style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}><Ionicons name="close" size={22} color={textColor} /></Pressable>
                    </DefaultView>

                    <DefaultView style={styles.cardVisual}>
                        <DefaultView style={styles.cardChip}><Ionicons name="card" size={22} color="rgba(255,255,255,0.8)" /></DefaultView>
                        <Text style={styles.cardNumber}>{displayNumber}</Text>
                        <DefaultView style={styles.cardBottom}>
                            <DefaultView><Text style={styles.cardMeta}>Card Holder</Text><Text style={styles.cardValue}>{holderName || '—'}</Text></DefaultView>
                            <DefaultView style={{ alignItems: 'flex-end' }}><Text style={styles.cardMeta}>Expires</Text><Text style={styles.cardValue}>{expiry || '—'}</Text></DefaultView>
                        </DefaultView>
                    </DefaultView>

                    <LabeledInput label="Card Holder Name" value={holderName} onChangeText={(v) => { setHolderName(v); setError(null); }} placeholder="Full name on card" icon="person-outline" inputBg={inputBg} textColor={textColor} borderColor={borderColor} />
                    <LabeledInput label="Card Number" value={number} onChangeText={(v) => { setNumber(formatCardNumber(v)); setError(null); }} placeholder="0000 0000 0000 0000" keyboardType="number-pad" maxLength={19} icon="card-outline" inputBg={inputBg} textColor={textColor} borderColor={borderColor} />
                    <DefaultView style={styles.rowInputs}>
                        <DefaultView style={{ flex: 1 }}><LabeledInput label="Expiry" value={expiry} onChangeText={(v) => { setExpiry(formatExpiry(v)); setError(null); }} placeholder="MM/YY" keyboardType="number-pad" maxLength={5} icon="calendar-outline" inputBg={inputBg} textColor={textColor} borderColor={borderColor} /></DefaultView>
                        <DefaultView style={{ flex: 1 }}><LabeledInput label="CVV" value={cvv} onChangeText={(v) => { setCvv(v.replace(/\D/g, '').slice(0, 4)); setError(null); }} placeholder="•••" keyboardType="number-pad" maxLength={4} secureTextEntry icon="lock-closed-outline" inputBg={inputBg} textColor={textColor} borderColor={borderColor} /></DefaultView>
                    </DefaultView>

                    {error && <Text style={styles.errorText}>{error}</Text>}
                    <DefaultView style={styles.actions}>
                        <Pressable onPress={handleClose} style={({ pressed }) => [styles.cancelBtn, { borderColor, opacity: pressed ? 0.7 : 1 }]}><Text style={styles.cancelText}>Cancel</Text></Pressable>
                        <Pressable onPress={handleSave} style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.85 : 1 }]}><Text style={styles.saveText}>Save Card</Text></Pressable>
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
    cardVisual: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        backgroundColor: Colors.palette.primary,
        elevation: 8,
        shadowColor: Colors.palette.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12
    },
    cardChip: {
        marginBottom: 16
    },
    cardNumber: {
        color: Colors.palette.white,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 20
    },
    cardBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    cardMeta: {
        color: 'rgba(255,255,255,0.65)',
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    cardValue: {
        color: Colors.palette.white,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 2
    },
    inputGroup: {
        marginBottom: 12
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
    rowInputs: {
        flexDirection: 'row',
        gap: 12
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
