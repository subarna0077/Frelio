import { create } from 'zustand'
import type { User } from '../types/auth';
import { persist } from 'zustand/middleware'

export interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    setUser: (user: User) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>()(persist(
    (set) => ({
        isAuthenticated: false,
        user: null,
        setUser: (user) => set({
            user,
            isAuthenticated: true
        }),
        logout: () => set({ user: null, isAuthenticated: false })
    }), {
    name: 'auth-storage',
    partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
    }),
}))