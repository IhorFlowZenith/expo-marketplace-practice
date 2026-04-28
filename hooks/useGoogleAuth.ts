import { auth } from '@/constants/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const ANDROID_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;

export function useGoogleAuth() {
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: WEB_CLIENT_ID,
        androidClientId: ANDROID_CLIENT_ID || undefined,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential).catch((error) => {
                console.error('Google sign-in error:', error);
                Alert.alert('Error', error.message);
            });
        }
    }, [response]);

    const signInWithGoogle = async () => {
        if (!request) {
            Alert.alert(
                'Not configured',
                'Google Sign-In requires valid Client IDs. Check hooks/useGoogleAuth.ts.'
            );
            return;
        }
        await promptAsync();
    };

    return { signInWithGoogle };
}
