import { AppRouter } from './router/AppRouter'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'

function App() {
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