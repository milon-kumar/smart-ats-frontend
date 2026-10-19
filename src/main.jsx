import { createRoot } from 'react-dom/client'
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/AppRoutes.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router}/>
  </QueryClientProvider>
)
