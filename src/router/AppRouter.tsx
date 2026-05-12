import { Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '../features/auth/pages/Login'
import { Register } from '../features/auth/pages/Register'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'
import { Dashboard } from '../features/dashboard/pages/Dashboard'
import { Projects } from '../features/projects/pages/Projects'
import { SingleProject } from '../features/projects/pages/SingleProject'
import { ClientsPage } from '../features/clients/pages/ClientsPage'

export const AppRouter = () => {

    return (

        <Routes>
            <Route path='/' element={<Navigate to='/login' />}>

            </Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>


            <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>
            }></Route>

             <Route path='/clients' element={<ProtectedRoute><ClientsPage /></ProtectedRoute>
            }></Route>

            <Route path='/projects' element={<ProtectedRoute><Projects /></ProtectedRoute>}></Route>

            <Route path='/projects/:id' element={<ProtectedRoute><SingleProject /></ProtectedRoute>}></Route>
        </Routes>

    )

}