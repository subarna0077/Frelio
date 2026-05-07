import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../features/auth/pages/Login'
import { Register } from '../features/auth/pages/Register'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'
import { Dashboard } from '../features/dashboard/pages/Dashboard'

export const AppRouter = () => {

    return (

        <Routes>
            <Route path='/' element={<Navigate to='/login' />}>

            </Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>


            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>
            }></Route>


        </Routes>

    )

}