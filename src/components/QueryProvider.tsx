"use client"

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export const QueryProvider = ({ children } : {children: React.ReactNode}) => {
    const [client] = useState(new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }))

    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
} 