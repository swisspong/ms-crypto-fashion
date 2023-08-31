import MyThemeProvider from '@/lib/theme/MythemeContext'
import '@/styles/globals.css'
import React, { useContext, useState } from "react";
import {
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import Router, { useRouter } from "next/router";
import { ThemeProvider, useTheme } from "next-themes";
import notify from "@/components/Notification";
import { Toaster } from "react-hot-toast";

interface QueryCacheError extends AxiosError {
  // Define any additional properties you want to include in the error
  customProperty: string;
}

export default function App({ Component, pageProps }: AppProps) {

  const router = useRouter();

 

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        }
      })
  );


  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <QueryClientProvider client={queryClient}>
        <MyThemeProvider>
          <ReactQueryDevtools />
          <Component {...pageProps} />
        </MyThemeProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
