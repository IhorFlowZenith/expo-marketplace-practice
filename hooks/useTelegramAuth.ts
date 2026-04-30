import { auth } from '@/constants/firebase';
import * as AuthSession from 'expo-auth-session';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useEffect } from 'react';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

const TELEGRAM_CLIENT_ID = '8648665046';
const TELEGRAM_CLIENT_SECRET = process.env.EXPO_PUBLIC_TELEGRAM_CLIENT_SECRET ?? '';
const TELEGRAM_ISSUER = 'https://oauth.telegram.org';
const REDIRECT_URI = 'https://app3929269548-login.tg.dev/tglogin';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

const provider = new OAuthProvider('oidc.telegram');

export function useTelegramAuth() {
	const discovery = AuthSession.useAutoDiscovery(TELEGRAM_ISSUER);

	const [request, response, promptAsync] = AuthSession.useAuthRequest(
		{
			clientId: TELEGRAM_CLIENT_ID,
			redirectUri: REDIRECT_URI,
			scopes: ['openid', 'profile'],
			responseType: AuthSession.ResponseType.Code,
			usePKCE: true,
			extraParams: {
				client_secret: TELEGRAM_CLIENT_SECRET,
			},
		},
		discovery
	);

	useEffect(() => {
		if (!response) return;
		if (response.type === 'error') {
			Alert.alert('Telegram error', response.error?.message ?? 'Unknown error');
			return;
		}
		if (response.type !== 'success') return;

		const { code } = response.params;
		if (!code || !request?.codeVerifier || !discovery?.tokenEndpoint) return;

		AuthSession.exchangeCodeAsync(
			{
				clientId: TELEGRAM_CLIENT_ID,
				code,
				redirectUri: REDIRECT_URI,
				extraParams: {
					code_verifier: request.codeVerifier,
					client_secret: TELEGRAM_CLIENT_SECRET,
				},
			},
			{ tokenEndpoint: discovery.tokenEndpoint }
		)
			.then((tokenResponse) => {
				const idToken = tokenResponse.idToken;
				const accessToken = tokenResponse.accessToken;

				if (!idToken) {
					Alert.alert('Error', 'No id_token in token response');
					return;
				}

				const credential = provider.credential({
					idToken,
					accessToken: accessToken ?? undefined,
				});

				return signInWithCredential(auth, credential);
			})
			.catch((error: Error) => {
				Alert.alert('Помилка', error.message);
			});
	}, [response]);

	const signInWithTelegram = async () => {
		if (isExpoGo) {
			Alert.alert(
				'Expo Go не підтримується',
				'Telegram авторизація працює тільки в нативній збірці (APK).\n\neas build --profile preview --platform android'
			);
			return;
		}
		if (!request) {
			Alert.alert('Not ready', 'Telegram auth is loading, try again');
			return;
		}
		await promptAsync();
	};

	return { signInWithTelegram };
}
