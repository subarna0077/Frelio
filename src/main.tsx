import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    },
  },
})


createRoot(document.getElementById('root')!).render(

  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
       
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
