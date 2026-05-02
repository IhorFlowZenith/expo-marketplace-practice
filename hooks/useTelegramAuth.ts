import { auth } from '@/constants/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const TELEGRAM_CLIENT_ID = process.env.EXPO_PUBLIC_TELEGRAM_CLIENT_ID ?? '8648665046';
const TELEGRAM_CLIENT_SECRET = process.env.EXPO_PUBLIC_TELEGRAM_CLIENT_SECRET ?? 'd-R8GZbSnMT0HJOlBsOmLP-Mj4ErQSlCKPFe3pCvt77itg6LK8uByQ';
const TELEGRAM_ISSUER = 'https://oauth.telegram.org';

const REDIRECT_URI = AuthSession.makeRedirectUri({
    scheme: 'marketplace',
    path: 'tglogin',
});

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const provider = new OAuthProvider('oidc.telegram');

const STORAGE_KEY_CODE_VERIFIER = 'tg_code_verifier';
const STORAGE_KEY_TOKEN_ENDPOINT = 'tg_token_endpoint';

async function exchangeAndSignIn(
    code: string,
    codeVerifier: string,
    tokenEndpoint: string
): Promise<void> {
    const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
            clientId: TELEGRAM_CLIENT_ID,
            code,
            redirectUri: REDIRECT_URI,
            extraParams: {
                code_verifier: codeVerifier,
                client_secret: TELEGRAM_CLIENT_SECRET,
            },
        },
        { tokenEndpoint }
    );

    const idToken = tokenResponse.idToken;

    if (!idToken) {
        throw new Error('No id_token received from Telegram.');
    }

    const credential = provider.credential({ idToken });
    await signInWithCredential(auth, credential);

    await AsyncStorage.multiRemove([STORAGE_KEY_CODE_VERIFIER, STORAGE_KEY_TOKEN_ENDPOINT]);

    router.replace('/(tabs)');
}

export function useTelegramAuth() {
    const discovery = AuthSession.useAutoDiscovery(TELEGRAM_ISSUER);

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: TELEGRAM_CLIENT_ID,
            redirectUri: REDIRECT_URI,
            scopes: ['openid', 'profile'],
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
            extraParams: { client_secret: TELEGRAM_CLIENT_SECRET },
        },
        discovery
    );

    useEffect(() => {
        if (!response) return;

        if (response.type !== 'success') {
            if (response.type === 'error') {
                Alert.alert('Telegram auth error', response.error?.message ?? 'Unknown error');
            }
            return;
        }

        const { code } = response.params;
        if (!code || !request?.codeVerifier || !discovery?.tokenEndpoint) return;

        exchangeAndSignIn(code, request.codeVerifier, discovery.tokenEndpoint)
            .catch((e: Error) => {
                Alert.alert('Telegram auth error', `${e.message}\n\nCode: ${(e as any).code ?? 'none'}`);
            });
    }, [response]);

    const signInWithTelegram = async () => {
        if (!request) {
            Alert.alert('Not ready', 'Telegram auth is loading, please try again.');
            return;
        }

        await AsyncStorage.multiRemove([STORAGE_KEY_CODE_VERIFIER, STORAGE_KEY_TOKEN_ENDPOINT]);

        if (request.codeVerifier) {
            await AsyncStorage.setItem(STORAGE_KEY_CODE_VERIFIER, request.codeVerifier);
        }
        if (discovery?.tokenEndpoint) {
            await AsyncStorage.setItem(STORAGE_KEY_TOKEN_ENDPOINT, discovery.tokenEndpoint);
        }

        await promptAsync();
    };

    return { signInWithTelegram };
}
