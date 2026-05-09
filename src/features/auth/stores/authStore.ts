import { create } from 'zustand'
import type { User } from '../types/auth';
import { persist } from 'zustand/middleware'

export interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    token: string;
    setUser: (user: User, token: string) => void;
    logout: ()=> void;
}

export const useAuthStore = create<AuthStore>()(persist(
    (set) => ({
        isAuthenticated: false,
        user: null,
        token: '',
        setUser: (user, token) => set({
            user,
            token,
            isAuthenticated: true
        }),
        logout: ()=> set({user:null, token:'', isAuthenticated:false})
    }), {
    name: 'auth-storage',
    partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        token: state.token
    }),
}))