import {create} from 'zustand'
import type { User } from '../types/auth';

export interface AuthStore {
    isAuthenticated: boolean;
    user: User | null;
    token: string;
    setUser: (user: User, token: string)=> void;
}


export const useAuthStore =  create<AuthStore>((set)=> ({
    isAuthenticated: false,
    user: null,
    token: '',
    setUser: (user, token)=> set({
       user,
       token,
       isAuthenticated: true
    })
}))