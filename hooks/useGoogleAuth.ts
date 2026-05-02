import { auth } from '@/constants/firebase';
import { GoogleSignin, isErrorWithCode, statusCodes } from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Alert } from 'react-native';

const WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});

export function useGoogleAuth() {
    const signInWithGoogle = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const response = await GoogleSignin.signIn();
            
            if (response?.data?.idToken) {
                const credential = GoogleAuthProvider.credential(response.data.idToken);
                await signInWithCredential(auth, credential);
            } else {
                throw new Error('No ID token present!');
            }
        } catch (error: any) {
            if (isErrorWithCode(error)) {
                switch (error.code) {
                    case statusCodes.SIGN_IN_CANCELLED:
                        break;
                    case statusCodes.IN_PROGRESS:
                        Alert.alert('Google Sign-In', 'Sign in is already in progress.');
                        break;
                    case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                        Alert.alert('Google Sign-In', 'Play services not available or outdated.');
                        break;
                    default:
                        Alert.alert('Google Error', error.message ?? 'Unknown error');
                }
            } else {
                Alert.alert('Google Error', error.message ?? 'Unknown error');
            }
        }
    };

    return { signInWithGoogle };
}
