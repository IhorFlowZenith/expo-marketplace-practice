import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
    View as DefaultView,
} from 'react-native';
import { Text, useThemeColor } from './Themed';
import { EditableField, FIELD_META } from './profile/ProfileFieldRow';

interface EditFieldModalProps {
    visible: boolean;
    field: EditableField | null;
    value: string;
    onChangeText: (text: string) => void;
    onSave: () => void;
    onClose: () => void;
}

export default function EditFieldModal({
    visible,
    field,
    value,
    onChangeText,
    onSave,
    onClose,
}: EditFieldModalProps) {
    const textColor = useThemeColor({}, 'text');
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const inputBg = useThemeColor({ light: Colors.palette.inputBgLight, dark: Colors.palette.accentBgDark }, 'background');
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');

    const meta = field ? FIELD_META[field] : null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Pressable style={[styles.content, { backgroundColor: cardBg }]} onPress={() => {}}>
                    <DefaultView style={styles.header}>
                        <Text style={styles.title}>Edit {meta?.label}</Text>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
                        >
                            <Ionicons name="close" size={22} color={textColor} />
                        </Pressable>
                    </DefaultView>

                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, color: textColor, borderColor }]}
                        value={value}
                        onChangeText={onChangeText}
                        keyboardType={meta?.keyboard || 'default'}
                        autoFocus
                        placeholder={`Enter ${meta?.label?.toLowerCase()}`}
                        placeholderTextColor={Colors.palette.placeholder}
                    />

                    <DefaultView style={styles.actions}>
                        <Pressable
                            onPress={onClose}
                            style={({ pressed }) => [styles.cancelBtn, { borderColor, opacity: pressed ? 0.7 : 1 }]}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={onSave}
                            style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.85 : 1 }]}
                        >
                            <Text style={styles.saveText}>Save</Text>
                        </Pressable>
                    </DefaultView>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 36,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    closeBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    input: {
        height: 52,
        borderRadius: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
    },
    saveBtn: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.palette.primary,
    },
    saveText: {
        fontSize: 16,
        fontWeight: '700',
        color: Colors.palette.white,
    },
});
