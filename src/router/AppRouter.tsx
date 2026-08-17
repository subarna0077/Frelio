import { Routes, Route } from 'react-router-dom'
import { Login } from '../features/auth/pages/Login'
import { Register } from '../features/auth/pages/Register'
import { ProtectedRoute } from '../shared/components/ProtectedRoute'
import { Dashboard } from '../features/dashboard/pages/Dashboard'
import { ProjectsPage } from '../features/projects/pages/Projects'
import { SingleProject } from '../features/projects/pages/SingleProject'
import { Clients } from '../features/clients/pages/ClientsPage'
import { Invoices } from '../features/invoice/pages/Invoices'
import AppLayout from '../shared/components/Layout'
import { InvoiceDetail } from '../features/invoice/pages/InvoiceDetail'
import { ClientPortal } from '../shared/pages/ClientPortal'
import { PaymentSuccessPortal } from '../shared/pages/PaymentSuccessPortal'
import { Settings } from '../features/auth/pages/Settings'
import { ClientDetail } from '../features/clients/pages/ClientDetail'
import LandingPage from '../shared/pages/LandingPage'
import { Billing } from '../features/billing/pages/Billing'
import { SubscriptionPaymentSuccess } from '../features/billing/pages/SubscriptionPaymentSuccess'
export const AppRouter = () => {

    return (

        <Routes>
            <Route path='/' element={<LandingPage/>}>

            </Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/register' element={<Register />}></Route>


            <Route path='/dashboard' element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>
            }></Route>

            <Route path='/clients' element={<ProtectedRoute><AppLayout><Clients /></AppLayout></ProtectedRoute>
            }></Route>

            <Route path='/projects' element={<ProtectedRoute><AppLayout><ProjectsPage /></AppLayout></ProtectedRoute>}></Route>

            <Route path='/projects/:id' element={<ProtectedRoute><AppLayout><SingleProject /></AppLayout></ProtectedRoute>}></Route>

            <Route path='invoices' element={<ProtectedRoute><AppLayout><Invoices /></AppLayout></ProtectedRoute>}></Route>

            <Route path='/invoices/:id' element={<ProtectedRoute><AppLayout><InvoiceDetail /></AppLayout></ProtectedRoute>}></Route>

            <Route path='/portal/:id' element={<ClientPortal />}></Route>

            <Route path='/portal/:id/payment-success' element={<PaymentSuccessPortal/>}></Route>

            <Route path='/settings' element={<ProtectedRoute><AppLayout><Settings/></AppLayout></ProtectedRoute>}></Route>

            <Route path='/clients/:id' element={<ProtectedRoute><AppLayout><ClientDetail/></AppLayout></ProtectedRoute>}></Route>

            <Route path='/billing' element={<ProtectedRoute><AppLayout><Billing/></AppLayout></ProtectedRoute>}></Route>

            <Route path='/billing/payment-success' element={<ProtectedRoute><AppLayout><SubscriptionPaymentSuccess/></AppLayout></ProtectedRoute>}></Route>

        </Routes>

    )

}