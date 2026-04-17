import { initializeApp } from 'firebase/app';
import {
    initializeAuth,
    //@ts-ignore
    getReactNativePersistence
} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyC7Awj-RKl1c3fl-bvP5pupvSUxax7gsZU",
    authDomain: "expo-marketplace-practice.firebaseapp.com",
    projectId: "expo-marketplace-practice",
    storageBucket: "expo-marketplace-practice.firebasestorage.app",
    messagingSenderId: "256935465203",
    appId: "1:256935465203:web:67a5c5b213015be44ba786"
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});
