import { auth, db } from '@/constants/firebase';
import { signOut as firebaseSignOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
    photoURL: string | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    photoURL: null,
    loading: true,
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
            if (!firebaseUser) setPhotoURL(null);
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userRef, (snap) => {
            if (snap.exists()) {
                setPhotoURL(snap.data()?.photoURL ?? user.photoURL ?? null);
            } else {
                setPhotoURL(user.photoURL ?? null);
            }
        }, () => {
            setPhotoURL(user.photoURL ?? null);
        });

        return unsubscribe;
    }, [user?.uid]);

    const signOut = async () => {
        await firebaseSignOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, photoURL, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
