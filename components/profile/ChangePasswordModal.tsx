import { Text, useThemeColor } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    View as DefaultView,
    Modal,
    Pressable,
    StyleSheet,
    TextInput,
} from 'react-native';

interface PasswordInputRowProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    show: boolean;
    onToggleShow: () => void;
    inputBg: string;
    textColor: string;
    borderColor: string;
}

function PasswordInputRow({
    value,
    onChangeText,
    placeholder,
    show,
    onToggleShow,
    inputBg,
    textColor,
    borderColor,
}: PasswordInputRowProps) {
    return (
        <DefaultView style={[styles.pwRow, { backgroundColor: inputBg, borderColor }]}>
            <TextInput
                style={[styles.pwInput, { color: textColor }]}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={!show}
                placeholder={placeholder}
                placeholderTextColor={Colors.palette.placeholder}
            />
            <Pressable onPress={onToggleShow} style={styles.eyeBtn}>
                <Ionicons
                    name={show ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={Colors.palette.textMuted}
                />
            </Pressable>
        </DefaultView>
    );
}

interface ChangePasswordModalProps {
    visible: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ visible, onClose }: ChangePasswordModalProps) {
    const textColor = useThemeColor({}, 'text');
    const cardBg = useThemeColor({ light: Colors.palette.cardLight, dark: Colors.palette.cardDark }, 'background');
    const inputBg = useThemeColor({ light: Colors.palette.inputBgLight, dark: Colors.palette.accentBgDark }, 'background');
    const borderColor = useThemeColor({ light: Colors.palette.borderLight, dark: Colors.palette.borderDark }, 'text');

    const [currentPw, setCurrentPw] = useState('');
    const [newPw, setNewPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [pwError, setPwError] = useState<string | null>(null);
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleClose = () => {
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        setPwError(null);
        onClose();
    };

    const handleSave = () => {
        if (!currentPw.trim()) { setPwError('Enter your current password'); return; }
        if (newPw.length < 6) { setPwError('New password must be at least 6 characters'); return; }
        if (newPw !== confirmPw) { setPwError('Passwords do not match'); return; }
        // TODO: call Firebase updatePassword(auth.currentUser, newPw)
        handleClose();
    };

    const clearError = (setter: (v: string) => void) => (v: string) => {
        setter(v);
        setPwError(null);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <Pressable style={styles.overlay} onPress={handleClose}>
                <Pressable style={[styles.content, { backgroundColor: cardBg }]} onPress={() => { }}>
                    <DefaultView style={styles.header}>
                        <Text style={styles.title}>Change Password</Text>
                        <Pressable
                            onPress={handleClose}
                            style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.6 : 1 }]}
                        >
                            <Ionicons name="close" size={22} color={textColor} />
                        </Pressable>
                    </DefaultView>

                    <PasswordInputRow
                        value={currentPw}
                        onChangeText={clearError(setCurrentPw)}
                        placeholder="Current password"
                        show={showCurrent}
                        onToggleShow={() => setShowCurrent((p) => !p)}
                        inputBg={inputBg}
                        textColor={textColor}
                        borderColor={borderColor}
                    />
                    <PasswordInputRow
                        value={newPw}
                        onChangeText={clearError(setNewPw)}
                        placeholder="New password (min 6 chars)"
                        show={showNew}
                        onToggleShow={() => setShowNew((p) => !p)}
                        inputBg={inputBg}
                        textColor={textColor}
                        borderColor={borderColor}
                    />
                    <PasswordInputRow
                        value={confirmPw}
                        onChangeText={clearError(setConfirmPw)}
                        placeholder="Confirm new password"
                        show={showConfirm}
                        onToggleShow={() => setShowConfirm((p) => !p)}
                        inputBg={inputBg}
                        textColor={textColor}
                        borderColor={borderColor}
                    />

                    {pwError && <Text style={styles.errorText}>{pwError}</Text>}

                    <DefaultView style={styles.actions}>
                        <Pressable
                            onPress={handleClose}
                            style={({ pressed }) => [styles.cancelBtn, { borderColor, opacity: pressed ? 0.7 : 1 }]}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleSave}
                            style={({ pressed }) => [styles.saveBtn, { opacity: pressed ? 0.85 : 1 }]}
                        >
                            <Text style={styles.saveText}>Update</Text>
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
    pwRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 14,
        borderWidth: 1,
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    pwInput: {
        flex: 1,
        height: 52,
        fontSize: 16,
    },
    eyeBtn: {
        paddingHorizontal: 4,
    },
    errorText: {
        color: Colors.palette.error,
        fontSize: 13,
        marginBottom: 12,
        marginLeft: 4,
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
