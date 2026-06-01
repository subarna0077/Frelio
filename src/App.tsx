import { AppRouter } from './router/AppRouter'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import { supabase } from './lib/supabase'
import { useEffect } from 'react'
import { useAuthStore } from './features/auth/stores/authStore'

function App() {

  const logout = useAuthStore(state => state.logout)
  const setUser = useAuthStore(state => state.setUser)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        logout()
      }

    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) logout();
      if (event === 'SIGNED_IN') setUser({
        id: session!.user.id,
        name: session!.user.user_metadata.full_name,
        email: session!.user.email!
      });
      if (event === 'TOKEN_REFRESHED') setUser({
        id: session!.user.id,
        name: session!.user.user_metadata.full_name,
        email: session!.user.email!
      })

      return () => subscription.unsubscribe()

    })
  }, [])


  return (
    <>
      <ReactQueryDevtools />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1f1f1f',
            color: '#fff',
            borderRadius: '10px',
            border: '1px solid #333',
            padding: '14px',
          },

          success: {
            style: {
              background: '#1b4332',
              color: '#d8f3dc',
            },
          },

          error: {
            style: {
              background: '#3b0d0c',
              color: '#ffb4b4',
              border: '1px solid #ff4d4f',
            },
          },
        }}
      />

      <AppRouter />
    </>
  )
}

export default App