import Colors from '@/constants/Colors';
import { StyleSheet } from 'react-native';

export const authStyles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
    },
    flex: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingVertical: 40,
    },
    headerSection: {
        marginBottom: 40,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        opacity: 0.6,
        textAlign: 'center',
        lineHeight: 24,
    },
    errorContainer: {
        marginTop: -8,
        marginBottom: 8,
    },
    errorText: {
        color: Colors.palette.error,
        fontSize: 14,
        fontWeight: '500',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
    },
    dividerText: {
        marginHorizontal: 16,
        fontSize: 14,
        opacity: 0.5,
    },
    socialRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        opacity: 0.6,
    },
    footerLink: {
        fontWeight: 'bold',
        color: Colors.palette.primary,
    },
});
