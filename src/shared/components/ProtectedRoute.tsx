import React from 'react'
import { useAuthStore } from '../../features/auth/stores/authStore'
import { Navigate } from 'react-router-dom'

export const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
    const { isAuthenticated } = useAuthStore()

    if (!isAuthenticated) return <Navigate to={'/login'} replace/>
    return (
        <div>
            {children}
        </div>
    )
}


